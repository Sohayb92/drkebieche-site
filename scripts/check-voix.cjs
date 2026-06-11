// Captures voix du praticien : bloc "En ses mots", citation timeline, mot première consultation
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 940, deviceScaleFactor: 1 });

  // /praticien : section "En ses mots"
  await page.goto('http://localhost:4321/praticien', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  let y = await page.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find(s => s.textContent.trim() === 'En ses mots');
    return el.closest('section').getBoundingClientRect().top + window.scrollY;
  });
  await page.screenshot({ path: 'screenshots/voix-praticien.png', clip: { x: 0, y, width: 1280, height: 880 } });

  // /praticien : citation timeline (étape Aujourd'hui)
  y = await page.evaluate(() => {
    const cites = [...document.querySelectorAll('p')].filter(p => p.textContent.includes('village dans Colombes'));
    return cites[0].getBoundingClientRect().top + window.scrollY;
  });
  await page.screenshot({ path: 'screenshots/voix-timeline.png', clip: { x: 0, y: y - 180, width: 1280, height: 480 } });

  // première consultation : un mot du praticien
  await page.goto('http://localhost:4321/conseils/premiere-consultation', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible')));
  await new Promise(r => setTimeout(r, 400));
  y = await page.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find(s => s.textContent.trim() === 'Un mot du praticien');
    return el.closest('section').getBoundingClientRect().top + window.scrollY;
  });
  await page.screenshot({ path: 'screenshots/voix-consult.png', clip: { x: 0, y, width: 1280, height: 480 } });

  console.log('ok');
  await browser.close();
})();
