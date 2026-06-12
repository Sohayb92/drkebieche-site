// Correction des horaires réels du cabinet : 9h-13h30 / 15h-19h (user 2026-06-12)
const fs = require('fs');
const fixes = [
  ['src/pages/contact.astro', [['9h–13h · 15h–18h30', '9h–13h30 · 15h–19h']]],
  ['src/pages/cabinet.astro', [['9h–13h et 15h–18h30', '9h–13h30 et 15h–19h']]],
  ['src/pages/urgences.astro', [['9h–13h / 15h–18h30', '9h–13h30 / 15h–19h']]],
  ['src/pages/en.astro', [['9:00–13:00 / 15:00–18:30', '9:00–13:30 / 15:00–19:00']]],
  ['src/layouts/Layout.astro', [['"closes": "13:00"', '"closes": "13:30"'], ['"closes": "18:30"', '"closes": "19:00"']]],
];
for (const [f, subs] of fixes) {
  let s = fs.readFileSync(f, 'utf8');
  let n = 0;
  for (const [a, b] of subs) {
    while (s.includes(a)) { s = s.replace(a, b); n++; }
  }
  fs.writeFileSync(f, s, 'utf8');
  console.log(f + ' : ' + n + ' remplacement(s)');
}
