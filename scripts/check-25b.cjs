// Capture du TOC mobile <details> ouvert (coordonnées page)
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/conseils/apres-chirurgie', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    document.querySelector('details').open = true;
  });
  await new Promise(r => setTimeout(r, 400));
  const box = await page.evaluate(() => {
    const d = document.querySelector('details');
    const r = d.getBoundingClientRect();
    return { y: r.top + window.scrollY, height: r.height };
  });
  await page.screenshot({
    path: 'screenshots/check-25-mobile-toc.png',
    clip: { x: 0, y: box.y - 30, width: 390, height: Math.min(box.height + 60, 900) },
  });
  console.log('toc mobile h=', Math.round(box.height));
  await browser.close();
})();
