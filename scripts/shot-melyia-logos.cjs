/** Vérifie le bloc Logos (J0) : corps + buildLogosFooter (2 liens + signature corrigée). */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT = 'C:/Users/Famille/melyia/audit';

(async () => {
  const target = 'file:///C:/Users/Famille/melyia/web/index.html';
  fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p.goto(target, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 900));

    const res = await p.evaluate(() => {
      try {
        const footerAvecDevis = buildLogosFooter({ soinsKeys: ['implant', 'rte', 'overlay'], jeton: 'k7p2x9' });
        const footerSansDevis = buildLogosFooter(null);
        const body = "Cher Monsieur Dupont,\n\nSuite à notre consultation, je vous adresse le détail de votre plan de traitement.\n\n1. Reprise de traitement endodontique\n\nLa première molaire en haut à droite (seize) présente une infection à l'extrémité de la racine. Nous procéderons à une reprise du traitement pour désinfecter le réseau de racines.\n\n2. Pose d'un implant\n\nLa deuxième prémolaire en bas à gauche sera remplacée par un implant après cicatrisation.\n\nJe reste à votre disposition pour toute question.";
        return { ok: true, footerAvecDevis, footerSansDevis, full: body + footerAvecDevis };
      } catch (e) { return { err: String(e) }; }
    });

    if (res.err) { console.log('ERREUR:', res.err); await b.close(); process.exit(1); }
    console.log('--- FOOTER AVEC DEVIS ---\n' + res.footerAvecDevis);
    console.log('\n--- FOOTER SANS DEVIS ---\n' + res.footerSansDevis);
    console.log('\npageerrors:', errs.length, errs.slice(0, 3));

    // Aperçu visuel : la modale vulgarize avec le bloc complet dans le textarea
    await p.evaluate((full) => {
      const ov = document.getElementById('modal-vulgarize-overlay');
      if (ov) ov.classList.remove('hidden');
      const sheet = ov ? ov.querySelector('.sheet') : null;
      if (sheet) sheet.style.maxHeight = 'none';
      document.getElementById('vulgarize-result-block').classList.remove('hidden');
      const ta = document.getElementById('vulgarize-output');
      ta.value = full; ta.style.height = '520px';
      document.body.style.overflow = '';
    }, res.full);
    await new Promise(r => setTimeout(r, 300));
    const el = await p.$('#modal-vulgarize-overlay .sheet');
    const out = path.join(OUT, 'melyia-bloc-logos.png');
    if (el) await el.screenshot({ path: out }); else await p.screenshot({ path: out, fullPage: true });
    console.log('OK ->', out);
  } finally {
    await b.close();
  }
})();
