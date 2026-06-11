// Découpe les captures full-page mobiles en tranches de 1950px pour lecture
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'screenshots', 'audit');
const outDir = path.join(dir, 'slices');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const slugs = process.argv.slice(2);
const SLICE_H = 1950;

(async () => {
  for (const slug of slugs) {
    const file = path.join(dir, `${slug}-mobile.png`);
    const meta = await sharp(file).metadata();
    const n = Math.ceil(meta.height / SLICE_H);
    for (let i = 0; i < n; i++) {
      const top = i * SLICE_H;
      const h = Math.min(SLICE_H, meta.height - top);
      await sharp(file)
        .extract({ left: 0, top, width: meta.width, height: h })
        .toFile(path.join(outDir, `${slug}-m-${String(i).padStart(2, '0')}.png`));
    }
    console.log(`${slug}: ${n} tranches (${meta.width}x${meta.height})`);
  }
})();
