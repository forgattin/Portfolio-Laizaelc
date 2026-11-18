import { json, configured, readSession } from '../../../lib/auth.js';

// protege tudo em /api/admin/*: exige login e o armazenamento ligado
export async function onRequest({ request, env, next, data }) {
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  const session = await readSession(env, request);
  if (!session) return json({ error: 'unauthorized' }, 401);

  // pedidos que alteram algo precisam vir do próprio site e do armazenamento ligado
  if (request.method !== 'GET') {
    const origin = request.headers.get('Origin');
    if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'forbidden' }, 403);
    if (!env.CONTENT) return json({ error: 'no_storage' }, 503);
  }

  data.user = session.u;
  return next();
}
