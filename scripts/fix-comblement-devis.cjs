// Retire le paragraphe « Côté devis » de la section comblement (demande user)
const fs = require('fs');
const f = 'src/pages/soins/implantologie-chirurgie.astro';
let s = fs.readFileSync(f, 'utf8');
const re = /\s*<p><strong>Côté devis\.[\s\S]*?<\/p>/;
if (!re.test(s)) { console.error('paragraphe non trouvé'); process.exit(1); }
s = s.replace(re, '');
fs.writeFileSync(f, s, 'utf8');
console.log('paragraphe Côté devis retiré');
