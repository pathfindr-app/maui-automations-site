const { chromium } = require('playwright')

const BASE = process.env.QA_URL || 'http://127.0.0.1:5188/'

const requiredCopy = [
  'Custom AI setup guide',
  'Learn to run your own agents.',
  'AI agents are becoming the new way work gets done',
  'Click here to begin',
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
    const screen = document.querySelector('.operator-screen')
    const frame = document.querySelector('.phone-frame')
    const glass = document.querySelector('.screen-glass')
    const editorial = document.querySelector('.editorial-copy')
    const backdrop = document.querySelector('.phone-focus-backdrop')
    const rect = device?.getBoundingClientRect()
    const z = (node) => node ? Number(getComputedStyle(node).zIndex) : -1
    return {
      focused: shell?.classList.contains('phone-focus'),
      backdropExists: Boolean(backdrop),
      ambientRobot: Boolean(document.querySelector('.ambient-robot')),
      orbitCards: document.querySelectorAll('.guide-orbit-card').length,
      deviceHeight: rect?.height ?? 0,
      deviceTop: rect?.top ?? 0,
      deviceBottom: rect?.bottom ?? 0,
      deviceTransform: device ? getComputedStyle(device).transform : '',
      apertureTransform: aperture ? getComputedStyle(aperture).transform : '',
      screenBackground: screen ? getComputedStyle(screen).backgroundColor : '',
      layerOrder: { screen: z(aperture), frame: z(frame), glass: z(glass) },
      editorialFilter: editorial ? getComputedStyle(editorial).filter : '',
      editorialOpacity: editorial ? Number(getComputedStyle(editorial).opacity) : 1,
    }
  })

  if (!before.backdropExists) throw new Error('Missing .phone-focus-backdrop')
  if (before.ambientRobot) throw new Error('Unexpected ambient robot background still rendered')
  if (before.orbitCards) throw new Error('Unexpected floating orbit cards still rendered')
  if (before.focused) throw new Error('Phone focus should not be active before click')
  if (!(before.layerOrder.screen < before.layerOrder.frame && before.layerOrder.frame < before.layerOrder.glass)) {
    throw new Error(`Bad phone layer order: ${JSON.stringify(before.layerOrder)}`)
  }

  await page.locator('.phone-scene').hover()
  await page.waitForTimeout(200)
  const hoverFocused = await page.locator('.page-shell.phone-focus').count()
  if (hoverFocused) throw new Error('Home phone should not focus on hover before click')

  await page.locator('.device-render').click()
  await page.waitForTimeout(900)
  await page.locator('.intake-shell').waitFor({ timeout: 5000 })

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
      deviceTransform: device ? getComputedStyle(device).transform : '',
      apertureTransform: aperture ? getComputedStyle(aperture).transform : '',
      editorialFilter: editorial ? getComputedStyle(editorial).filter : '',
      editorialOpacity: editorial ? Number(getComputedStyle(editorial).opacity) : 1,
      intakeVisible: Boolean(document.querySelector('.intake-shell')),
    }
  })

  await browser.close()

  if (errors.length) throw new Error(`Browser console errors: ${errors.join(' | ')}`)
  if (!after.focused) throw new Error('Missing .phone-focus state on .page-shell')
  if (!after.intakeVisible) throw new Error('Clicking the phone did not open the working intake screen')
  if (after.backdropOpacity < 0.35) throw new Error('Phone focus backdrop did not become visible')
  if (after.deviceHeight < before.deviceHeight * 1.04) throw new Error('Phone did not visibly enlarge in focus state')
  if (after.deviceTop < 0 || after.deviceBottom > 768) throw new Error('Focused phone clips at 1280x768')
  if (after.apertureTransform === before.apertureTransform) throw new Error('Focused screen-aperture transform did not change')
  if (after.deviceTransform === before.deviceTransform) throw new Error('Focused device transform did not rotate toward the viewer')
  if (!after.editorialFilter.includes('blur') && after.editorialOpacity > 0.72) {
    throw new Error('Editorial copy did not blur or recede during phone focus')
  }

  console.log(JSON.stringify({ before, after, errors }, null, 2))
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
