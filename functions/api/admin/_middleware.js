import { json, configured, weakPassword, trustedWrite, readSession } from '../../../lib/auth.js';

// protege tudo em /api/admin/*: exige login e o armazenamento ligado
export async function onRequest({ request, env, next, data }) {
  // respostas do painel nunca ficam guardadas em cache
  const res = await guard({ request, env, next, data });
  res.headers.set('cache-control', 'no-store');
  return res;
}

async function guard({ request, env, next, data }) {
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  if (weakPassword(env)) return json({ error: 'weak_password' }, 503);
  const session = await readSession(env, request);
  if (!session) return json({ error: 'unauthorized' }, 401);

  // pedidos que alteram algo precisam vir do próprio site e do armazenamento ligado
  if (request.method !== 'GET') {
    if (!trustedWrite(request)) return json({ error: 'forbidden' }, 403);
    if (!env.CONTENT) return json({ error: 'no_storage' }, 503);
  }

  data.user = session.u;
  const r = await next();
  return new Response(r.body, r);
}
