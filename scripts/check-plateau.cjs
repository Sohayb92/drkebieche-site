// Capture ciblée : section "Le cabinet" + panneau plateau technique (home)
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle0' });

  // Forcer tous les data-reveal visibles (sinon opacity 0 hors viewport)
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
  });
  await new Promise(r => setTimeout(r, 600));

  // La section cabinet contient l'eyebrow "Le plateau technique"
  const box = await page.evaluate(() => {
    const eyebrows = [...document.querySelectorAll('section')];
    const target = eyebrows.find(s => s.textContent.includes('Le plateau technique'));
    if (!target) return null;
    const r = target.getBoundingClientRect();
    return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
  });
  if (!box) { console.log('Section non trouvée'); process.exit(1); }

  await page.screenshot({
    path: 'screenshots/check-plateau.png',
    clip: { x: 0, y: box.y, width: 1280, height: Math.min(box.height, 980) },
  });
  console.log('plateau h=', Math.round(box.height));
  await browser.close();
})();
