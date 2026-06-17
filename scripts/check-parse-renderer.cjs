const puppeteer = require('puppeteer');
const DEVIS2 = `Nom et prénom : KEBIECHE Sohaïb
Devis 25575-11735-2
Traitement proposé – Description précise et détaillée des actes
1 46 HBGD027 Dépose couronne 3 Aucun 80,00 NR 0 80,00
3 46 HBGD033 Désobturation endodontique molaire 240,00 NR 0 240,00
3 46 HBFD024 Mise en forme et obturation 114,40 114,40 68,64 45,76
4 46 HBLD245 Inlay core 5 3 Aucun 350,00 70,00 42,00 308,00
4 46 HBLD734 Couronne céramo-métallique 4 3 Aucun 750,00 120,00 72,00 678,00
TOTAL € (des actes envisagés) 1 728,17 326,37 195,82 1 532,35
Actes sans reste à charge
4 46 HBLD038 Couronne métallique 2 298,70 298,70 120,00 72,00 226,70 oui`;
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 700));
    const res = await p.evaluate((txt) => ({
      typeofFn: typeof parseDevisFromText,
      result: (typeof parseDevisFromText === 'function') ? parseDevisFromText(txt) : null
    }), DEVIS2);
    console.log('parseDevisFromText :', res.typeofFn);
    console.log('soinsKeys :', JSON.stringify(res.result && res.result.soinsKeys));
    console.log('reste à charge :', res.result && res.result.total_reste_a_charge);
    console.log('patient :', res.result && JSON.stringify(res.result.patient));
    console.log('pageerrors :', errs.length, errs.slice(0, 3));
  } finally { await b.close(); }
})();
