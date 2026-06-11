// Capture zoomée de chaque <figure> (schéma) des pages familles — pour auto-review
const puppeteer = require('puppeteer');
const path = require('path');

const PAGES = [
  { route: '/soins/implantologie-chirurgie', slug: 'implanto' },
  { route: '/soins/parodontologie', slug: 'paro' },
  { route: '/soins/soins-quotidiens', slug: 'quotidien' },
  { route: '/soins/dentisterie-adhesive-protheses', slug: 'adhesive' },
  { route: '/conseils/hygiene', slug: 'hygiene' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('[pageerror]', e.message));

  for (const p of PAGES) {
    const res = await page.goto('http://localhost:4321' + p.route, { waitUntil: 'networkidle0' });
    if (!res.ok()) { console.log(`✗ ${p.route} → HTTP ${res.status()}`); continue; }
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
      document.querySelector('astro-dev-toolbar')?.remove();
    });
    await new Promise(r => setTimeout(r, 500));
    const figures = await page.$$('figure');
    console.log(`${p.route} : ${figures.length} figure(s)`);
    for (let i = 0; i < figures.length; i++) {
      const file = path.resolve(__dirname, '..', 'screenshots', `fig-${p.slug}-${i + 1}.png`);
      await figures[i].screenshot({ path: file });
      console.log(`  ✓ fig-${p.slug}-${i + 1}.png`);
    }
  }
  await browser.close();
})();
