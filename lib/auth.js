// Utilidades compartilhadas pelas Functions do painel.
// Variáveis no Cloudflare Pages: ADMIN_USER, ADMIN_PASSWORD (segredo)
// e o KV ligado com o nome CONTENT.

const enc = new TextEncoder();
const dec = new TextDecoder();

export const COOKIE = 'le_session';

const b64u = buf =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64u = s =>
  Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));

export const configured = env => Boolean(env.ADMIN_USER && env.ADMIN_PASSWORD);

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

// a chave da sessão deriva da senha: trocar a senha encerra todas as sessões
async function hmacKey(env) {
  const secret = 'laiza-admin-v1:' + (env.SESSION_SECRET || env.ADMIN_PASSWORD);
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(env, payload) {
  const body = b64u(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(env), enc.encode(body));
  return body + '.' + b64u(sig);
}

export async function readSession(env, request) {
  const token = getCookie(request, COOKIE);
  if (!token || !configured(env)) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(env), fromB64u(sig), enc.encode(body));
    if (!ok) return null;
    const p = JSON.parse(dec.decode(fromB64u(body)));
    return p.exp > Date.now() ? p : null;
  } catch (e) {
    return null;
  }
}

export function getCookie(request, name) {
  const all = request.headers.get('Cookie') || '';
  const m = all.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

export function sessionCookie(token, maxAge) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

// comparação em tempo constante (compara os HMACs de cada texto)
export async function safeEqual(a, b) {
  const key = await crypto.subtle.importKey('raw', crypto.getRandomValues(new Uint8Array(32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const [x, y] = await Promise.all([crypto.subtle.sign('HMAC', key, enc.encode(a)), crypto.subtle.sign('HMAC', key, enc.encode(b))]);
  const A = new Uint8Array(x), B = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < A.length; i++) diff |= A[i] ^ B[i];
  return diff === 0;
}

// conteúdo atual: o salvo no KV, ou o padrão em /content.json
export async function loadContent(env, request) {
  const saved = env.CONTENT ? await env.CONTENT.get('content') : null;
  if (saved) return JSON.parse(saved);
  const r = await env.ASSETS.fetch(new URL('/content.json', request.url));
  return r.json();
}
