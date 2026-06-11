// Vérif chantier B : dessin des schémas + timeline praticien + reduced-motion
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

  // 1. État initial : éléments du schéma préparés (masqués) avant scroll
  await page.goto('http://localhost:4321/soins/soins-quotidiens', { waitUntil: 'networkidle0' });
  const initial = await page.evaluate(() => {
    const el = document.querySelector('#caries figure svg path');
    if (!el) return 'pas de svg';
    return { fillOpacity: el.style.fillOpacity, dashoffset: el.style.strokeDashoffset !== '' && el.style.strokeDashoffset !== '0' };
  });
  console.log('initial (doit être masqué) :', JSON.stringify(initial));

  // 2. Scroll vers le schéma carie → dessin → état final complet
  await page.evaluate(() => document.querySelector('#caries figure').scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 2600));
  const final = await page.evaluate(() => {
    const els = [...document.querySelectorAll('#caries figure svg path')];
    return {
      tousTraces: els.every(e => !e.dataset.draw || e.style.strokeDashoffset === '0'),
      tousVisibles: els.every(e => parseFloat(e.style.fillOpacity) > 0 || e.dataset.fo === '0'),
    };
  });
  console.log('final (tout doit être true) :', JSON.stringify(final));
  const figY = await page.evaluate(() => {
    const f = document.querySelector('#caries figure');
    return f.getBoundingClientRect().top + window.scrollY;
  });
  await page.screenshot({ path: 'screenshots/anim-carie-final.png', clip: { x: 0, y: figY - 10, width: 1280, height: 620 } });

  // 3. Timeline praticien
  await page.goto('http://localhost:4321/praticien', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('.timeline-dot')[3].scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 1500));
  const timeline = await page.evaluate(() => {
    const dot = document.querySelectorAll('.timeline-dot')[3];
    return getComputedStyle(dot).transform;
  });
  console.log('timeline dot transform (matrice identité ou none attendu) :', timeline);

  // 4. Reduced motion : tout visible immédiatement, sans préparation
  const page2 = await browser.newPage();
  await page2.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page2.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page2.goto('http://localhost:4321/soins/soins-quotidiens', { waitUntil: 'networkidle0' });
  const rm = await page2.evaluate(() => {
    const el = document.querySelector('#caries figure svg path');
    return { fillOpacity: el.style.fillOpacity === '', dashUntouched: el.style.strokeDashoffset === '' };
  });
  console.log('reduced-motion (les deux true = intact) :', JSON.stringify(rm));

  await browser.close();
})();
