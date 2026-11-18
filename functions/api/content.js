// GET /api/content: conteúdo público do site (salvo pelo painel, ou o padrão)
export async function onRequestGet({ env, request }) {
  const saved = env.CONTENT ? await env.CONTENT.get('content') : null;
  if (saved) {
    return new Response(saved, {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-cache' },
    });
  }
  return env.ASSETS.fetch(new URL('/content.json', request.url));
}
