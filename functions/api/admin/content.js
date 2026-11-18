import { json, loadContent } from '../../../lib/auth.js';

// GET /api/admin/content: conteúdo atual para o painel
export async function onRequestGet({ env, request }) {
  return json(await loadContent(env, request));
}

// PUT /api/admin/content: salva (e publica) o conteúdo inteiro
export async function onRequestPut({ env, request }) {
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad_request' }, 400); }
  const content = clean(body);
  const text = JSON.stringify(content);
  if (text.length > 500000) return json({ error: 'too_large' }, 413);
  await env.CONTENT.put('content', text);
  await collectImages(env, text);
  return json({ ok: true, content, savedAt: Date.now() });
}

/* ---------- validação: só guarda o que o site entende ---------- */
const PLATFORMS = ['youtube', 'twitch', 'instagram', 'tiktok', 'x'];
const TEXT_KEYS = ['role', 'heroLede', 'aboutBody', 'aboutBody2', 'aboutExp', 'aboutFormats', 'aboutContent', 'contactLead', 'contactNote'];

const str = (v, max) => String(v ?? '').slice(0, max).trim();
const ytId = v => (/^[A-Za-z0-9_-]{11}$/.test(String(v || '')) ? String(v) : '');
function url(v) {
  const s = str(v, 800);
  if (!s) return '';
  if (/^\/(assets|api\/img)\/[\w./-]+$/.test(s)) return s;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch (e) {
    return '';
  }
}

function clean(c) {
  c = c && typeof c === 'object' ? c : {};
  const seenCat = new Set();
  const categories = (Array.isArray(c.categories) ? c.categories : []).slice(0, 60)
    .map(x => ({ id: str(x && x.id, 40).toLowerCase().replace(/[^a-z0-9-]/g, ''), pt: str(x && x.pt, 40), en: str(x && x.en, 40) }))
    .filter(x => x.id && x.pt && !seenCat.has(x.id) && seenCat.add(x.id))
    .map(x => ({ ...x, en: x.en || x.pt }));
  const fallbackCat = categories[0] ? categories[0].id : '';

  const seenId = new Set();
  const vids = list => (Array.isArray(list) ? list : []).slice(0, 300)
    .map(v => ({
      id: str(v && v.id, 40).replace(/[^\w-]/g, '') || Math.random().toString(36).slice(2, 10),
      youtube: ytId(v && v.youtube),
      title: str(v && v.title, 200),
      channel: str(v && v.channel, 80),
      cat: seenCat.has(v && v.cat) ? v.cat : fallbackCat,
      lang: v && v.lang === 'en' ? 'en' : 'pt',
    }))
    .filter(v => v.youtube && !seenId.has(v.id) && seenId.add(v.id));
  const videos = { shorts: vids(c.videos && c.videos.shorts), long: vids(c.videos && c.videos.long) };

  const longIds = new Set(videos.long.map(v => v.id));
  const cine = [...new Set((Array.isArray(c.cine) ? c.cine : []).map(String))].filter(id => longIds.has(id)).slice(0, 12);

  const collabs = (Array.isArray(c.collabs) ? c.collabs : []).slice(0, 60)
    .map(x => ({
      name: str(x && x.name, 60),
      platform: PLATFORMS.includes(x && x.platform) ? x.platform : 'youtube',
      url: url(x && x.url),
      photo: url(x && x.photo),
    }))
    .filter(x => x.name);

  const text = {};
  ['pt', 'en'].forEach(l => {
    const src = (c.text && c.text[l]) || {};
    text[l] = Object.fromEntries(TEXT_KEYS.map(k => [k, str(src[k], 1500)]));
  });

  const p = c.profile || {};
  const profile = {
    avatar: url(p.avatar),
    aboutPhoto: url(p.aboutPhoto),
    contactUrl: url(p.contactUrl),
    contactHandle: str(p.contactHandle, 60),
  };

  return { version: 1, profile, text, categories, videos, cine, reel: ytId(c.reel), collabs };
}

/* ---------- remove do KV as imagens que não são mais usadas ---------- */
async function collectImages(env, text) {
  const hourAgo = Date.now() - 3600e3; // envios recentes ainda podem estar sem salvar
  let cursor;
  do {
    const page = await env.CONTENT.list({ prefix: 'img:', cursor });
    for (const k of page.keys) {
      const id = k.name.slice(4);
      const created = (k.metadata && k.metadata.created) || 0;
      if (created < hourAgo && !text.includes('/api/img/' + id)) await env.CONTENT.delete(k.name);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
}
