/** v2.6.2 : verifie buildRappelUrl(+nom), le strip de l'ancienne signature IA,
    et rend le bloc Logos final (UNE seule signature). */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const OUT = 'C:/Users/Famille/melyia/audit';

const FAKE_AI = `Cher Monsieur Dupont,

Suite à notre consultation, je vous adresse le détail de votre plan de traitement.

1. Prise en charge implantaire de la Dix-sept (première molaire en haut à droite)

Pour remplacer la Dix-sept, nous vous proposons la pose d'un implant dentaire.

2. Restauration de la Vingt-six (première molaire en haut à gauche)

Pour la Vingt-six, nous envisageons la pose d'un overlay.

N'hésitez pas à me solliciter si vous avez la moindre interrogation.

Bien cordialement,
Dr KEBIECHE
Téléphone : 01 42 42 94 69

Diplômé de l'Université Paris Descartes
Ancien Praticien Hospitalier en Service de Chirurgie Orale
D.U d'Implantologie et d'Esthétique dentaire - Université d'Evry
D.U de parodontologie avancé - Université Côte d'Azur`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));

    const res = await p.evaluate((fake) => {
      try {
        const rappel = buildRappelUrl('k7p2x9', UTM_RELANCE, 'Jean Dupont');
        // reproduit la logique de doVulgarize (strip + footer)
        const corps = fake.replace(/\n+\s*Bien cordialement[\s\S]*$/i, '').replace(/\s+$/, '');
        const full = corps + buildLogosFooter({ soinsKeys: ['implant', 'overlay'], jeton: 'k7p2x9' }, 'Jean Dupont');
        return {
          rappel,
          nbBienCordialement: (full.match(/Bien cordialement/g) || []).length,
          aAncienneSig: /Praticien Hospitalier|Dr KEBIECHE|Paris Descartes|Evry/.test(full),
          full
        };
      } catch (e) { return { err: String(e) }; }
    }, FAKE_AI);

    if (res.err) { console.log('ERREUR:', res.err); await b.close(); process.exit(1); }
    console.log('lien rappel : ' + res.rappel);
    console.log('nb "Bien cordialement" : ' + res.nbBienCordialement + ' (attendu 1)');
    console.log('ancienne signature presente : ' + res.aAncienneSig + ' (attendu false)');
    console.log('pageerrors : ' + errs.length, errs.slice(0, 3));

    // Rendu visuel
    await p.evaluate((full) => {
      const ov = document.getElementById('modal-vulgarize-overlay'); if (ov) ov.classList.remove('hidden');
      const sheet = ov ? ov.querySelector('.sheet') : null; if (sheet) sheet.style.maxHeight = 'none';
      document.getElementById('vulgarize-result-block').classList.remove('hidden');
      const ta = document.getElementById('vulgarize-output'); ta.value = full; ta.style.height = '560px';
      document.body.style.overflow = '';
    }, res.full);
    await new Promise(r => setTimeout(r, 300));
    const el = await p.$('#modal-vulgarize-overlay .sheet');
    const out = path.join(OUT, 'melyia-bloc-logos-v262.png');
    if (el) await el.screenshot({ path: out }); else await p.screenshot({ path: out, fullPage: true });
    console.log('OK ->', out);
  } finally {
    await b.close();
  }
})();
