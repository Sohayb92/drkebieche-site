/** v2.6.3 : verifie que la salutation est forcee depuis le dossier patient. */
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
      const rx = /^\s*(?:Cher|Chère|Bonjour|Madame|Monsieur)[^\n]*,\s*/i;
      const sample = "Cher Madame, Cher Monsieur,\n\nSuite à notre consultation, je vous adresse le détail de votre plan de traitement.";
      return {
        salH: buildSalutation({ prenom: 'Jean', nom: 'Dupont' }),
        salF: buildSalutation({ prenom: 'Marie', nom: 'Durand' }),
        salCivil: buildSalutation({ civilite: 'M', nom: 'Martin' }),
        fixed: sample.replace(rx, buildSalutation({ prenom: 'Jean', nom: 'Dupont' }) + ',\n\n').split('\n')[0]
      };
    });
    console.log('buildSalutation Jean Dupont :', res.salH);
    console.log('buildSalutation Marie Durand :', res.salF);
    console.log('buildSalutation civilite M Martin :', res.salCivil);
    console.log('1re ligne apres remplacement :', res.fixed, '(attendu: Cher M. Dupont,)');
    console.log('pageerrors :', errs.length, errs.slice(0, 3));
  } finally {
    await b.close();
  }
})();
