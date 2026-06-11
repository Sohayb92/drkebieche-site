// Vérif section retraitement + SchemaRTE
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/soins/soins-quotidiens', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  const y = await page.evaluate(() => {
    const el = document.getElementById('retraitement');
    return el ? el.getBoundingClientRect().top + window.scrollY : -1;
  });
  if (y < 0) { console.log('section absente'); process.exit(1); }
  await page.screenshot({ path: 'screenshots/rte-texte.png', clip: { x: 0, y: y - 10, width: 1280, height: 760 } });
  const fy = await page.evaluate(() => {
    const f = document.querySelector('#retraitement figure');
    return f ? f.getBoundingClientRect().top + window.scrollY : -1;
  });
  await page.screenshot({ path: 'screenshots/rte-schema.png', clip: { x: 0, y: fy - 10, width: 1280, height: 560 } });
  console.log('ok, texte y=', Math.round(y), 'figure y=', Math.round(fy));
  await browser.close();
})();
