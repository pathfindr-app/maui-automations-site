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
    const voiceRequest = body.message.includes('voice transcript');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        answer: voiceRequest
          ? 'Your voice transcript reached the same guarded AI endpoint successfully.'
          : 'Start with missed-call follow-up: capture the caller, qualify the lead, offer two booking times, and send you a concise morning summary.',
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

  await page.evaluate(() => {
    class MockSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = 'en-US';
      onresult = null;
      onerror = null;
      start() {
        setTimeout(() => this.onresult?.({ results: [[{ transcript: 'This voice transcript should reach our AI.' }]] }), 20);
      }
      stop() {}
    }
    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = MockSpeechRecognition;
  });
  await page.getByLabel('Start voice input').click();
  await page.waitForTimeout(850);
  const voice = await page.evaluate(() => ({
    bubbles: [...document.querySelectorAll('.tg-bubble')].map(el => el.textContent),
    inputDisabled: document.querySelector('#phone-input')?.disabled,
  }));
  await page.screenshot({ path: 'qa/stay-automatic-ai-connected-1280.png' });
  await browser.close();

  const result = { requests, loading, completed, voice, errors };
  console.log(JSON.stringify(result, null, 2));
  if (errors.length) process.exit(1);
  if (!loading.typing || !loading.inputDisabled) process.exit(2);
  if (completed.typing || completed.inputDisabled) process.exit(3);
  if (!completed.bubbles.some(text => text.includes('missed-call follow-up'))) process.exit(4);
  if (requests[0]?.workflow !== 'After-hours calls') process.exit(5);
  if (requests[1]?.message !== 'This voice transcript should reach our AI.') process.exit(6);
  if (!voice.bubbles.some(text => text.includes('voice transcript reached'))) process.exit(7);
})();
