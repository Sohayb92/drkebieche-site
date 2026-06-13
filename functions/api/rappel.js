// Cloudflare Pages Function — POST /api/rappel
// Notifie le cabinet qu'un patient souhaite être rappelé / prendre rendez-vous.
// La fiche est identifiée par un JETON opaque (réf) généré par Mélyia.
// AUCUNE donnée patient/santé ne transite ici : seulement le jeton technique.
// Réutilise les mêmes variables d'env que /api/contact (Resend).
// Pas de onRequestGet : un simple chargement de lien (scanner Gmail) ne déclenche rien.

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'service indisponible' }), { status: 503 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'requête invalide' }), { status: 400 });
  }

  // Honeypot : champ caché « site » rempli par les bots → 200 muet
  if (String(data.site || '').trim()) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Jeton opaque uniquement (non énumérable, généré par Mélyia). Rien d'autre n'est lu.
  const r = String(data.r || '').trim();
  if (!/^[A-Za-z0-9]{4,16}$/.test(r)) {
    return new Response(JSON.stringify({ error: 'référence invalide' }), { status: 400 });
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const quand = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'cabinet@drkebieche.fr',
      to: [env.CONTACT_TO || 'cabinetdentaire.lacabane@gmail.com'],
      subject: `[RAPPEL] réf ${r}`,
      html: `<p><strong>Demande de rappel reçue</strong> via le bouton du devis.</p>`
        + `<p>Référence : <strong>${esc(r)}</strong> — à retrouver dans Mélyia.</p>`
        + `<p style="color:#5E6863">Reçue le ${esc(quand)}.</p>`,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'envoi impossible' }), { status: 502 });
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
