/** v2.6.7 : rend le mail de devis (écrin + liste plan + lien page) via les vraies fonctions. */
const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const out = 'C:/Users/Famille/melyia/audit/mail-devis.png';
  fs.mkdirSync('C:/Users/Famille/melyia/audit', { recursive: true });
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 700));
    const res = await p.evaluate(() => {
      const pat = { prenom: 'Jean', nom: 'Dupont', civilite: 'M' };
      const devis = { jeton: 'k7p2x9', soinsKeys: ['rte', 'overlay', 'couronne-implant'] };
      const filled = DEFAULT_DEVIS_TEMPLATE
        .replaceAll('{{salutation}}', buildSalutation(pat))
        .replaceAll('{{lien_comprendre}}', buildMonDevisUrl(devis.jeton, pat, devis.soinsKeys, UTM_DEVIS))
        .replaceAll('{{plan}}', buildPlanList(devis))
        .replaceAll('{{lien_rappel}}', buildRappelUrl(devis.jeton, UTM_DEVIS, 'Jean Dupont'))
        .replaceAll('{{doctor}}', 'Dr Kebieche');
      return { plan: buildPlanList(devis), html: Gmail._textToHtml(filled) };
    });
    console.log('plan:\n' + res.plan);
    const p2 = await b.newPage();
    await p2.setViewport({ width: 700, height: 900, deviceScaleFactor: 2 });
    await p2.setContent(res.html, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 250));
    await p2.screenshot({ path: out, fullPage: true });
    console.log('OK ->', out, '| pageerrors:', errs.length, errs.slice(0, 3));
  } finally { await b.close(); }
})();
