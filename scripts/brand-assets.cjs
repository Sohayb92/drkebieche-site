// Génère les assets de marque : og-image.jpg (1200×630) + apple-touch-icon.png (180×180)
// Rendu HTML avec les vraies polices du site (Fontsource), capturé via Puppeteer.
const puppeteer = require('puppeteer');
const path = require('path');

const newsreader = 'file:///' + path.resolve(__dirname, '..', 'node_modules', '@fontsource-variable', 'newsreader', 'files', 'newsreader-latin-wght-normal.woff2').replace(/\\/g, '/');
const inter = 'file:///' + path.resolve(__dirname, '..', 'node_modules', '@fontsource-variable', 'inter', 'files', 'inter-latin-wght-normal.woff2').replace(/\\/g, '/');

const FONTS = `
  @font-face { font-family: 'Newsreader'; src: url('${newsreader}') format('woff2'); font-weight: 200 800; }
  @font-face { font-family: 'Inter'; src: url('${inter}') format('woff2'); font-weight: 100 900; }
`;

const OG = `<!doctype html><html><head><style>
  ${FONTS}
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #1F3A3D; display: flex; align-items: center; }
  .inner { padding: 0 96px; width: 100%; }
  .eyebrow { font-family: Inter; font-weight: 600; font-size: 21px; letter-spacing: 0.18em; text-transform: uppercase; color: #C09A5F; margin-bottom: 28px; }
  h1 { font-family: Newsreader; font-weight: 500; font-size: 86px; line-height: 1.08; color: #F8F6F1; letter-spacing: -0.01em; margin-bottom: 30px; }
  .sub { font-family: Inter; font-weight: 400; font-size: 30px; color: rgba(248,246,241,0.78); margin-bottom: 56px; }
  .filet { width: 84px; height: 3px; background: #C09A5F; margin-bottom: 32px; }
  .url { font-family: Inter; font-weight: 500; font-size: 24px; color: #C09A5F; letter-spacing: 0.04em; }
</style></head><body>
  <div class="inner">
    <div class="eyebrow">Chirurgien-dentiste · Colombes (92)</div>
    <h1>Dr Sohaïb Kebieche</h1>
    <div class="sub">Implantologie · Parodontologie · Dentisterie adhésive</div>
    <div class="filet"></div>
    <div class="url">drkebieche.fr</div>
  </div>
</body></html>`;

const ICON = `<!doctype html><html><head><style>
  ${FONTS}
  * { margin: 0; }
  body { width: 180px; height: 180px; background: #1F3A3D; display: flex; align-items: center; justify-content: center; }
  .k { font-family: Newsreader; font-weight: 500; font-size: 116px; color: #F8F6F1; line-height: 1; padding-bottom: 10px; }
</style></head><body><div class="k">K</div></body></html>`;

const fs = require('fs');

(async () => {
  // setContent (origin about:blank) bloque les @font-face en file:// → on passe par des fichiers temporaires
  const tmpOg = path.resolve(__dirname, '_tmp-og.html');
  const tmpIcon = path.resolve(__dirname, '_tmp-icon.html');
  fs.writeFileSync(tmpOg, OG);
  fs.writeFileSync(tmpIcon, ICON);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpOg.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: path.resolve(__dirname, '..', 'public', 'og-image.jpg'), type: 'jpeg', quality: 92 });
  console.log('✓ og-image.jpg');

  await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpIcon.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path: path.resolve(__dirname, '..', 'public', 'apple-touch-icon.png') });
  console.log('✓ apple-touch-icon.png');

  await browser.close();
  fs.unlinkSync(tmpOg);
  fs.unlinkSync(tmpIcon);
})();
