import { json } from '../../../lib/auth.js';

// tira o ID de qualquer formato de link do YouTube
export function youtubeId(input) {
  const s = String(input || '').trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (/(^|\.)youtu\.be$/.test(u.hostname)) return u.pathname.slice(1, 12);
    if (!/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) return '';
    const v = u.searchParams.get('v');
    if (v) return v.slice(0, 11);
    const m = u.pathname.match(/\/(shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
    return m ? m[2] : '';
  } catch (e) {
    return '';
  }
}

// GET /api/admin/youtube?url=...: título e canal do vídeo
export async function onRequestGet({ request }) {
  const link = new URL(request.url).searchParams.get('url') || '';
  const id = youtubeId(link);
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return json({ error: 'invalid_url' }, 400);
  const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id), {
    headers: { 'user-agent': 'Mozilla/5.0 (portfolio admin)' },
  });
  if (!r.ok) return json({ error: r.status === 401 || r.status === 403 ? 'private' : 'not_found', id }, 404);
  const d = await r.json();
  return json({ id, title: d.title || '', channel: d.author_name || '', isShort: /\/shorts\//.test(link) });
}
