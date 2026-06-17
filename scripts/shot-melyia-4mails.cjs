/**
 * Rend les 4 mails finaux Mélyia (relance 1, relance 2, maintenance, avis)
 * depuis les VRAIS templates par défaut + la VRAIE fonction Gmail._textToHtml.
 * Confirme aussi que l'app charge sans erreur (codemod + cablage OK).
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTDIR = 'C:/Users/Famille/melyia/audit';

(async () => {
  const target = 'file:///C:/Users/Famille/melyia/web/index.html';
  fs.mkdirSync(OUTDIR, { recursive: true });
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p.goto(target, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));

    const res = await p.evaluate(() => {
      try {
        const sub = (t, map) => Object.keys(map).reduce((s, k) => s.split(k).join(map[k]), t);
        const common = {
          '{{salutation}}': 'Cher Monsieur Dupont',
          '{{date_envoi}}': '23 mai 2026',
          '{{type_maintenance}}': 'maintenance parodontale',
          '{{lien_comprendre}}': buildComprendreUrl(['implant', 'rte', 'overlay'], UTM_RELANCE),
          '{{lien_rappel}}': buildRappelUrl('k7p2x9', UTM_RELANCE),
          '{{lien_rdv}}': DOCTOLIB_BOOKING_URL,
          '{{lien_google}}': 'https://g.page/r/CSAhN9X9DtepEBM/review',
          '{{doctor}}': ''
        };
        return {
          relance1: Gmail._textToHtml(sub(DEFAULT_RELANCE_TEMPLATE_1, common)),
          relance2: Gmail._textToHtml(sub(DEFAULT_RELANCE_TEMPLATE_2, common)),
          maintenance: Gmail._textToHtml(sub(DEFAULT_MAINTENANCE_TEMPLATE, common)),
          avis: Gmail._textToHtml(sub(DEFAULT_GOOGLE_REVIEW_TEMPLATE, common))
        };
      } catch (e) { return { err: String(e) }; }
    });

    if (res.err) { console.log('ERREUR evaluate:', res.err); await b.close(); process.exit(1); }

    for (const [name, html] of Object.entries(res)) {
      const pg = await b.newPage();
      await pg.setViewport({ width: 700, height: 900, deviceScaleFactor: 2 });
      await pg.setContent(html, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 200));
      const out = path.join(OUTDIR, 'mail-' + name + '.png');
      await pg.screenshot({ path: out, fullPage: true });
      await pg.close();
      console.log('OK ->', out);
    }
    console.log('pageerrors:', errs.length, errs.slice(0, 3));
  } finally {
    await b.close();
  }
})();
