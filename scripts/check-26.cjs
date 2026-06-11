// Vérif Lot 2.6 : honoraires mise en scène + hub /soins vignettes
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });

  // Honoraires : 2 zones
  await page.goto('http://localhost:4321/honoraires', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/check-26-hono-1.png', clip: { x: 0, y: 300, width: 1280, height: 980 } });
  await page.screenshot({ path: 'screenshots/check-26-hono-2.png', clip: { x: 0, y: 1280, width: 1280, height: 980 } });

  // Hub soins : 2 premières cards (fonds alternés + vignettes)
  await page.goto('http://localhost:4321/soins', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/check-26-soins.png', clip: { x: 0, y: 420, width: 1280, height: 980 } });

  console.log('ok');
  await browser.close();
})();
