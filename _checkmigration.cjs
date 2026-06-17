const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless:'new', args:['--no-sandbox'] });
  const p = await b.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil:'domcontentloaded', timeout:30000 });
  await new Promise(r=>setTimeout(r,1800));
  const res = await p.evaluate(async () => {
    const out = {};
    out.pdfsTable = !!(db.tables && db.tables.some(t=>t.name==='pdfs'));
    await db.devis.clear(); await db.pdfs.clear();
    localStorage.removeItem('melyia_pdfsMigratedV6');
    const id = await db.devis.add({ patient_id:1, status:'En attente', soins:'Test', montant:100, pdfName:'old.pdf', pdfBase64:'BASE64DATA==' });
    await migratePdfsOnce();
    const d = await db.devis.get(id);
    const pdfs = await db.pdfs.toArray();
    out.devisBase64Apres = !!d.pdfBase64;
    out.devisPdfStored = !!d.pdfStored;
    out.pdfMoved = pdfs.length===1 && pdfs[0].devis_id===id && pdfs[0].base64==='BASE64DATA==';
    out.flag = localStorage.getItem('melyia_pdfsMigratedV6');
    return out;
  }).catch(e=>({evalError:e.message}));
  await b.close();
  console.log('errs:', errs.length?errs.join(' | '):'aucune');
  console.log(JSON.stringify(res));
})();
