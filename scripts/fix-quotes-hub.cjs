// Répare les délimiteurs JS transformés en guillemets typographiques (U+2018/U+2019)
const fs = require('fs');
const f = 'src/pages/soins/index.astro';
let s = fs.readFileSync(f, 'utf8');
const re = new RegExp('hash: [‘’]([a-z-]+)[‘’]', 'g');
const n = (s.match(re) || []).length;
s = s.replace(re, "hash: '$1'");
fs.writeFileSync(f, s, 'utf8');
console.log('repare:', n);
