const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

(async () => {
  const root = __dirname;
  const html = path.join(root, 'Stay-Automatic-AI-Operator-Field-Manual.html');
  const outDir = path.join(root, 'dist');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1020, height: 1320 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(`file://${html}`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  const manualPdf = path.join(outDir, 'Stay-Automatic-AI-Operator-Field-Manual.pdf');
  const worksheetPdf = path.join(outDir, 'Stay-Automatic-AI-Operator-Worksheet-Pack.pdf');
  await page.pdf({
    path: manualPdf,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  const pageCount = await page.locator('.page').count();
  await browser.close();
  if (errors.length) {
    console.error(JSON.stringify({ errors }, null, 2));
    process.exit(1);
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stayautomatic-manual-'));
  try {
    execFileSync('pdfseparate', [manualPdf, path.join(tempDir, 'page-%d.pdf')]);
    const worksheetPages = [3, 8, 9, 10, 11, 14, 15, 17, 18, 23, 24, 25, 26, 34, 35, 36];
    execFileSync('pdfunite', [
      ...worksheetPages.map(number => path.join(tempDir, `page-${number}.pdf`)),
      worksheetPdf,
    ]);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  console.log(JSON.stringify({ pageCount, manualPdf, worksheetPdf }));
})();
