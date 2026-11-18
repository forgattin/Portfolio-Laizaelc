import { json } from '../../../lib/auth.js';

const TYPES = ['image/webp', 'image/jpeg', 'image/png'];
const MAX_BYTES = 4 * 1024 * 1024;

// POST /api/admin/upload (corpo = a imagem): guarda no KV e devolve o link
export async function onRequestPost({ request, env }) {
  const type = (request.headers.get('content-type') || '').split(';')[0].trim();
  if (!TYPES.includes(type)) return json({ error: 'bad_type' }, 415);
  const buf = await request.arrayBuffer();
  if (!buf.byteLength) return json({ error: 'empty' }, 400);
  if (buf.byteLength > MAX_BYTES) return json({ error: 'too_large' }, 413);
  const id = crypto.randomUUID();
  await env.CONTENT.put('img:' + id, buf, { metadata: { type, created: Date.now() } });
  return json({ url: '/api/img/' + id });
}
