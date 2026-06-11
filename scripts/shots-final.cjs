// Captures pour l'audit final : 15 pages × (desktop haut + desktop milieu + mobile haut)
// Toutes ≤ 2000 px par dimension (lisibles par les agents).
const puppeteer = require('puppeteer');
const fs = require('fs');

const ROUTES = [
  ['home', '/'],
  ['praticien', '/praticien'],
  ['soins', '/soins'],
  ['implanto', '/soins/implantologie-chirurgie'],
  ['quotidien', '/soins/soins-quotidiens'],
  ['conseils', '/conseils'],
  ['consult', '/conseils/premiere-consultation'],
  ['apres-chir', '/conseils/apres-chirurgie'],
  ['honoraires', '/honoraires'],
  ['cabinet', '/cabinet'],
  ['contact', '/contact'],
  ['urgences', '/urgences'],
  ['faq', '/faq'],
  ['second-avis', '/second-avis'],
  ['en', '/en'],
  ['devis', '/comprendre-mon-devis'],
];

(async () => {
  fs.mkdirSync('screenshots/final', { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  for (const [nom, route] of ROUTES) {
    // Desktop : 2 segments
    await page.setViewport({ width: 1440, height: 980, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4321' + route, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('visible'));
      // Révéler aussi les schémas (animation de dessin) pour les captures
      document.querySelectorAll('main figure svg').forEach((svg) => {
        svg.querySelectorAll('path, line, polyline, polygon, rect, circle').forEach((el) => {
          el.style.transition = 'none';
          if (el.dataset.draw) el.style.strokeDashoffset = '0';
          if (el.dataset.op !== undefined) el.style.opacity = el.dataset.op;
          el.style.fillOpacity = el.dataset.fo || '1';
        });
      });
    });
    await new Promise((r) => setTimeout(r, 500));
    const H = await page.evaluate(() => document.body.scrollHeight);
    await page.screenshot({ path: `screenshots/final/${nom}-d1.png`, clip: { x: 0, y: 0, width: 1440, height: Math.min(980, H) } });
    if (H > 1100) {
      await page.screenshot({ path: `screenshots/final/${nom}-d2.png`, clip: { x: 0, y: 980, width: 1440, height: Math.min(980, H - 980) } });
    }

    // Mobile : 1 segment haut (390 × ≤1900)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.goto('http://localhost:4321' + route, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('visible'));
      document.querySelectorAll('main figure svg').forEach((svg) => {
        svg.querySelectorAll('path, line, polyline, polygon, rect, circle').forEach((el) => {
          el.style.transition = 'none';
          if (el.dataset.draw) el.style.strokeDashoffset = '0';
          if (el.dataset.op !== undefined) el.style.opacity = el.dataset.op;
          el.style.fillOpacity = el.dataset.fo || '1';
        });
      });
    });
    await new Promise((r) => setTimeout(r, 500));
    const Hm = await page.evaluate(() => document.body.scrollHeight);
    await page.screenshot({ path: `screenshots/final/${nom}-m.png`, clip: { x: 0, y: 0, width: 390, height: Math.min(1900, Hm) } });

    console.log(nom, 'ok (H desktop =', H + ')');
  }
  await browser.close();
})();
