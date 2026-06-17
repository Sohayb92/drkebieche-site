/** v2.6.5 : vérifie que l'app charge sans erreur et que les nouvelles briques existent. */
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
      openComposeDevisModal: typeof openComposeDevisModal,
      sendEmailHasAttachments: typeof Gmail !== 'undefined' && /attachments/.test(Gmail.sendEmail.toString()),
      devisTemplate: typeof DEFAULT_DEVIS_TEMPLATE === 'string' && DEFAULT_DEVIS_TEMPLATE.includes('{{lien_comprendre}}'),
      buildMonDevisUrl: typeof buildMonDevisUrl
    }));
    console.log('openComposeDevisModal :', res.openComposeDevisModal);
    console.log('sendEmail gère attachments :', res.sendEmailHasAttachments);
    console.log('DEFAULT_DEVIS_TEMPLATE ok :', res.devisTemplate);
    console.log('buildMonDevisUrl :', res.buildMonDevisUrl);
    console.log('pageerrors :', errs.length, errs.slice(0, 3));
  } finally { await b.close(); }
})();
