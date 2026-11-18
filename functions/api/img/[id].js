// GET /api/img/:id: imagens enviadas pelo painel (guardadas no KV)
export async function onRequestGet({ params, env }) {
  const id = String(params.id || '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !env.CONTENT) return new Response('Not found', { status: 404 });
  const { value, metadata } = await env.CONTENT.getWithMetadata('img:' + id, { type: 'arrayBuffer' });
  if (!value) return new Response('Not found', { status: 404 });
  return new Response(value, {
    headers: {
      'content-type': ['image/webp', 'image/jpeg', 'image/png'].includes(metadata && metadata.type) ? metadata.type : 'application/octet-stream',
      'content-disposition': 'inline',
      // cada envio gera um id novo, então a imagem nunca muda: cache longo
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
