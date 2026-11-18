import { json } from '../../../lib/auth.js';

const TYPES = ['image/webp', 'image/jpeg', 'image/png'];
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES = 300; // limite de imagens guardadas

// confere a assinatura real do arquivo (não confia só no tipo informado)
function sniff(buf) {
  const b = new Uint8Array(buf.slice(0, 12));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  const ascii = String.fromCharCode(...b);
  if (ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP') return 'image/webp';
  return '';
}

// POST /api/admin/upload (corpo = a imagem): guarda no KV e devolve o link
export async function onRequestPost({ request, env }) {
  const type = (request.headers.get('content-type') || '').split(';')[0].trim();
  if (!TYPES.includes(type)) return json({ error: 'bad_type' }, 415);
  const buf = await request.arrayBuffer();
  if (!buf.byteLength) return json({ error: 'empty' }, 400);
  if (buf.byteLength > MAX_BYTES) return json({ error: 'too_large' }, 413);
  if (sniff(buf) !== type) return json({ error: 'bad_type' }, 415);
  const existing = await env.CONTENT.list({ prefix: 'img:', limit: MAX_IMAGES });
  if (existing.keys.length >= MAX_IMAGES) return json({ error: 'too_many_images' }, 507);
  const id = crypto.randomUUID();
  await env.CONTENT.put('img:' + id, buf, { metadata: { type, created: Date.now() } });
  return json({ url: '/api/img/' + id });
}
