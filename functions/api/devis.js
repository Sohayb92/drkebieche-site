// Cloudflare Pages Function — stockage du récit "devis expliqué" dans KV.
//
// POST /api/devis        : Mélyia publie le récit (JSON lia) sous un jeton opaque.
//   Body : { "d": "<jeton>", "payload": { ...récit lia... } }
//   Auth : si la variable PUBLISH_KEY est définie côté Pages, header
//          Authorization: Bearer <PUBLISH_KEY> requis. Sinon (pas encore posée),
//          l'écriture est ouverte (v1) — À SÉCURISER en ajoutant le secret PUBLISH_KEY.
//
// GET  /api/devis?d=<jeton> : la page /mon-devis lit le récit pour l'afficher.
//
// CORS ouvert (*) car Mélyia (appli Electron, origine "null"/file://) POST en cross-origin.
//
// Le récit nominatif (donnée de santé) vit dans KV derrière un jeton non devinable
// (HDS assumé hors-scope par le praticien) ; la page est noindex ; rien dans les logs.

const JETON_RE = /^[A-Za-z0-9_-]{4,40}$/;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Max-Age': '86400',
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  if (!env.DEVIS_KV) return json({ error: 'stockage indisponible' }, 503);
  if (env.PUBLISH_KEY) {
    const auth = request.headers.get('Authorization') || '';
    if (auth !== 'Bearer ' + env.PUBLISH_KEY) return json({ error: 'non autorisé' }, 401);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'requête invalide' }, 400); }
  const d = String(body.d || '').trim();
  if (!JETON_RE.test(d)) return json({ error: 'jeton invalide' }, 400);
  if (!body.payload || typeof body.payload !== 'object') return json({ error: 'payload manquant' }, 400);
  const val = JSON.stringify(body.payload);
  if (val.length > 30000) return json({ error: 'payload trop volumineux' }, 413);
  await env.DEVIS_KV.put('devis:' + d, val, { expirationTtl: 60 * 60 * 24 * 180 }); // 180 jours
  return json({ ok: true });
}

export async function onRequestGet({ request, env }) {
  if (!env.DEVIS_KV) return json({ error: 'stockage indisponible' }, 503);
  const d = String(new URL(request.url).searchParams.get('d') || '').trim();
  if (!JETON_RE.test(d)) return json({ error: 'jeton invalide' }, 400);
  const val = await env.DEVIS_KV.get('devis:' + d);
  if (!val) return json({ error: 'introuvable' }, 404);
  return new Response(val, {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS },
  });
}
