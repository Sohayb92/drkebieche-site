/**
 * Vérifie le rendu réel d'un mail Mélyia : charge web/index.html, appelle la
 * VRAIE fonction Gmail._textToHtml(corps) de l'app, et capture le HTML produit.
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SAMPLE = `Cher Monsieur Dupont,

J'espère que vous allez bien. Mon équipe et moi-même revenons vers vous au sujet du devis que nous vous avons adressé le 23 mai 2026. Prendre le temps de la réflexion est tout à fait normal : nous voulions simplement nous assurer qu'il ne vous manque rien pour décider.

Si vous avez une question sur les soins eux-mêmes, j'ai préparé une page qui explique chacun des traitements de votre devis, en termes simples :
[Comprendre mon devis](https://drkebieche.fr/comprendre-mon-devis?soins=implant,rte,overlay&utm_source=melyia&utm_medium=email&utm_campaign=relance)

Pour toute autre question, quelle qu'elle soit, répondez simplement à ce mail ou appelez le cabinet au 01 42 42 94 69 : nous y répondrons avec plaisir.

Et lorsque vous souhaiterez avancer, indiquez-le-nous simplement : mon équipe vous rappellera pour convenir ensemble de vos rendez-vous.
[[Je souhaite prendre rendez-vous|https://drkebieche.fr/rappel?r=k7p2x9&utm_source=melyia&utm_medium=email&utm_campaign=relance]]

Je reste à votre entière disposition.

Bien cordialement,`;

(async () => {
  const target = 'file:///C:/Users/Famille/melyia/web/index.html';
  const out = 'C:/Users/Famille/melyia/audit/melyia-mail-relance.png';
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    await p.goto(target, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));

    const result = await p.evaluate((sample) => {
      try {
        if (typeof Gmail === 'undefined' || !Gmail._textToHtml) return { err: 'Gmail introuvable' };
        return { html: Gmail._textToHtml(sample) };
      } catch (e) { return { err: String(e) }; }
    }, SAMPLE);

    if (result.err) { console.log('ERREUR:', result.err); await b.close(); process.exit(1); }

    const p2 = await b.newPage();
    await p2.setViewport({ width: 700, height: 900, deviceScaleFactor: 2 });
    await p2.setContent(result.html, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300));
    await p2.screenshot({ path: out, fullPage: true });
    console.log('OK ->', out);
  } finally {
    await b.close();
  }
})();
