// Capture du SchemaRTE après scroll réel (déclenche l'animation de dessin)
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/soins/soins-quotidiens', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await page.evaluate(() => document.querySelector('#retraitement figure').scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 2800));
  const fy = await page.evaluate(() => document.querySelector('#retraitement figure').getBoundingClientRect().top + window.scrollY);
  await page.screenshot({ path: 'screenshots/rte-schema2.png', clip: { x: 0, y: fy - 10, width: 1280, height: 560 } });
  console.log('ok');
  await browser.close();
})();
