// Cloudflare Pages Function — POST /api/contact
// Reçoit le formulaire de /contact et l'envoie par email au cabinet via Resend.
// Variables d'environnement à configurer dans Cloudflare Pages :
//   RESEND_API_KEY  (clé API https://resend.com — domaine drkebieche.fr à vérifier)
//   CONTACT_TO      (défaut : cabinetdentaire.lacabane@gmail.com)
//   CONTACT_FROM    (défaut : cabinet@drkebieche.fr — doit appartenir au domaine vérifié)
// Sans RESEND_API_KEY, répond 503 : le front bascule automatiquement sur le repli mailto.

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

  const nom = String(data.nom || '').trim().slice(0, 200);
  const contact = String(data.contact || '').trim().slice(0, 200);
  const message = String(data.message || '').trim().slice(0, 5000);
  if (!nom || !contact || !message) {
    return new Response(JSON.stringify({ error: 'champs manquants' }), { status: 400 });
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'cabinet@drkebieche.fr',
      to: [env.CONTACT_TO || 'cabinetdentaire.lacabane@gmail.com'],
      subject: `Message via drkebieche.fr — ${nom}`,
      html: `<p><strong>Nom :</strong> ${esc(nom)}<br><strong>Contact :</strong> ${esc(contact)}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
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
