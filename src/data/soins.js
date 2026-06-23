// Registre partagé des soins (clés + libellés pédagogiques).
// Utilisé par comprendre-mon-devis.astro (toutes les cartes, filtrées par ?soins=)
// et mon-devis.astro (page patient personnalisée par lien).
export const soins = [
  // Implantologie & chirurgie
  { key: 'implant', famille: 'Implantologie & chirurgie', titre: "Pose d’implant dentaire", href: '/soins/implantologie-chirurgie#implants', resume: "Une racine artificielle en titane placée dans l’os, planifiée en 3D, sur laquelle une couronne est fixée après cicatrisation." },
  { key: 'comblement', famille: 'Implantologie & chirurgie', titre: 'Comblement osseux après extraction', href: '/soins/implantologie-chirurgie#comblement-alveolaire', resume: "L’alvéole est comblée au moment de l’extraction pour conserver le volume osseux — et poser l’implant sereinement, sans greffe dans la majorité des cas." },
  { key: 'greffe-osseuse', famille: 'Implantologie & chirurgie', titre: 'Reconstruction osseuse pré-implantaire', href: '/soins/implantologie-chirurgie#greffes-osseuses', resume: "Quand l’os manque, une greffe prépare le terrain de l’implant — uniquement si nécessaire, sur décision du scanner 3D." },
  { key: 'chirurgie-orale', famille: 'Implantologie & chirurgie', titre: 'Chirurgie orale, extraction complexe', href: '/soins/implantologie-chirurgie#chirurgie-orale', resume: "Extractions difficiles, kystes, racines fracturées — sous anesthésie locale, avec l’expérience hospitalière en chirurgie orale." },
  { key: 'dds', famille: 'Implantologie & chirurgie', titre: 'Dents de sagesse', href: '/soins/implantologie-chirurgie#dents-de-sagesse', resume: "Extraction quand elles posent ou vont poser un vrai problème — décision sur examen et radiographie panoramique." },
  // Parodontologie
  { key: 'paro', famille: 'Parodontologie', titre: 'Traitement parodontal (gencives)', href: '/soins/parodontologie#soin-gencives', resume: "Débridement et désinfection pour stopper la parodontite — l’infection qui détruit silencieusement le support des dents." },
  { key: 'greffe-gencive', famille: 'Parodontologie', titre: 'Greffe de gencive (récessions)', href: '/soins/parodontologie#recessions-gingivales', resume: "Recouvrir les racines exposées par une chirurgie plastique mini-invasive (technique du tunnel)." },
  { key: 'maintenance-paro', famille: 'Parodontologie', titre: 'Maintenance parodontale', href: '/soins/parodontologie#maintenance', resume: "Le suivi régulier (tous les 6 mois) qui stabilise les résultats du traitement parodontal dans le temps." },
  // Dentisterie adhésive & prothèses
  { key: 'overlay', famille: 'Dentisterie adhésive & prothèses', titre: 'Overlay céramique', href: '/soins/dentisterie-adhesive-protheses#inlay-onlay-overlay', resume: "Une pièce de céramique sur mesure, collée sous digue, qui coiffe toute la surface de mastication et protège la dent des fêlures." },
  { key: 'onlay', famille: 'Dentisterie adhésive & prothèses', titre: 'Onlay céramique', href: '/soins/dentisterie-adhesive-protheses#inlay-onlay-overlay', resume: "Une pièce de céramique sur mesure qui recouvre la ou les pointes abîmées de la dent, collée sous digue, en préservant le maximum de tissu sain." },
  { key: 'facette', famille: 'Dentisterie adhésive & prothèses', titre: 'Facette céramique', href: '/soins/dentisterie-adhesive-protheses#facettes', resume: "Une fine pellicule de céramique collée sur la face visible de la dent pour harmoniser le sourire, en préservant la dent." },
  { key: 'composite', famille: 'Dentisterie adhésive & prothèses', titre: 'Composite stratifié', href: '/soins/dentisterie-adhesive-protheses#composites', resume: "La dent reconstruite couche par couche, sous digue, en une séance — pour les caries petites à moyennes." },
  { key: 'couronne', famille: 'Dentisterie adhésive & prothèses', titre: 'Couronne', href: '/soins/dentisterie-adhesive-protheses#couronnes-bridges', resume: "Un « casque » sur mesure qui coiffe la dent quand le collage ne suffit plus — céramo-métallique, céramo-céramique ou zircone, précisé sur le devis." },
  { key: 'bridge', famille: 'Dentisterie adhésive & prothèses', titre: 'Bridge', href: '/soins/dentisterie-adhesive-protheses#couronnes-bridges', resume: "Un « pont » qui remplace une dent absente en prenant appui sur les dents voisines couronnées." },
  { key: 'couronne-implant', famille: 'Dentisterie adhésive & prothèses', titre: 'Couronne sur implant', href: '/soins/dentisterie-adhesive-protheses#protheses-implants', resume: "La dent remplacée sans toucher aux dents voisines : une couronne fixée sur la racine artificielle." },
  { key: 'amovible', famille: 'Dentisterie adhésive & prothèses', titre: 'Prothèse amovible (complète ou partielle)', href: '/soins/dentisterie-adhesive-protheses#protheses-amovibles', resume: "Quand l’implant n’est pas possible ou pas souhaité : partielle à châssis métallique (stellite), complète, ou provisoire en résine." },
  // Soins du quotidien
  { key: 'carie', famille: 'Soins du quotidien', titre: 'Soin de carie', href: '/soins/soins-quotidiens#caries', resume: "Traitée tôt, une carie reste une petite réparation — elle progresse de l’émail vers le nerf si on attend." },
  { key: 'te', famille: 'Soins du quotidien', titre: 'Traitement de racine (dévitalisation)', href: '/soins/soins-quotidiens#endodontie', resume: "Quand la carie atteint le nerf : canaux nettoyés, désinfectés et obturés sous digue — puis la dent est protégée." },
  { key: 'rte', famille: 'Soins du quotidien', titre: 'Retraitement de racine', href: '/soins/soins-quotidiens#retraitement', resume: "La reprise d’un ancien traitement devenu non étanche, avec une lésion au bout de la racine — et ses deux suites possibles." },
  { key: 'detartrage', famille: 'Soins du quotidien', titre: 'Détartrage & contrôle', href: '/soins/soins-quotidiens#detartrage', resume: "Le rendez-vous annuel qui enlève le tartre et dépiste tôt — caries débutantes, déchaussement, usure." },
  { key: 'blanchiment', famille: 'Soins du quotidien', titre: 'Blanchiment dentaire', href: '/soins/soins-quotidiens#blanchiment', resume: "Gouttières sur mesure portées 2 h par jour pendant 4 à 6 semaines — résultat qui tient en général 3 à 5 ans." },
  { key: 'gouttiere', famille: 'Soins du quotidien', titre: 'Gouttière occlusale (bruxisme)', href: '/soins/soins-quotidiens#gouttiere-bruxisme', resume: "Une attelle fine et sur mesure, portée la nuit, qui protège les dents du serrement et du grincement (bruxisme)." },
];

export const familles = [...new Set(soins.map((s) => s.famille))];
