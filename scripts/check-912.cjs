// Vérifs actions 3-12 : hero home, header mobile, hero implanto + mot du praticien
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Home desktop : kicker fusionné + clôture
  await page.setViewport({ width: 1440, height: 940, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: 'screenshots/a912-home.png', clip: { x: 0, y: 0, width: 1440, height: 940 } });

  // Home mobile : header avec tél + 2 badges
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: 'screenshots/a912-home-mobile.png', clip: { x: 0, y: 0, width: 390, height: 844 } });

  // Drawer ouvert (12 liens + inert retiré)
  await page.click('#mobile-menu-btn');
  await new Promise((r) => setTimeout(r, 800));
  const drawer = await page.evaluate(() => {
    const m = document.getElementById('mobile-menu');
    return { inert: m.hasAttribute('inert'), liens: m.querySelectorAll('a').length };
  });
  console.log('drawer ouvert :', JSON.stringify(drawer));
  await page.screenshot({ path: 'screenshots/a912-drawer.png', clip: { x: 0, y: 0, width: 390, height: 844 } });

  // Implanto desktop : hero humanisé + bloc mot du praticien
  await page.setViewport({ width: 1280, height: 940, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/soins/implantologie-chirurgie', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('visible')));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/a912-implanto-hero.png', clip: { x: 0, y: 0, width: 1280, height: 560 } });
  const y = await page.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find((s) => s.textContent.trim() === 'Un mot du praticien');
    return el ? el.closest('section').getBoundingClientRect().top + window.scrollY : -1;
  });
  if (y > 0) await page.screenshot({ path: 'screenshots/a912-mot.png', clip: { x: 0, y, width: 1280, height: 420 } });
  console.log('mot praticien y=', Math.round(y));

  await browser.close();
})();
