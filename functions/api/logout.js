import { json, sessionCookie, trustedWrite } from '../../lib/auth.js';

// POST /api/logout: apaga o cookie da sessão
export async function onRequestPost({ request }) {
  if (!trustedWrite(request)) return json({ error: 'forbidden' }, 403);
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
}
