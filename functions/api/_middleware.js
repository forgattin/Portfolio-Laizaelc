// Vale para todas as rotas /api/*: cabeçalhos de segurança e erro genérico
// (nunca devolve detalhes internos para quem está do lado de fora).

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Robots-Tag': 'noindex, nofollow',
};

export async function onRequest({ request, next }) {
  // a API só aceita os métodos que usa
  if (!['GET', 'HEAD', 'POST', 'PUT'].includes(request.method)) {
    return withHeaders(new Response('Method not allowed', { status: 405 }));
  }
  let res;
  try {
    res = await next();
  } catch (e) {
    res = new Response(JSON.stringify({ error: 'server_error' }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  return withHeaders(res);
}

function withHeaders(res) {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) out.headers.set(k, v);
  return out;
}
