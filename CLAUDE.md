# CLAUDE.md — drkebieche-site

**Lis ce fichier au début de chaque session. Ne jamais le bypasser.**

## Projet
Site personnel **drkebieche.fr** + **drkebieche.com** du Dr Sohaïb Kebieche (chirurgien-dentiste, Colombes 92). Positionnement "boutique chic médical" — ni wellness, ni tech-froid.

Stack : Astro + Tailwind + MDX + Cloudflare Pages (à connecter). Repo : `Sohayb92/drkebieche-site`.

DA validée 2026-05-21 :
- Palette : teal foncé #1F3A3D + crème #F8F6F1 + accent cuivré #C09A5F
- Typo : Newsreader (serif droit, titres) + Inter (body)
- Pas d'italique systématique
- Animations scroll via IntersectionObserver vanilla

## 6 règles de travail PERMANENTES (user 2026-05-21)

1. **Plan avant le code.** Annoncer en français ce que je vais coder, attendre "OK".
2. **Vérifier mon propre travail.** Screenshot via `scripts/screenshot.js`, auto-review, itérer 2-3 fois avant de montrer au user.
3. **Git filet de sécurité.** Commit après chaque étape qui fonctionne.
4. **Mémoire 2 niveaux.** Ce CLAUDE.md court + mémoire complète dans `~/.claude/projects/.../memory/*.md`.
5. **Questions quand ambigu.** 2-3 options + avis + tradeoffs.
6. **Reste simple.** Astro vanilla, pas de lib lourde. Solution simple > solution "académique".

## Architecture validée
- Home : 4 cards familles + CTA "Découvrir tous les soins proposés →"
- /soins : index 4 familles avec sous-listes ancrées
- 4 pages mères : implantologie-chirurgie, parodontologie, dentisterie-adhesive-protheses, soins-quotidiens
- Mélyia → site : URLs avec hash style `/soins/implantologie-chirurgie#greffes-osseuses` pour mails relance

## Workflow release type
1. Plan présenté + validé
2. Code étape par étape, commit chaque étape
3. Screenshot via `npm run dev` + Puppeteer + auto-review 2-3 fois
4. Présenter rendu final au user
5. "OK push" → `git push` (Cloudflare Pages déploie auto une fois connecté)

## Pointers mémoire
- `feedback_regles_travail.md` — 6 règles détaillées
- `feedback_valider_avant_push_prod.md` — workflow validation (cas site spécifique inclus)
- `feedback_site_direction_artistique.md` — DA validée + architecture 4 familles
- `project_kebieche_cabinet.md` — profil pro user (soins, formations, ONCD)
- `reference_google_review_url.md` — lien GBP cabinet
- `reference_google_oauth_setup.md` — config OAuth Mélyia (en cas de lien site ↔ Mélyia)

## Incontournables factuels (validés par le user)
- **Doctolib (tous les CTA)** : `https://www.doctolib.fr/dentiste/colombes/sohaib-kebieche-colombes/booking/motives?specialityId=1&telehealth=false&placeId=practice-494254&source=profile`
- **Email public** : cabinetdentaire.lacabane@gmail.com · **Tél** : 01 42 42 94 69
- **Sécu rembourse 60%** (réforme — plus jamais écrire 70%)
- **Bio** : hospitalier TOUJOURS en parallèle du cabinet (jamais "hôpital puis cabinet") · relativiser l'hôpital ("attaché en chirurgie orale", lieu facultatif) · NE PLUS citer le GHT NOVO Pontoise · 1er cabinet = Paris 8e chez un implantologiste expérimenté (compagnonnage) · APHP toujours au passé (arrêté 2025)
- **DU implanto** : "Université d'Évry Paris-Saclay (2024)" (forme unique)
- **Maintenance paro 6 mois · contrôle+radios+détartrage 1×/an · blanchiment 2h/j 4-6 sem, résultat 3-5 ans**
- Domaine canonique : **drkebieche.fr** (.com en 301)
- Honoraires : PAS de grilles chiffrées sur actes opposables (risque CPAM) — devis systématique · PAS de mention « 100% santé / reste à charge 0 » (retirée à la demande du user 2026-06-11)
- **Plateau technique réel** : cone beam (scanner 3D) + **caméra optique** (empreintes numériques sans pâte) + digue systématique + labo français

## Ne JAMAIS faire
- Push sans validation visuelle screenshot + accord user
- Inventer un nouveau soin/page sans demander
- Repasser à du serif italique éditorial (refusé 2 fois en mai 2026)
- Refondre la palette teal vers du bleu (refusé après analyse agent senior)
- Mentionner APHP au présent (user a arrêté en 2025)
- Mettre "Spécialiste en implantologie" (interdit ONCD → utiliser "Titulaire d'un DU")
- Mettre des témoignages patients (interdit ONCD)
- Créer un onglet "Esthétique" (user ne fait pas d'esthétique pure)

## Commandes utiles
- Dev server : `npm run dev` (http://localhost:4321)
- Build : `npm run build`
- Screenshot : `node scripts/screenshot.js <url>` (à créer)
