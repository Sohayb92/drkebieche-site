/** Capture la page /rappel : état lien invalide, état lien valide, et confirmation. */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:4321';
const OUT = 'C:/Users/Famille/melyia/audit';

async function waitServer() {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(BASE + '/rappel'); if (r.ok) return true; } catch (e) {}
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!(await waitServer())) { console.log('dev server KO'); process.exit(1); }
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    // 1) Lien valide (bouton actif)
    let p = await b.newPage();
    await p.setViewport({ width: 820, height: 760, deviceScaleFactor: 2 });
    await p.goto(BASE + '/rappel?r=k7p2x9', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 500));
    await p.screenshot({ path: path.join(OUT, 'rappel-valide.png'), fullPage: true });
    console.log('OK -> rappel-valide.png');

    // 2) État confirmation (forcé pour visualiser le mot d'accueil signé)
    await p.evaluate(() => {
      document.getElementById('rappel-card').classList.add('hidden');
      document.getElementById('rappel-done').classList.remove('hidden');
    });
    await new Promise(r => setTimeout(r, 300));
    await p.screenshot({ path: path.join(OUT, 'rappel-confirme.png'), fullPage: true });
    console.log('OK -> rappel-confirme.png');
    await p.close();

    // 3) Lien invalide (bouton désactivé + message)
    p = await b.newPage();
    await p.setViewport({ width: 820, height: 760, deviceScaleFactor: 2 });
    await p.goto(BASE + '/rappel', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 500));
    await p.screenshot({ path: path.join(OUT, 'rappel-invalide.png'), fullPage: true });
    console.log('OK -> rappel-invalide.png');
  } finally {
    await b.close();
  }
})();
