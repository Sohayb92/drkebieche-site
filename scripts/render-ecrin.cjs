/**
 * Rend l'écrin email (fichier autonome ecrin-preview.html) en image,
 * pour valider l'ambiance premium AVANT de l'intégrer dans Mélyia.
 * Usage : node scripts/render-ecrin.cjs
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(ROOT, 'screenshots');

(async () => {
  if (!fs.existsSync(SHOTS)) fs.mkdirSync(SHOTS, { recursive: true });
  const fileUrl = 'file://' + path.join(ROOT, 'ecrin-preview.html').replace(/\\/g, '/');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 700, height: 900, deviceScaleFactor: 2 });
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 300));
    const out = path.join(SHOTS, 'ecrin-relance1.png');
    await page.screenshot({ path: out, fullPage: true });
    console.log('OK -> ' + out);
  } finally {
    await browser.close();
  }
})();
