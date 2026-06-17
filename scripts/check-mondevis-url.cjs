/** v2.6.4 : vérifie buildMonDevisUrl (Mélyia) + round-trip décodage page. */
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] });
  try {
    const p = await b.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 700));
    const res = await p.evaluate(() => {
      const url = buildMonDevisUrl('k7p2x9', { prenom: 'Jean', nom: 'Dupont', civilite: 'M' }, ['implant', 'overlay', 'couronne-implant'], UTM_RELANCE);
      // décodage comme la page /mon-devis
      const frag = url.split('#')[1] || '';
      let s = frag.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
      let decoded = null;
      try { decoded = JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) {}
      return { url, decoded };
    });
    console.log('URL    :', res.url);
    console.log('Décodé :', JSON.stringify(res.decoded));
    console.log('pageerrors :', errs.length, errs.slice(0, 3));
  } finally { await b.close(); }
})();
