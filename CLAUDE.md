# CLAUDE.md — drkebieche-site

**Lis ce fichier au début de chaque session. Règles indispensables uniquement — le détail vit dans la mémoire (`~/.claude/projects/.../memory/`).**

## Projet
Site vitrine **drkebieche.fr** du Dr Sohaïb Kebieche (chirurgien-dentiste, Colombes 92). **EN LIGNE** depuis 2026-06-12 (Cloudflare Pages). Double vocation : SEO local + support des devis envoyés par mail via Mélyia (`/comprendre-mon-devis?soins=a,b,c` + ancres).

Stack : Astro + Tailwind, statique, repo `Sohayb92/drkebieche-site`.

## 6 règles de travail PERMANENTES
1. **Plan avant le code** (annoncer, attendre OK — sauf autonomie accordée explicitement).
2. **Vérifier son travail** : screenshots Puppeteer + auto-review avant de montrer. ⚠️ Vérifier AUSSI le build prod (`dist/`), pas que le dev server.
3. **Git filet** : commit par étape qui marche.
4. **Mémoire 2 niveaux** : ce fichier court, le détail en mémoire.
5. **Questions si ambigu** : 2-3 options + avis.
6. **Reste simple.**

## DA FIGÉE (ne jamais y retoucher sans demande explicite)
Teal #1F3A3D + crème #F8F6F1 + cuivré #C09A5F · Newsreader (titres) + Inter (corps), self-hosted · **italique réservé au « Sohaïb » du logo** (pas de `<em>`, pas de blockquote italique) · ni wellness, ni tech-froid · hero home = panneau K (photo d'ambiance après shooting ; portrait sur /praticien uniquement).

## Interdictions ABSOLUES (déonto/légal/factuel)
- ONCD : jamais « spécialiste » (→ « titulaire d'un D.U. ») · pas de témoignages patients · pas d'avant/après · pas de promesse de résultat · pas de jugement de confrères.
- CPAM : pas de grilles tarifaires · jamais « 100% santé / reste à charge 0 » · Sécu = **60 %**.
- **Pas de discours coût/« investissement » sur les pages soins** (l'argumentaire coût = mail devis + consultation).
- Bio : hospitalier TOUJOURS au passé, en parallèle du cabinet, **jamais « AP-HP »**, **jamais « bloc »/anesthésie générale** · 1er cabinet = Clichy-Levallois · confrère de l'hôpital (Dr Mester) **non nommé** sur le site.
- Pas d'onglet « Esthétique » (refuse les facettes cosmétiques sur dents saines ; le blanchiment, lui, est proposé).
- Enfants : ne PAS mettre en avant (FAQ filtrante uniquement).
- Ne jamais inventer un fait clinique, un équipement ou un nom : demander.

## Garde-fous factuels (1 ligne chacun — détail en mémoire `project_kebieche_cabinet`)
Consultation 40 min (détartrage souvent même séance) · maintenance paro 6 mois · contrôle 1×/an · blanchiment 2h/j 4-6 sem, résultat 3-5 ans · cone beam DDS PAS systématique (panoramique d'abord) · labo KF = prothèse fixe, AUTRE labo FR = amovible · implants Anthogyr · comblement post-extraction = os humain, évite la greffe le plus souvent · avis Google : home = fiche (lire), footer/fiches post-soin = /review (laisser).

## Pièges outillage connus
- **Secrets Pages sous Windows** : `wrangler pages secret put` via pipe PowerShell ajoute un BOM invisible (clé corrompue, 502). Passer par l'API CF : `PATCH /accounts/{acc}/pages/projects/{proj}` avec `deployment_configs.production.env_vars`, puis redéployer.
- Codemod typo (`scripts/typo-fr.cjs`) : déjà corrigé pour ignorer les `!` Tailwind et `:` CSS — toujours lancer `scripts/fix-nnbsp-classes.cjs` après, puis builder.
- L'outil Edit peut transformer les quotes droites du code en typographiques → vérifier le build après édition.
- Captures de schémas : scrollIntoView + attendre ~2,5 s (animation de dessin), deviceScaleFactor 1, clips ≤ 2000 px.

## Commandes
- Dev : `npm run dev` (ajouter `-- --host` pour tester au téléphone)
- **Déploiement prod (manuel — le push GitHub ne déploie PAS)** : `npm run build` puis `npx wrangler pages deploy dist --project-name drkebieche-site --branch main`
- Avant tout déploiement : `node scripts/typo-fr.cjs && node scripts/fix-nnbsp-classes.cjs && npm run build && node scripts/smoke.cjs`

## Pointers mémoire
`project_kebieche_cabinet` (faits cliniques + voix du praticien) · `feedback_site_direction_artistique` (DA + architecture) · `reference_site_devis_links` (clés Mélyia↔devis) · `reference_google_review_url` · `feedback_regles_travail`
