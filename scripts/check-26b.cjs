// Vérif accents + vignettes 3 et 4 du hub /soins
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/soins', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));

  // Position des cards 3 et 4
  const y = await page.evaluate(() => {
    const cards = document.querySelectorAll('article.card');
    return cards[2] ? cards[2].getBoundingClientRect().top + window.scrollY : 0;
  });
  await page.screenshot({ path: 'screenshots/check-26-soins-2.png', clip: { x: 0, y: y - 10, width: 1280, height: 980 } });
  console.log('ok, cards 3-4 à y=', Math.round(y));
  await browser.close();
})();
