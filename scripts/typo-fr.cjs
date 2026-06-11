// Micro-typographie francaise sur les .astro :
//  1. apostrophe typographique (U+2019) entre deux lettres/chiffres
//  2. espace fine insecable (U+202F) avant : ; ! ? precedes d'une lettre/chiffre/guillemet fermant/ellipse
//  3. espace fine insecable a l'interieur des guillemets francais
// Sur pour le code : les delimiteurs de chaines JS ne sont jamais entre deux
// lettres, et U+202F est un whitespace valide en JS (categorie Zs).
// Fichier volontairement 100% ASCII pour eviter toute ambiguite d'encodage.
const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

const APOS = '’';      // apostrophe typographique
const NNBSP = ' ';     // espace fine insecable
const LAQUO = '«';     // guillemet ouvrant
const RAQUO = '»';     // guillemet fermant

const RE_APOS = /([\p{L}\p{N}])'([\p{L}\p{N}])/gu;
// NB : la ponctuation n'est traitée que si elle est suivie d'un espace, d'un
// chevron HTML ou d'une fin de ligne — un !:;? suivi d'une lettre/chiffre est
// du code (classe Tailwind "card !p-6", sélecteur CSS " :global", etc.).
const RE_PONCT = new RegExp('([\\p{L}\\p{N}»…]) ([:;!?])(?=[\\s<»"\']|$)', 'gu');
const RE_LAQUO = new RegExp(LAQUO + ' ', 'g');
const RE_RAQUO = new RegExp(' ' + RAQUO, 'g');

const files = walk('src').filter((f) => f.endsWith('.astro'));
let total = 0;

for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  let t = before;
  t = t.replace(RE_APOS, '$1' + APOS + '$2');
  t = t.replace(RE_PONCT, '$1' + NNBSP + '$2');
  t = t.replace(RE_LAQUO, LAQUO + NNBSP).replace(RE_RAQUO, NNBSP + RAQUO);
  if (t !== before) {
    fs.writeFileSync(f, t, 'utf8');
    const apos = (before.match(RE_APOS) || []).length;
    const ponct = (before.match(RE_PONCT) || []).length;
    const guill = (before.match(RE_LAQUO) || []).length + (before.match(RE_RAQUO) || []).length;
    total += apos + ponct + guill;
    console.log(f + ' - ' + apos + ' apostrophes, ' + ponct + ' ponctuations, ' + guill + ' guillemets');
  }
}
console.log('\nTotal : ' + total + ' remplacements');
