// DA : pas d'italique hors logo — les <em> d'emphase deviennent <strong>
const fs = require('fs');
const path = require('path');
function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );
}
let total = 0;
for (const f of walk('src').filter((f) => f.endsWith('.astro'))) {
  const before = fs.readFileSync(f, 'utf8');
  const after = before.replace(/<em>([^<]*)<\/em>/g, '<strong>$1</strong>');
  if (after !== before) {
    const n = (before.match(/<em>/g) || []).length;
    fs.writeFileSync(f, after, 'utf8');
    total += n;
    console.log(f + ' - ' + n);
  }
}
console.log('Total em remplaces : ' + total);
