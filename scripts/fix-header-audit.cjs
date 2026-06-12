// Audit actions 6+7 : barre urgence cliquable (/urgences + tel:15)
const fs = require('fs');
const f = 'src/components/Header.astro';
let s = fs.readFileSync(f, 'utf8');

// Desktop : « urgence dentaire » → lien /urgences
s = s.replace(
  'En cas d’urgence dentaire pendant',
  'En cas d’<a href="/urgences" class="underline underline-offset-2">urgence dentaire</a> pendant'
);
// Desktop : le 15 cliquable
s = s.replace('<strong>15 (Samu)</strong>', '<a href="tel:15" class="font-semibold underline underline-offset-2">15 (Samu)</a>');
// Mobile : « Urgence ? » → lien /urgences (tolère l'espace fine avant ?)
s = s.replace(/<span class="md:hidden">(Urgence[\s ]*\?)<\/span>/, '<a href="/urgences" class="md:hidden underline underline-offset-2">$1</a>');
// Mobile : le 15 cliquable
s = s.replace(/le <strong>15<\/strong>/, 'le <a href="tel:15" class="font-semibold underline underline-offset-2">15</a>');

fs.writeFileSync(f, s, 'utf8');
console.log('barre urgence cliquable ok');
