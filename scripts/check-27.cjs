// Vérif Lot 2.7 : logo italique réel + micro-typo dans le texte
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 400, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4321/soins/parodontologie', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 500));
  // Header (logo) + début du hero (texte avec apostrophes/fines)
  await page.screenshot({ path: 'screenshots/check-27-typo.png', clip: { x: 0, y: 0, width: 900, height: 400 } });
  console.log('ok');
  await browser.close();
})();
