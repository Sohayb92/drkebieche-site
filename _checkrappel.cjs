const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless:'new', args:['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 900, height: 800 });
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil:'domcontentloaded', timeout:30000 });
  await new Promise(r=>setTimeout(r,1500));
  await p.evaluate(()=>{ navigate('reminders'); });
  await new Promise(r=>setTimeout(r,300));
  await p.evaluate(()=>{ document.getElementById('new-reminder-btn').click(); });
  await new Promise(r=>setTimeout(r,400));
  const st = await p.evaluate(()=>({
    overlayOpen: !document.getElementById('modal-maintenance-overlay').classList.contains('hidden'),
    pickerVisible: !document.getElementById('maintenance-patient-picker').classList.contains('hidden'),
    nameHidden: document.getElementById('maintenance-patient-name').classList.contains('hidden')
  }));
  await p.screenshot({ path:'C:/Users/Famille/drkebieche-site/_audit_shots/09-nouveau-rappel.png' });
  await b.close();
  console.log('errs:', errs.length? errs.join(' | '):'aucune');
  console.log('etat:', JSON.stringify(st));
})();
