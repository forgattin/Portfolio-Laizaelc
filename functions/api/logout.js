import { json, sessionCookie } from '../../lib/auth.js';

// POST /api/logout: apaga o cookie da sessão
export async function onRequestPost() {
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
}
