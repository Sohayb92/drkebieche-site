// Captures full-page desktop + mobile de toutes les pages — support pour l'audit multi-agents
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROUTES = [
  ['', 'home'],
  ['soins', 'soins'],
  ['soins/implantologie-chirurgie', 'implanto'],
  ['soins/parodontologie', 'paro'],
  ['soins/dentisterie-adhesive-protheses', 'adhesive'],
  ['soins/soins-quotidiens', 'quotidien'],
  ['praticien', 'praticien'],
  ['cabinet', 'cabinet'],
  ['honoraires', 'honoraires'],
  ['contact', 'contact'],
  ['conseils', 'conseils'],
  ['conseils/premiere-consultation', 'c-consult'],
  ['conseils/avant', 'c-avant'],
  ['conseils/apres-chirurgie', 'c-chir'],
  ['conseils/apres-parodontologie', 'c-paro'],
  ['conseils/blanchiment', 'c-blanchiment'],
  ['conseils/hygiene', 'c-hygiene'],
  ['mentions-legales', 'legales'],
  ['404-page-inexistante', '404'],
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

(async () => {
  const outDir = path.resolve(__dirname, '..', 'screenshots', 'audit');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1.5 });
    for (const [route, slug] of ROUTES) {
      try {
        await page.goto('http://localhost:4321/' + route, { waitUntil: 'networkidle0', timeout: 20000 });
        await page.evaluate(() => {
          document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
          document.querySelector('astro-dev-toolbar')?.remove();
        });
        await new Promise(r => setTimeout(r, 400));
        const file = path.join(outDir, `${slug}-${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`✓ ${slug}-${vp.name}.png`);
      } catch (e) {
        console.log(`✗ ${slug} (${vp.name}) : ${e.message}`);
      }
    }
  }
  await browser.close();
})();
