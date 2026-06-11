// Remplace le ternaire hasPortrait du hero home par la composition K seule
// (choix DA validé : portrait réservé à /praticien)
const fs = require('fs');
const f = 'src/pages/index.astro';
let s = fs.readFileSync(f, 'utf8');

const start = s.indexOf('        <!-- Portrait (auto');
const endMark = ')}';
const end = s.indexOf(endMark, start);
if (start < 0 || end < 0) { console.error('bloc non trouvé'); process.exit(1); }

const nouveau = `        <!-- Composition de marque (choix DA validé 2026-06-11 : le portrait reste
             l'exclusivité de /praticien ; une photo d'ambiance cabinet prendra
             cette place après le shooting) -->
        <div class="relative aspect-[4/3] md:aspect-[4/5] rounded-2xl overflow-hidden section-dark fade-up-3">
          <svg class="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden="true">
            <defs>
              <pattern id="trame-hero" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.1" fill="#C09A5F" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trame-hero)" />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-10 gap-5">
            <span class="text-[64px] md:text-[84px] leading-none" style="font-family: var(--font-display); color: var(--color-cream-50)">K</span>
            <span class="block w-12 h-px" style="background: var(--color-copper-400)"></span>
            <p class="text-[18px] md:text-[21px] leading-[1.45] max-w-[300px]" style="font-family: var(--font-display); color: var(--color-cream-100)">
              Conserver d’abord.<br>Remplacer durablement.<br>Expliquer toujours.
            </p>
          </div>
        </div>`;

s = s.slice(0, start) + nouveau + s.slice(end + endMark.length);

// hasPortrait n'est plus utilisé sur la home : retire l'import fs + la const
s = s.replace(/\/\/ Le portrait[^\n]*\n/, '');
s = s.replace(/const hasPortrait[^\n]*\n/, '');
s = s.replace(/import fs from 'node:fs';\r?\n/, '');

fs.writeFileSync(f, s, 'utf8');
console.log('hero home remplacé');
