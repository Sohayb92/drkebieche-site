// Smoke test : toutes les routes, erreurs console + erreurs JS + 404 ressources
const puppeteer = require('puppeteer');

const ROUTES = [
  '/', '/praticien', '/cabinet', '/honoraires', '/contact', '/404',
  '/soins', '/soins/implantologie-chirurgie', '/soins/parodontologie',
  '/soins/dentisterie-adhesive-protheses', '/soins/soins-quotidiens',
  '/conseils', '/conseils/premiere-consultation', '/conseils/avant',
  '/conseils/apres-chirurgie', '/conseils/apres-parodontologie',
  '/conseils/blanchiment', '/conseils/hygiene',
  '/mentions-legales', '/confidentialite', '/cookies',
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  let issues = 0;

  page.on('console', (msg) => {
    if (msg.type() === 'error') { console.log('  [console.error]', msg.text().slice(0, 200)); issues++; }
  });
  page.on('pageerror', (err) => { console.log('  [pageerror]', String(err).slice(0, 200)); issues++; });
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('/api/contact')) {
      console.log('  [' + res.status() + ']', res.url()); issues++;
    }
  });

  for (const r of ROUTES) {
    process.stdout.write(r + '\n');
    await page.goto('http://localhost:4321' + r, { waitUntil: 'networkidle0', timeout: 20000 });
  }

  console.log('\n' + (issues === 0 ? 'AUCUN problème détecté sur ' + ROUTES.length + ' routes' : issues + ' problème(s)'));
  await browser.close();
})();
