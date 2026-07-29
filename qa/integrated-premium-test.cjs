const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 768 }, permissions: [] });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('http://127.0.0.1:5188/?qa=premium-integrated', { waitUntil: 'networkidle' });

  const states = {};
  for (const name of ['Google Workspace', 'Social posting', 'After-hours calls', 'Photo delivery']) {
    await page.getByRole('tab', { name: new RegExp(name) }).click();
    await page.waitForTimeout(80);
    states[name] = await page.evaluate(() => ({
      selected: document.querySelector('[role=tab][aria-selected="true"]')?.textContent?.trim(),
      messages: [...document.querySelectorAll('.tg-bubble')].map(el => el.textContent?.trim()),
      hasMedia: !!document.querySelector('.tg-photo')
    }));
  }

  await page.getByRole('tab', { name: /Social posting/ }).click();
  await page.getByRole('textbox', { name: 'Ask Stay Automatic' }).fill('What should I build first for my restaurant?');
  await page.getByLabel('Send message').click();
  await page.waitForTimeout(1100);

  const integrated = await page.evaluate(() => {
    const screen = document.querySelector('.screen-aperture');
    const frame = document.querySelector('.phone-frame');
    const glass = document.querySelector('.screen-glass');
    const z = el => Number(getComputedStyle(el).zIndex);
    return {
      frameSource: frame?.getAttribute('src'),
      frameLoaded: frame?.complete && frame?.naturalWidth > 0,
      layerOrder: { screen: z(screen), frame: z(frame), glass: z(glass) },
      agentAvatars: document.querySelectorAll('img.msg-avatar[alt="Stay Automatic"]').length,
      userAvatars: document.querySelectorAll('img.msg-avatar[alt="You"]').length,
      contactAvatar: !!document.querySelector('.tg-contact-avatar'),
      restaurantAnswer: [...document.querySelectorAll('.tg-bubble')].some(el => el.textContent.includes('For a restaurant')),
      socialPhoto: !!document.querySelector('.tg-photo')
    };
  });
  await page.screenshot({ path: 'qa/stay-automatic-integrated-v5-interacted-1280.png' });

  await page.getByLabel('Start voice input').click();
  await page.waitForTimeout(700);
  const voice = await page.evaluate(() => ({
    note: document.querySelector('.voice-note')?.textContent,
    listening: document.querySelector('.mic-button')?.classList.contains('listening'),
    placeholder: document.querySelector('#phone-input')?.getAttribute('placeholder'),
    webSpeech: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }));

  await browser.close();
  const result = { states, integrated, voice, errors };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exit(1);
  if (!(integrated.layerOrder.screen < integrated.layerOrder.frame && integrated.layerOrder.frame < integrated.layerOrder.glass)) process.exit(2);
  if (!integrated.restaurantAnswer || !integrated.socialPhoto || !integrated.agentAvatars || !integrated.userAvatars) process.exit(3);
})();
