import { json, configured, weakPassword, trustedWrite, sleep, safeEqual, signSession, sessionCookie } from '../../lib/auth.js';

const MAX_TRIES = 8;      // tentativas erradas por IP
const LOCK_SECONDS = 900; // bloqueio de 15 minutos

// POST /api/login  { user, password, remember }
export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  if (weakPassword(env)) return json({ error: 'weak_password' }, 503);
  if (!trustedWrite(request)) return json({ error: 'forbidden' }, 403);

  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const rlKey = 'rl:' + ip;
  const tries = env.CONTENT ? Number((await env.CONTENT.get(rlKey)) || 0) : 0;
  if (tries >= MAX_TRIES) return json({ error: 'too_many' }, 429);

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
  if (!body || typeof body !== 'object' || String(body.user || '').length > 100 || String(body.password || '').length > 200) {
    return json({ error: 'bad_request' }, 400);
  }

  const userOk = await safeEqual(String(body.user || '').trim().toLowerCase(), String(env.ADMIN_USER).trim().toLowerCase());
  const passOk = await safeEqual(String(body.password || ''), String(env.ADMIN_PASSWORD));

  if (!userOk || !passOk) {
    if (env.CONTENT) await env.CONTENT.put(rlKey, String(tries + 1), { expirationTtl: LOCK_SECONDS });
    await sleep(500 + Math.random() * 500); // atrasa tentativas automáticas
    return json({ error: 'invalid', left: Math.max(0, MAX_TRIES - tries - 1) }, 401);
  }

  if (env.CONTENT && tries) await env.CONTENT.delete(rlKey);
  const days = body.remember ? 30 : 1;
  const token = await signSession(env, { u: String(env.ADMIN_USER), exp: Date.now() + days * 864e5 });
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie(token, days * 86400) });
}
