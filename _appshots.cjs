const puppeteer = require('puppeteer');
const fs = require('fs');
const OUT = 'C:/Users/Famille/drkebieche-site/_audit_shots';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // --- Données de démo ---
  const seed = await page.evaluate(async () => {
    try {
      await db.patients.clear(); await db.devis.clear();
      const now = Date.now(); const d = (days) => new Date(now - days * 86400000).toISOString();
      await db.patients.bulkAdd([
        { id: 1, prenom: 'Marie', nom: 'DURAND', email: 'marie.durand@example.com', telephone: '06 12 34 56 78', civilite: 'F', created_at: d(40) },
        { id: 2, prenom: 'Jean', nom: 'MARTIN', email: 'jean.martin@example.com', telephone: '06 98 76 54 32', civilite: 'M', created_at: d(30) },
        { id: 3, prenom: 'Sophie', nom: 'BERNARD', email: 'sophie.bernard@example.com', telephone: '07 11 22 33 44', civilite: 'F', created_at: d(20) },
        { id: 4, prenom: 'Paul', nom: 'PETIT', email: 'paul.petit@example.com', telephone: '06 55 44 33 22', civilite: 'M', created_at: d(10) },
      ]);
      await db.devis.bulkAdd([
        { id: 1, patient_id: 1, status: 'En attente', montant: 1532.35, soins: 'Retraitement de racine (46), Couronne ceramo-metallique (46)', soinsKeys: ['rte', 'couronne'], jeton: 'demo46x7k2', date_envoi: d(2), date_relance_prevue: d(-19), created_at: d(2) },
        { id: 2, patient_id: 2, status: 'Relancé', montant: 780, soins: 'Overlay ceramique (26)', soinsKeys: ['overlay'], jeton: 'aaa111', date_envoi: d(25), date_relance_prevue: d(-1), created_at: d(25) },
        { id: 3, patient_id: 3, status: 'Accepté', montant: 2400, soins: 'Implant (36), Couronne sur implant (36)', soinsKeys: ['implant', 'couronne-implant'], jeton: 'bbb222', date_envoi: d(50), dateAcceptation: d(40), date_relance_prevue: d(-30), created_at: d(50) },
        { id: 4, patient_id: 4, status: 'En attente', montant: 450, soins: 'Composite (12)', soinsKeys: ['composite'], jeton: 'ccc333', date_envoi: d(1), date_relance_prevue: d(-20), created_at: d(1) },
        { id: 5, patient_id: 1, status: 'Refusé', montant: 1200, soins: 'Bridge (24 a 26)', soinsKeys: ['bridge'], jeton: 'ddd444', date_envoi: d(60), dateRefus: d(50), date_relance_prevue: d(-40), created_at: d(60) },
      ]);
      if (typeof refreshPatientsCache === 'function') await refreshPatientsCache();
      return 'ok';
    } catch (e) { return 'seed error: ' + e.message; }
  });
  console.log('seed:', seed);

  // Simule l'etat "Gmail connecte" pour montrer TOUS les boutons d'action (fiche realiste)
  await page.evaluate(() => {
    try { GoogleAuth.isConnected = () => true; } catch (e) {}
    try { localStorage.setItem('melyia_googleUserEmail', 'cabinetdentaire.lacabane@gmail.com'); } catch (e) {}
    try { localStorage.setItem('melyia_doctorName', 'Dr Sohaïb Kebieche'); } catch (e) {}
  });

  async function shot(name, fn) {
    try {
      await page.evaluate(fn);
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: OUT + '/' + name + '.png', fullPage: true });
      console.log('OK', name);
    } catch (e) { console.log('FAIL', name, '-', e.message); }
  }

  await shot('01-dashboard', () => { navigate('dashboard'); });
  await shot('02-patients', () => { navigate('patients'); });
  await shot('03-stats', () => { navigate('stats'); });
  await shot('04-rappels', () => { navigate('reminders'); });
  await shot('05-reglages', () => { navigate('settings'); });
  await shot('06-modale-nouveau-devis', () => { navigate('dashboard'); openModal(); });
  await page.evaluate(() => { try { if (typeof closeModal === 'function') closeModal(); } catch (e) {} });
  await shot('07-fiche-detail-devis', () => { if (typeof openDetail === 'function') return openDetail(1); });
  await shot('07b-fiche-plus-ouvert', () => { const b = document.querySelector('[data-action="toggle-more"]'); if (b) b.click(); });
  await page.evaluate(() => { try { if (typeof closeDetail === 'function') closeDetail(); } catch (e) {} });
  await shot('08-modale-envoi-devis', async () => { const dv = await db.devis.get(1); const p = await db.patients.get(1); return openComposeDevisModal(dv, p); });

  await browser.close();
  if (errs.length) console.log('PAGEERRORS:', errs.slice(0, 6).join(' | '));
  console.log('---', fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).length, 'captures dans', OUT);
})();
