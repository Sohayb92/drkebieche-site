/** Capture /mon-devis avec un devis fictif encodé dans le fragment (#). */
const puppeteer = require('puppeteer');
const fs = require('fs');

const obj = { p: "Cher Monsieur Dupont", n: "Jean Dupont", j: "k7p2x9", s: ["implant", "overlay", "couronne-implant"] };
const frag = Buffer.from(JSON.stringify(obj)).toString('base64url');
const url = 'https://drkebieche.fr/mon-devis#' + frag;

(async () => {
  fs.mkdirSync('C:/Users/Famille/melyia/audit', { recursive: true });
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const [name, vp] of [['desktop', { width: 1100, height: 1000, deviceScaleFactor: 2 }], ['mobile', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true }]]) {
      const p = await b.newPage();
      await p.setViewport(vp);
      await p.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('visible')));
      await new Promise(r => setTimeout(r, 700));
      const out = 'C:/Users/Famille/melyia/audit/mon-devis-' + name + '.png';
      await p.screenshot({ path: out, fullPage: true });
      await p.close();
      console.log('OK ->', out);
    }
    console.log('URL length:', url.length);
  } finally { await b.close(); }
})();
