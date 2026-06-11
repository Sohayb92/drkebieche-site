// Répare la corruption : U+202F inséré avant les classes Tailwind "!important"
// (ex: "card !p-6"). Un "!" typographique français n'est jamais suivi
// d'une lettre ou d'un crochet — un "!" Tailwind toujours.
const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

const NNBSP = String.fromCharCode(0x202f);
// Un signe !:;? précédé d'une fine ET suivi directement d'une lettre/chiffre/crochet
// = toujours du code (classe Tailwind, sélecteur CSS), jamais du français.
const RE = new RegExp(NNBSP + '(?=[!:;?][A-Za-z0-9\\u005b])', 'g');

let total = 0;
for (const f of walk('src').filter((f) => f.endsWith('.astro'))) {
  const before = fs.readFileSync(f, 'utf8');
  const after = before.replace(RE, ' ');
  if (after !== before) {
    const n = (before.match(RE) || []).length;
    fs.writeFileSync(f, after, 'utf8');
    total += n;
    console.log(f + ' - ' + n + ' classes réparées');
  }
}
console.log('Total : ' + total);
