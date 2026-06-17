/** v2.6.9 : vérifie le chargement + les briques d'import devis. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 800));
    const res = await p.evaluate(() => ({
      importDevisFromPdf: typeof importDevisFromPdf,
      promptExcludesAlt: typeof GEMINI_DEVIS_PROMPT === 'string' && /JAMAIS appara/.test(GEMINI_DEVIS_PROMPT) && /soinsKeys/.test(GEMINI_DEVIS_PROMPT),
      geminiExtractOpts: /opts\.prompt/.test(geminiExtract.toString()),
      importBtn: !!document.getElementById('import-devis-btn'),
      openModalArity: openModal.length
    }));
    console.log('importDevisFromPdf :', res.importDevisFromPdf);
    console.log('prompt exclut alternative + soinsKeys :', res.promptExcludesAlt);
    console.log('geminiExtract accepte opts :', res.geminiExtractOpts);
    console.log('bouton Importer présent :', res.importBtn);
    console.log('openModal arité (>=3) :', res.openModalArity);
    console.log('pageerrors :', errs.length, errs.slice(0, 3));
  } finally { await b.close(); }
})();
