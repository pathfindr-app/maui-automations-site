const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 768 } });
  const errors = [];
  const requests = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.route('https://stay-automatic-ai-api.vercel.app/api/chat', async route => {
    const body = route.request().postDataJSON();
    requests.push(body);
    await new Promise(resolve => setTimeout(resolve, 350));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        answer: 'Start with missed-call follow-up: capture the caller, qualify the lead, offer two booking times, and send you a concise morning summary.',
        requestId: 'qa-request',
      }),
    });
  });

  await page.goto('http://127.0.0.1:5188/?qa=ai-connected', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /After-hours calls/ }).click();
  await page.getByRole('textbox', { name: 'Ask Stay Automatic' }).fill('What should my roofing company automate first?');
  await page.getByLabel('Send message').click();

  const loading = await page.evaluate(() => ({
    typing: !!document.querySelector('.typing'),
    inputDisabled: document.querySelector('#phone-input')?.disabled,
    placeholder: document.querySelector('#phone-input')?.getAttribute('placeholder'),
  }));

  await page.waitForTimeout(650);
  const completed = await page.evaluate(() => ({
    typing: !!document.querySelector('.typing'),
    bubbles: [...document.querySelectorAll('.tg-bubble')].map(el => el.textContent),
    inputDisabled: document.querySelector('#phone-input')?.disabled,
    frame: document.querySelector('.phone-frame')?.getAttribute('src'),
  }));
  await page.screenshot({ path: 'qa/stay-automatic-ai-connected-1280.png' });
  await browser.close();

  const result = { requests, loading, completed, errors };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exit(1);
  if (!loading.typing || !loading.inputDisabled) process.exit(2);
  if (completed.typing || completed.inputDisabled) process.exit(3);
  if (!completed.bubbles.some(text => text.includes('missed-call follow-up'))) process.exit(4);
  if (requests[0]?.workflow !== 'After-hours calls') process.exit(5);
})();
