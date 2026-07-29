const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 768 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('http://127.0.0.1:5188/?qa=telegram-v2-interaction-terminal', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /Social posting/ }).click();
  await page.getByRole('textbox', { name: 'Ask Stay Automatic' }).fill('What should I build first for my restaurant?');
  await page.getByLabel('Send message').click();
  await page.waitForTimeout(900);
  const beforeMic = await page.evaluate(() => ({
    selected: [...document.querySelectorAll('[role=tab][aria-selected="true"]')].map(b => b.textContent),
    hasTelegramHeader: !!document.querySelector('.tg-header'),
    hasLogo: !!document.querySelector('.tg-logo'),
    hasAgentAvatar: !!document.querySelector('.msg-avatar.sa'),
    hasUserAvatar: !!document.querySelector('.msg-avatar.you'),
    hasPhoto: !!document.querySelector('.tg-photo'),
    bubbleTexts: [...document.querySelectorAll('.tg-bubble')].map(b => b.textContent),
    checks: document.querySelector('.tg-checks')?.textContent,
    screenRect: document.querySelector('.telegram-screen')?.getBoundingClientRect().toJSON(),
    shellRect: document.querySelector('.phone-shell')?.getBoundingClientRect().toJSON(),
    webSpeech: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }));
  await page.getByLabel('Start voice input').click();
  await page.waitForTimeout(800);
  const afterMic = await page.evaluate(() => ({
    micClass: document.querySelector('.mic-button')?.className,
    voiceNotes: [...document.querySelectorAll('.voice-note')].map(n => n.textContent),
    placeholder: document.querySelector('#phone-input')?.getAttribute('placeholder')
  }));
  await page.screenshot({ path: 'qa/stay-automatic-telegram-v2-interacted-1280.png', fullPage: false });
  await browser.close();
  console.log(JSON.stringify({ beforeMic, afterMic, errors }, null, 2));
})();
