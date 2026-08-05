const { chromium } = require('playwright')

const BASE = process.env.QA_URL || 'http://127.0.0.1:5188/'

const requiredCopy = [
  'Custom AI setup guide',
  'Show us where work gets stuck.',
  'Use the tool in front of you',
  'Build my guide',
]

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 768 } })
  const errors = []

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto(BASE, { waitUntil: 'networkidle' })

  const bodyText = await page.locator('body').evaluate((node) => node.textContent ?? '')
  for (const copy of requiredCopy) {
    if (!bodyText.includes(copy)) throw new Error(`Missing required positioning copy: ${copy}`)
  }

  const before = await page.evaluate(() => {
    const shell = document.querySelector('.page-shell')
    const device = document.querySelector('.device-render')
    const aperture = document.querySelector('.screen-aperture')
    const editorial = document.querySelector('.editorial-copy')
    const backdrop = document.querySelector('.phone-focus-backdrop')
    const rect = device?.getBoundingClientRect()
    return {
      focused: shell?.classList.contains('phone-focus'),
      backdropExists: Boolean(backdrop),
      deviceHeight: rect?.height ?? 0,
      deviceTop: rect?.top ?? 0,
      deviceBottom: rect?.bottom ?? 0,
      apertureTransform: aperture ? getComputedStyle(aperture).transform : '',
      editorialFilter: editorial ? getComputedStyle(editorial).filter : '',
      editorialOpacity: editorial ? Number(getComputedStyle(editorial).opacity) : 1,
    }
  })

  if (!before.backdropExists) throw new Error('Missing .phone-focus-backdrop')
  if (before.focused) throw new Error('Phone focus should not be active before hover')

  await page.locator('.phone-scene').hover()
  await page.waitForTimeout(650)

  const after = await page.evaluate(() => {
    const shell = document.querySelector('.page-shell')
    const device = document.querySelector('.device-render')
    const aperture = document.querySelector('.screen-aperture')
    const editorial = document.querySelector('.editorial-copy')
    const backdrop = document.querySelector('.phone-focus-backdrop')
    const rect = device?.getBoundingClientRect()
    return {
      focused: shell?.classList.contains('phone-focus'),
      backdropOpacity: backdrop ? Number(getComputedStyle(backdrop).opacity) : 0,
      deviceHeight: rect?.height ?? 0,
      deviceTop: rect?.top ?? 0,
      deviceBottom: rect?.bottom ?? 0,
      apertureTransform: aperture ? getComputedStyle(aperture).transform : '',
      editorialFilter: editorial ? getComputedStyle(editorial).filter : '',
      editorialOpacity: editorial ? Number(getComputedStyle(editorial).opacity) : 1,
    }
  })

  await browser.close()

  if (errors.length) throw new Error(`Browser console errors: ${errors.join(' | ')}`)
  if (!after.focused) throw new Error('Missing .phone-focus state on .page-shell')
  if (after.backdropOpacity < 0.35) throw new Error('Phone focus backdrop did not become visible')
  if (after.deviceHeight < before.deviceHeight * 1.08) throw new Error('Phone did not enlarge enough in focus state')
  if (after.deviceTop < 0 || after.deviceBottom > 768) throw new Error('Focused phone clips at 1280x768')
  if (after.apertureTransform === before.apertureTransform) throw new Error('Focused screen-aperture transform did not change')
  if (!after.editorialFilter.includes('blur') && after.editorialOpacity > 0.72) {
    throw new Error('Editorial copy did not blur or recede during phone focus')
  }

  console.log(JSON.stringify({ before, after, errors }, null, 2))
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
