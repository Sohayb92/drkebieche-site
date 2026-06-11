// Captures chantier C : urgences, faq (1 item ouvert), second-avis, en, maintenance
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 940, deviceScaleFactor: 1 });

  const shots = [
    { url: '/urgences', file: 'c-urgences.png' },
    { url: '/second-avis', file: 'c-second-avis.png' },
    { url: '/en', file: 'c-en.png' },
    { url: '/conseils/maintenance-implants', file: 'c-implants.png' },
  ];
  for (const s of shots) {
    await page.goto('http://localhost:4321' + s.url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: 'screenshots/' + s.file, clip: { x: 0, y: 0, width: 1280, height: 940 } });
    console.log(s.file, 'ok');
  }

  // FAQ avec le 2e item ouvert
  await page.goto('http://localhost:4321/faq', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('details')[1].open = true;
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/c-faq.png', clip: { x: 0, y: 0, width: 1280, height: 940 } });
  console.log('c-faq.png ok');

  await browser.close();
})();
