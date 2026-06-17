const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless:'new', args:['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil:'domcontentloaded', timeout:30000 });
  await new Promise(r=>setTimeout(r,1500));
  await p.evaluate(()=>navigate('settings'));
  await new Promise(r=>setTimeout(r,500));
  const r = await p.evaluate(()=>{
    const ta = document.getElementById('setting-relance-template');
    const det = ta ? ta.closest('details') : null;
    return { taExists: !!ta, wrappedInDetails: !!det, detailsOpen: det? det.open : 'n/a', taVisible: ta? (ta.offsetParent !== null) : 'n/a' };
  });
  await b.close();
  console.log(JSON.stringify(r));
})();
