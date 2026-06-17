const fs = require('fs');
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless:'new', args:['--no-sandbox'] });
  const p = await b.newPage();
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil:'domcontentloaded', timeout:30000 });
  await new Promise(r=>setTimeout(r,1500));
  async function test(file) {
    const txt = fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
    return await p.evaluate((t)=>parseDevisFromText(t), txt);
  }
  const k3 = await test('C:/Users/Famille/drkebieche-site/_devistext3.txt');
  const k1 = await test('C:/Users/Famille/drkebieche-site/_devistext.txt'); // keb (RTE+couronne) - non-regression
  await b.close();
  console.log('errs:', errs.length?errs.join(' | '):'aucune');
  console.log('--- keb3 (avulsion) ---');
  console.log('patient:', JSON.stringify(k3.patient), '| total_hon:', k3.total_honoraires, '| soinsKeys:', JSON.stringify(k3.soinsKeys));
  (k3.actes||[]).forEach(a=>console.log('   -', a.dent, '|', a.libelle));
  console.log('--- keb (non-regression) ---');
  console.log('total_hon:', k1.total_honoraires, '| reste:', k1.total_reste_a_charge, '| soinsKeys:', JSON.stringify(k1.soinsKeys), '| actes:', (k1.actes||[]).length);
})();
