// Vérif Lot 2.5 : urgence box top, TOC mobile <details>, scrollspy, related, CTA conseil
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 1. Desktop : haut de fiche (hero + urgence box + début TOC)
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/conseils/apres-chirurgie', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/check-25-top.png', clip: { x: 0, y: 0, width: 1280, height: 900 } });

  // 2. Desktop : scroll vers la 2e section → scrollspy doit surligner le 2e lien
  await page.evaluate(() => document.getElementById('alimentation-hygiene').scrollIntoView());
  await new Promise(r => setTimeout(r, 800));
  const activeLink = await page.evaluate(() => {
    const a = document.querySelector('.toc-link.active');
    return a ? a.textContent.trim() : null;
  });
  console.log('scrollspy actif sur :', activeLink);
  await page.screenshot({ path: 'screenshots/check-25-spy.png', clip: { x: 0, y: 0, width: 1280, height: 700 } });

  // 3. Desktop : bas de page (related + disclaimer + CTA conseil)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  const footY = await page.evaluate(() => {
    const rel = [...document.querySelectorAll('section')].find(s => s.textContent.includes('À lire aussi'));
    return rel ? rel.getBoundingClientRect().top + window.scrollY : 0;
  });
  await page.screenshot({ path: 'screenshots/check-25-bottom.png', clip: { x: 0, y: footY - 20, width: 1280, height: 940 } });

  // 4. Mobile : TOC <details> ouvert
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/conseils/apres-chirurgie', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    document.querySelector('details').open = true;
    document.querySelector('details').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'screenshots/check-25-mobile.png', clip: { x: 0, y: 0, width: 390, height: 844 } });

  console.log('captures ok');
  await browser.close();
})();
