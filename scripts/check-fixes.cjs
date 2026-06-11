// Vérif corrections : endodontie, table couronnes, carie arrêtée, avis fiches
const puppeteer = require('puppeteer');

async function clipSection(page, url, marker, file, h = 940) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  const y = await page.evaluate((m) => {
    const el = [...document.querySelectorAll('section, h2, p')].find(e => e.textContent.includes(m));
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  }, marker);
  await page.screenshot({ path: 'screenshots/' + file, clip: { x: 0, y: Math.max(0, y - 40), width: 1280, height: h } });
  console.log(file, 'y=', Math.round(y));
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 980, deviceScaleFactor: 1 });

  await clipSection(page, 'http://localhost:4321/soins/soins-quotidiens', 'Traitement de racine', 'fix-endo.png');
  await clipSection(page, 'http://localhost:4321/soins/dentisterie-adhesive-protheses', 'En quel matériau', 'fix-couronnes.png', 700);
  await clipSection(page, 'http://localhost:4321/soins/soins-quotidiens', 'Une exception, au tout premier stade', 'fix-carie.png', 600);
  await clipSection(page, 'http://localhost:4321/conseils/apres-chirurgie', 'Satisfait de votre prise en charge', 'fix-avis.png', 500);

  await browser.close();
})();
