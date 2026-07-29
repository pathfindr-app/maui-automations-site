const { chromium } = require('playwright')
const fs = require('node:fs')

const BASE = process.env.QA_URL || 'http://localhost:5173/'
const OUT = '/root/kyle/projects/maui-automations-site/qa/onboarding'
fs.mkdirSync(OUT, { recursive: true })

async function answerOption(page, label) {
  await page.getByRole('button', { name: label, exact: true }).click()
}

async function run(viewport, name) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport })
  const errors = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${OUT}/${name}-home.png`, fullPage: false })
  await page.locator('.editorial-copy [data-action="start-blueprint"]').click()
  await page.locator('.intake-shell').waitFor()
  await page.waitForTimeout(name === 'mobile' ? 800 : 350)
  await page.screenshot({ path: `${OUT}/${name}-intake.png`, fullPage: false })

  await answerOption(page, 'Roofing / trades')
  await answerOption(page, '2–10 people')

  await page.locator('[data-question="goal"]').fill('Stop inbound leads getting lost between email, texts, and our tracking sheet')
  await page.getByRole('button', { name: 'Continue' }).click()

  await answerOption(page, 'Inbound leads')
  await page.getByRole('button', { name: 'Continue' }).click()

  await answerOption(page, 'Google Workspace')
  await answerOption(page, 'Jobber / CRM')
  await answerOption(page, 'Google Sheets')
  await page.getByRole('button', { name: 'Continue' }).click()

  await answerOption(page, 'I own or administer most accounts')
  await answerOption(page, 'Customer communication with approval')
  await answerOption(page, 'Telegram or text-style chat')
  await answerOption(page, 'Reduce dropped work')

  const result = page.locator('.blueprint-view')
  await result.waitFor()
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${name}-blueprint.png`, fullPage: false })
  const title = await result.locator('h2').innerText()
  const body = await result.innerText()
  if (!/lead response coordinator/i.test(title)) throw new Error(`Unexpected blueprint title: ${title}`)
  for (const expected of ['AI operator', 'Google Workspace', 'Human approval', 'Seven-day']) {
    if (!body.toLowerCase().includes(expected.toLowerCase())) throw new Error(`Blueprint missing ${expected}`)
  }
  const mailto = await page.getByRole('link', { name: /send my blueprint/i }).getAttribute('href')
  if (!mailto?.startsWith('mailto:kyle@stayautomatic.com')) throw new Error(`Invalid blueprint handoff: ${mailto}`)

  const metrics = await page.evaluate(() => ({
    bodyHeight: document.body.scrollHeight,
    viewportHeight: window.innerHeight,
    overflowY: getComputedStyle(document.body).overflowY,
    intakeMode: document.querySelector('.page-shell')?.classList.contains('onboarding-mode'),
  }))
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`)
  await browser.close()
  return { name, title, mailto: Boolean(mailto), metrics, errors }
}

;(async () => {
  const results = []
  results.push(await run({ width: 1440, height: 1000 }, 'desktop'))
  results.push(await run({ width: 390, height: 844 }, 'mobile'))
  console.log(JSON.stringify(results, null, 2))
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
