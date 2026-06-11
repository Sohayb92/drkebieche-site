// Vérif Lot 2.4 : hero praticien (desktop+mobile), 404, contact H1
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const shots = [
    { url: 'http://localhost:4321/praticien', w: 1280, file: 'check-24-praticien.png', h: 760 },
    { url: 'http://localhost:4321/praticien', w: 390, file: 'check-24-praticien-mobile.png', h: 844 },
    { url: 'http://localhost:4321/404', w: 390, file: 'check-24-404-mobile.png', h: 844 },
    { url: 'http://localhost:4321/contact', w: 390, file: 'check-24-contact-mobile.png', h: 844 },
  ];

  for (const s of shots) {
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
    await page.goto(s.url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: 'screenshots/' + s.file, clip: { x: 0, y: 0, width: s.w, height: s.h } });
    console.log(s.file, 'ok');
  }
  await browser.close();
})();
