// Passe finale : hero home desktop + home mobile + conseils index
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 940, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: 'screenshots/check-28-hero.png', clip: { x: 0, y: 0, width: 1440, height: 940 } });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: 'screenshots/check-28-home-mobile.png', clip: { x: 0, y: 0, width: 390, height: 844 } });

  await page.setViewport({ width: 1280, height: 940, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/conseils', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/check-28-conseils.png', clip: { x: 0, y: 0, width: 1280, height: 940 } });

  console.log('ok');
  await browser.close();
})();
