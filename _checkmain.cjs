const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type()==='error'){ const t=m.text(); if(!/Failed to load|net::ERR|404|manifest|favicon/i.test(t)) errs.push('C:'+t); } });
  await p.goto('file:///C:/Users/Famille/melyia/melyia.html', { waitUntil:'domcontentloaded', timeout:30000 });
  await new Promise(r=>setTimeout(r,2500));
  const ok = await p.evaluate(()=>({ openDetail: typeof openDetail, renderDashboard: typeof renderDashboard, recitBannedHit: typeof recitBannedHit, makeJeton: (typeof makeJeton==='function'? makeJeton().length : 'NO') })).catch(e=>({err:e.message}));
  await b.close();
  console.log('ERREURS melyia.html:', errs.length? errs.join(' | ') : 'aucune');
  console.log('FN:', JSON.stringify(ok));
})();
