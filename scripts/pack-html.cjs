// Génère la version HTML lisible/imprimable du pack GBP
const fs = require('fs');
const body = fs.readFileSync('audit/gbp-pack-body.html', 'utf8');
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pack fiche Google — Dr Kebieche</title>
<style>
  body { font-family: Georgia, serif; max-width: 860px; margin: 40px auto; padding: 0 24px; line-height: 1.65; color: #1A1F1C; background: #F8F6F1; }
  h1 { color: #1F3A3D; border-bottom: 2px solid #C09A5F; padding-bottom: 8px; }
  h2 { color: #1F3A3D; margin-top: 2em; }
  blockquote { background: #fff; border-left: 4px solid #C09A5F; margin: 16px 0; padding: 12px 18px; }
  table { border-collapse: collapse; width: 100%; background: #fff; }
  th, td { border: 1px solid #d5cfc2; padding: 8px 12px; text-align: left; font-size: 15px; }
  th { background: #EDF3F3; }
  code { background: #F0EDE4; padding: 2px 6px; border-radius: 4px; }
  @media print { body { background: #fff; margin: 10px auto; } }
</style>
</head>
<body>
${body}
</body>
</html>`;
fs.writeFileSync('audit/gbp-pack.html', html, 'utf8');
console.log('html genere');
