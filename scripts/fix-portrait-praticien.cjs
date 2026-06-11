// Remplace le ternaire hasPortrait de /praticien par l'<img> directe
// (le fs.existsSync cassait au build de production — bloquant audit n°2)
const fs = require('fs');
const f = 'src/pages/praticien.astro';
let s = fs.readFileSync(f, 'utf8');

const start = s.indexOf('{hasPortrait');
const endMark = ')}';
const end = s.indexOf(endMark, start);
if (start < 0 || end < 0) { console.error('bloc non trouvé'); process.exit(1); }

const nouveau = `<img src="/portrait.jpg" alt="Dr Sohaïb Kebieche, chirurgien-dentiste à Colombes" width="680" height="1020" loading="eager" class="w-full max-w-[420px] mx-auto rounded-2xl" style="box-shadow: 0 24px 60px -24px rgba(31,58,61,0.35)" />`;

s = s.slice(0, start) + nouveau + s.slice(end + endMark.length);
fs.writeFileSync(f, s, 'utf8');
console.log('portrait praticien : img directe');
