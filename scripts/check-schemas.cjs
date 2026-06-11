// Vérif schémas endodontie + couronnes
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });

  await page.goto('http://localhost:4321/soins/soins-quotidiens', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  let y = await page.evaluate(() => {
    const figs = [...document.querySelectorAll('#endodontie figure')];
    return figs.length ? figs[0].getBoundingClientRect().top + window.scrollY : -1;
  });
  if (y < 0) { console.log('PAS de figure endodontie'); } else {
    await page.screenshot({ path: 'screenshots/schema-endo.png', clip: { x: 0, y: y - 10, width: 1280, height: 560 } });
    console.log('schema-endo.png y=', Math.round(y));
  }

  await page.goto('http://localhost:4321/soins/dentisterie-adhesive-protheses', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  const res = await page.evaluate(() => {
    const figs = [...document.querySelectorAll('#couronnes-bridges figure')];
    return { count: figs.length, y: figs.length ? figs[0].getBoundingClientRect().top + window.scrollY : -1 };
  });
  console.log('figures dans couronnes-bridges :', res.count);
  if (res.y >= 0) {
    await page.screenshot({ path: 'screenshots/schema-couronnes.png', clip: { x: 0, y: res.y - 10, width: 1280, height: 560 } });
    console.log('schema-couronnes.png y=', Math.round(res.y));
  }

  await browser.close();
})();
