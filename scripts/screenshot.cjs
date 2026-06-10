/**
 * Script de capture d'écran pour le site drkebieche.
 *
 * PRÉREQUIS : le dev server Astro doit tourner (`npm run dev` → http://localhost:4321).
 *
 * Usage :
 *   node scripts/screenshot.js                          # capture la home (desktop)
 *   node scripts/screenshot.js /soins                   # capture une route précise
 *   node scripts/screenshot.js /soins/implantologie-chirurgie
 *   node scripts/screenshot.js --mobile /               # capture mobile (390x844)
 *   node scripts/screenshot.js --all                    # capture les pages clés (desktop + mobile home)
 *
 * Captures sauvegardées dans `screenshots/{route}-{desktop|mobile}-{timestamp}.png`.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots');
const BASE_URL = 'http://localhost:4321';

const KEY_PAGES = [
  { route: '/', mobile: false },
  { route: '/', mobile: true },
  { route: '/soins', mobile: false },
  { route: '/soins/implantologie-chirurgie', mobile: false },
];

async function capture(browser, route, isMobile) {
  const page = await browser.newPage();
  if (isMobile) {
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  } else {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  }

  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) console.log(`[browser ERROR ${route}]`, msg.text());
  });

  const url = BASE_URL + route;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Déclenche les animations reveal au scroll en scrollant jusqu'en bas puis en haut
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) { clearInterval(timer); resolve(); }
      }, 80);
    });
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 800));

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const routeSlug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');
  const suffix = isMobile ? 'mobile' : 'desktop';
  const filename = `${routeSlug}-${suffix}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  await page.close();
  console.log(`✓ ${route} (${suffix}) → screenshots/${filename}`);
  return filepath;
}

(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  // Vérif dev server up
  try {
    const res = await fetch(BASE_URL + '/');
    if (!res.ok) throw new Error('status ' + res.status);
  } catch (e) {
    console.error(`✗ Dev server pas accessible sur ${BASE_URL} — lance "npm run dev" d'abord.`);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  try {
    if (args.includes('--all')) {
      for (const p of KEY_PAGES) await capture(browser, p.route, p.mobile);
    } else {
      const isMobile = args.includes('--mobile');
      const route = args.find(a => !a.startsWith('--')) || '/';
      await capture(browser, route, isMobile);
    }
  } finally {
    await browser.close();
  }
})();
