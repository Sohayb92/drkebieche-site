/**
 * Capture la modale "Nouveau devis" de Mélyia (web/index.html) avec le sélecteur
 * de tags soins déplié, pour vérifier le rendu sans lancer l'app Electron.
 * Puppeteer est installé ici (drkebieche-site). Cible le fichier melyia.
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const target = 'file:///C:/Users/Famille/melyia/web/index.html';
  const out = 'C:/Users/Famille/melyia/audit/melyia-form-soins.png';
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    await p.setViewport({ width: 960, height: 1500, deviceScaleFactor: 2 });
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p.goto(target, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500)); // laisser Tailwind CDN générer les classes

    await p.evaluate(() => {
      const ov = document.getElementById('modal-form-overlay');
      if (ov) ov.classList.remove('hidden');
      const sheet = ov ? ov.querySelector('.sheet') : null;
      if (sheet) sheet.style.maxHeight = 'none';
      // déplier le <details> qui contient le sélecteur de soins
      document.querySelectorAll('#devis-form details').forEach(d => {
        if (d.querySelector('#form-soins-keys-wrap')) d.open = true;
      });
      // pré-cocher quelques chips pour voir l'état sélectionné
      ['implant', 'comblement', 'rte', 'overlay'].forEach(v => {
        const c = document.querySelector('#form-soins-keys-wrap input[value="' + v + '"]');
        if (c) c.checked = true;
      });
      document.body.style.overflow = '';
    });
    await new Promise(r => setTimeout(r, 500));

    const el = await p.$('#modal-form-overlay .sheet');
    if (el) await el.screenshot({ path: out });
    else await p.screenshot({ path: out, fullPage: true });
    console.log('OK ->', out, '| pageerrors:', errs.length, errs.slice(0, 3));
  } finally {
    await b.close();
  }
})();
