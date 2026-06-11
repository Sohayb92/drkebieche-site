// Vérif rendu du portrait sur home + praticien
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 940, deviceScaleFactor: 1 });

  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: 'screenshots/portrait-home.png', clip: { x: 0, y: 0, width: 1440, height: 940 } });

  await page.goto('http://localhost:4321/praticien', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: 'screenshots/portrait-praticien.png', clip: { x: 0, y: 0, width: 1440, height: 880 } });

  console.log('ok');
  await browser.close();
})();
