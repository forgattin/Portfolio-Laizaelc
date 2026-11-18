import { json, configured, readSession } from '../../lib/auth.js';

// GET /api/session: diz se o painel está configurado e se há login ativo
export async function onRequestGet({ request, env }) {
  if (!configured(env)) return json({ configured: false, storage: Boolean(env.CONTENT), user: null });
  const s = await readSession(env, request);
  return json({ configured: true, storage: Boolean(env.CONTENT), user: s ? s.u : null });
}
