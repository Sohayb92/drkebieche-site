// Capture par ancre précise : #endodontie + table couronnes + bloc avis
const puppeteer = require('puppeteer');

async function clipById(page, url, id, file, h, offset = 0) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  const y = await page.evaluate((i) => {
    const el = document.getElementById(i);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, id);
  await page.screenshot({ path: 'screenshots/' + file, clip: { x: 0, y: y + offset, width: 1280, height: h } });
  console.log(file, 'y=', Math.round(y));
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });

  await clipById(page, 'http://localhost:4321/soins/soins-quotidiens', 'endodontie', 'fix-endo2.png', 700);
  // table couronnes : ~600px après le début de la section couronnes-bridges
  await clipById(page, 'http://localhost:4321/soins/dentisterie-adhesive-protheses', 'couronnes-bridges', 'fix-couronnes2.png', 900, 300);

  await browser.close();
})();
