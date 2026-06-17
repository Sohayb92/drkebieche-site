const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') { const t = m.text(); if (!/Failed to load resource|net::ERR|404|favicon|manifest/i.test(t)) errs.push('CONSOLE: ' + t); } });
  await page.goto('file:///C:/Users/Famille/melyia/web/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2500));
  const present = await page.evaluate(() => {
    const ref = (typeof buildSoinReference === 'function') ? buildSoinReference(['rte', 'couronne']) : '';
    return {
      bank: typeof DEFAULT_SOIN_BANK === 'object' && Object.keys(DEFAULT_SOIN_BANK).length,
      buildSoinReference: typeof buildSoinReference,
      getSoinBank: typeof getSoinBank,
      refSample_hasRTE: ref.includes('Reprendre le traitement de la racine'),
      refSample_hasCouronne: ref.includes('Reconstituer'),
      recitPromptHasReference: typeof DEFAULT_RECIT_PROMPT === 'string' && DEFAULT_RECIT_PROMPT.includes('{{reference}}'),
      banned_clean: typeof recitBannedHit === 'function' ? recitBannedHit({ objectif: 'conserver la dent', phases: [{ paragraphes: ['Je traite la racine puis pose une couronne.'] }], cloture: 'le secretariat vous rappellera' }) : 'NO FN',
      banned_alt: typeof recitBannedHit === 'function' ? recitBannedHit({ phases: [{ paragraphes: ['Il existe une alternative sans reste a charge.'] }] }) : 'NO FN',
      banned_montant: typeof recitBannedHit === 'function' ? recitBannedHit({ objectif: 'plan a 1 532,35 € environ' }) : 'NO FN',
    };
  }).catch((e) => ({ evalError: e.message }));
  await browser.close();
  console.log('ERREURS:', errs.length ? '\n' + errs.join('\n') : 'aucune');
  console.log('CHECK:', JSON.stringify(present));
})();
