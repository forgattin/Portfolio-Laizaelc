/* =========================================================
   Painel do site da Laiza Elc
   Edita o conteúdo (vídeos, textos, fotos, colaborações) e
   publica com /api/admin/content. Nada vai ao ar sem "Salvar".
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

  const SVG = {
    grip: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5.5" cy="3.5" r="1.2"/><circle cx="10.5" cy="3.5" r="1.2"/><circle cx="5.5" cy="8" r="1.2"/><circle cx="10.5" cy="8" r="1.2"/><circle cx="5.5" cy="12.5" r="1.2"/><circle cx="10.5" cy="12.5" r="1.2"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7"/></svg>',
    open: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>',
    ok: '<svg class="toast__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    error: '<svg class="toast__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.2v.3"/></svg>',
    info: '<svg class="toast__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.3"/></svg>',
    notice: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.3"/></svg>',
  };

  const PLATFORMS = [['youtube', 'YouTube'], ['twitch', 'Twitch'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['x', 'X']];
  const CINE_MAX = 8;

  let state = null;       // cópia em edição
  let savedSnap = '';     // como está publicado
  let storageOk = true;
  let view = 'videos';
  let vtab = 'shorts';
  let draft = null;       // vídeo sendo adicionado
  let sortables = [];

  /* ---------- servidor ---------- */
  async function api(path, opts = {}) {
    const headers = { 'X-Requested-With': 'painel', ...(opts.headers || {}) };
    if (opts.json !== undefined) { headers['content-type'] = 'application/json'; opts.body = JSON.stringify(opts.json); }
    const r = await fetch(path, { method: opts.method || 'GET', body: opts.body, headers, credentials: 'same-origin' });
    let data = null;
    try { data = await r.json(); } catch (e) { /* sem corpo */ }
    if (!r.ok) {
      const err = new Error((data && data.error) || 'http_' + r.status);
      err.status = r.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  /* ---------- avisos ---------- */
  function toast(text, type = 'ok', action) {
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.innerHTML = `${SVG[type] || SVG.info}<span class="toast__text">${esc(text)}</span>` +
      (action ? `<button type="button" class="toast__action">${esc(action.label)}</button>` : '');
    const close = () => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); };
    if (action) $('.toast__action', el).addEventListener('click', () => { action.run(); close(); });
    $('#toasts').prepend(el);
    setTimeout(close, action ? 7000 : 4200);
  }

  /* ---------- caixa de diálogo ---------- */
  function modal({ title, body = '', ok = 'Confirmar', cancel = 'Cancelar', danger = false, focus }) {
    const dlg = $('#modal');
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = body;
    const okBtn = $('#modalOk');
    okBtn.textContent = ok;
    okBtn.className = 'btn ' + (danger ? 'btn--danger' : 'btn--primary');
    $('#modalCancel').textContent = cancel;
    return new Promise(resolve => {
      const form = $('#modalForm');
      const done = val => {
        form.removeEventListener('submit', onSubmit);
        $('#modalCancel').removeEventListener('click', onCancel);
        dlg.removeEventListener('cancel', onCancel);
        dlg.close();
        resolve(val);
      };
      const onSubmit = e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        done(new FormData(form));
      };
      const onCancel = e => { e.preventDefault(); done(null); };
      form.addEventListener('submit', onSubmit);
      $('#modalCancel').addEventListener('click', onCancel);
      dlg.addEventListener('cancel', onCancel);
      dlg.showModal();
      const f = focus ? $(focus, dlg) : okBtn;
      if (f) f.focus();
    });
  }

  /* ---------- estado ---------- */
  const TEXT_KEYS = ['role', 'heroLede', 'aboutBody', 'aboutBody2', 'aboutExp', 'aboutFormats', 'aboutContent', 'contactLead', 'contactNote'];
  function normalize(c) {
    c = c || {};
    const text = {};
    ['pt', 'en'].forEach(l => { text[l] = Object.fromEntries(TEXT_KEYS.map(k => [k, (c.text && c.text[l] && c.text[l][k]) || ''])); });
    return {
      version: 1,
      profile: { avatar: '', aboutPhoto: '', contactUrl: '', contactHandle: '', ...(c.profile || {}) },
      text,
      categories: Array.isArray(c.categories) ? c.categories : [],
      videos: { shorts: (c.videos && c.videos.shorts) || [], long: (c.videos && c.videos.long) || [] },
      cine: Array.isArray(c.cine) ? c.cine : [],
      reel: c.reel || '',
      collabs: Array.isArray(c.collabs) ? c.collabs : [],
    };
  }
  const snap = () => JSON.stringify(state);
  const dirty = () => state && snap() !== savedSnap;

  function changed() {
    const d = dirty();
    $('#savebar').classList.toggle('is-visible', d);
    updateCounts();
  }

  function updateCounts() {
    const set = (k, n) => { const b = $(`[data-count="${k}"]`); if (b) b.textContent = n; };
    set('videos', state.videos.shorts.length + state.videos.long.length);
    set('cine', state.cine.length);
    set('collabs', state.collabs.length);
  }

  const catName = id => { const c = state.categories.find(x => x.id === id); return c ? c.pt : ''; };
  const ytThumb = (id, short) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${short ? 'oar2' : 'mqdefault'}.jpg`;
  const ytLink = (id, short) => short ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`;
  // capa de reserva quando a vertical (oar2) não existe
  document.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName === 'IMG' && img.src.includes('/oar2.jpg')) img.src = img.src.replace('/oar2.jpg', '/hqdefault.jpg');
  }, true);

  /* ---------- telas ---------- */
  function show(which) {
    $('#boot').hidden = true;
    ['login', 'setup', 'app'].forEach(id => { $('#' + id).hidden = id !== which; });
  }

  function showSetup(text) {
    $('#setupText').textContent = text;
    show('setup');
  }

  function showLogin(message) {
    $('#loginLead').textContent = message || 'Entre para editar vídeos, textos e fotos do portfólio.';
    $('#loginError').hidden = true;
    show('login');
    setTimeout(() => $('#loginForm [name="user"]').focus(), 50);
  }

  async function boot() {
    let s;
    try { s = await api('/api/session'); } catch (e) {
      return showSetup('Não foi possível falar com o servidor. O painel só funciona no site publicado no Cloudflare; tente recarregar a página.');
    }
    storageOk = s.storage;
    if (!s.configured) return showSetup('Faltam o usuário e a senha do painel nas configurações do projeto no Cloudflare (ADMIN_USER e ADMIN_PASSWORD).');
    if (s.weak) return showSetup('Por segurança, o painel só funciona com uma senha de pelo menos 12 caracteres. Troque o ADMIN_PASSWORD no Cloudflare e publique de novo.');
    if (!s.user) return showLogin();
    await openApp();
  }

  async function openApp() {
    if (!state) {
      try {
        state = normalize(await api('/api/admin/content'));
        savedSnap = snap();
      } catch (e) {
        if (e.status === 401) return showLogin();
        return showSetup('Não foi possível carregar o conteúdo do site. Recarregue a página para tentar de novo.');
      }
    }
    show('app');
    route();
    changed();
  }

  /* ---------- login ---------- */
  $('#pwToggle').addEventListener('click', () => {
    const inp = $('#loginForm [name="password"]');
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    $('#pwToggle').setAttribute('aria-label', show ? 'Esconder senha' : 'Mostrar senha');
  });

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const err = $('#loginError');
    const btn = $('#loginBtn');
    if (!f.get('user') || !f.get('password')) {
      err.textContent = 'Preencha o usuário e a senha.';
      err.hidden = false;
      return;
    }
    btn.classList.add('is-loading');
    err.hidden = true;
    try {
      await api('/api/login', { method: 'POST', json: { user: f.get('user'), password: f.get('password'), remember: f.get('remember') === 'on' } });
      e.target.reset();
      $('#loginForm [name="remember"]').checked = true;
      await openApp();
      if (dirty()) toast('Você entrou de novo. Suas alterações continuam aqui; é só salvar.', 'info');
    } catch (ex) {
      const left = ex.data && ex.data.left;
      err.textContent = ex.status === 429 ? 'Muitas tentativas erradas. Espere 15 minutos e tente de novo.'
        : ex.message === 'weak_password' ? 'A senha cadastrada no Cloudflare é curta demais (mínimo 12 caracteres).'
        : ex.status === 401 ? 'Usuário ou senha incorretos.' + (left !== undefined && left <= 3 ? ` Restam ${left} tentativas.` : '')
        : 'Não foi possível entrar agora. Verifique a internet e tente de novo.';
      err.hidden = false;
      const card = $('.login__card');
      card.classList.remove('is-shaking');
      void card.offsetWidth;
      card.classList.add('is-shaking');
    } finally {
      btn.classList.remove('is-loading');
    }
  });

  $('#logout').addEventListener('click', async () => {
    if (dirty()) {
      const ok = await modal({ title: 'Sair sem salvar?', body: 'As alterações que ainda não foram publicadas serão perdidas.', ok: 'Sair mesmo assim', danger: true });
      if (!ok) return;
    }
    try { await api('/api/logout', { method: 'POST' }); } catch (e) { /* segue */ }
    state = null;
    savedSnap = '';
    $('#savebar').classList.remove('is-visible');
    showLogin('Você saiu do painel.');
  });

  /* ---------- salvar ---------- */
  async function save() {
    if (!dirty()) return;
    if (!storageOk) return toast('O armazenamento do site ainda não está ligado no Cloudflare. Peça para configurarem o KV.', 'error');
    const btn = $('#save');
    btn.classList.add('is-loading');
    try {
      const res = await api('/api/admin/content', { method: 'PUT', json: state });
      state = normalize(res.content);
      savedSnap = snap();
      changed();
      renderView();
      toast('Publicado. O site já mostra as mudanças.', 'ok', { label: 'Ver site', run: () => window.open('/', '_blank', 'noopener') });
    } catch (e) {
      if (e.status === 401) return showLogin('Sua sessão expirou. Entre de novo: suas alterações continuam guardadas aqui.');
      toast(e.status === 413 ? 'O conteúdo ficou grande demais para salvar.' : 'Não foi possível salvar. Verifique a internet e tente de novo.', 'error');
    } finally {
      btn.classList.remove('is-loading');
    }
  }
  $('#save').addEventListener('click', save);
  $('#discard').addEventListener('click', async () => {
    const ok = await modal({ title: 'Descartar alterações?', body: 'Tudo volta a ficar como está publicado no site agora.', ok: 'Descartar', danger: true });
    if (!ok) return;
    state = JSON.parse(savedSnap);
    draft = null;
    changed();
    renderView();
    toast('Alterações descartadas.', 'info');
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && !$('#app').hidden) { e.preventDefault(); save(); }
  });
  addEventListener('beforeunload', e => { if (dirty()) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- navegação entre seções ---------- */
  const VIEWS = { videos: renderVideos, cine: renderCine, texts: renderTexts, photos: renderPhotos, collabs: renderCollabs, reel: renderReel };
  function route() {
    const h = location.hash.slice(1);
    view = VIEWS[h] ? h : 'videos';
    $$('#nav button').forEach(b => {
      const on = b.dataset.view === view;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    renderView();
  }
  function renderView() {
    sortables.forEach(s => s.destroy());
    sortables = [];
    VIEWS[view]();
    $('#main').scrollTop = 0;
  }
  $('#nav').addEventListener('click', e => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    if (location.hash.slice(1) === b.dataset.view) route();
    else location.hash = b.dataset.view;
    $('#main').focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  });
  addEventListener('hashchange', () => { if (!$('#app').hidden) route(); });

  const head = (title, lead, extra = '') =>
    `<header class="view__head"><div><h1 class="view__title">${title}</h1><p class="view__lead">${lead}</p></div>${extra}</header>`;
  const storageNotice = () => storageOk ? '' :
    `<div class="notice">${SVG.notice}<span>O armazenamento do site (KV) ainda não está ligado no Cloudflare. Você pode explorar o painel, mas salvar só funciona depois dessa configuração.</span></div>`;

  // lista arrastável (com teclado: ↑ ↓ na alça)
  function makeSortable(list, arr, onMove) {
    if (window.Sortable) {
      sortables.push(new window.Sortable(list, {
        handle: '.handle',
        animation: 180,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onEnd: ev => {
          if (ev.oldIndex === ev.newIndex) return;
          const [item] = arr.splice(ev.oldIndex, 1);
          arr.splice(ev.newIndex, 0, item);
          changed();
          if (onMove) onMove();
        },
      }));
    }
    list.addEventListener('keydown', e => {
      const h = e.target.closest('.handle');
      if (!h || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
      e.preventDefault();
      const i = Number(h.dataset.index);
      const j = i + (e.key === 'ArrowUp' ? -1 : 1);
      if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      changed();
      (onMove || renderView)();
      const again = $$('.handle', list)[j];
      if (again) again.focus();
    });
  }
  const handle = (i, label) =>
    `<button type="button" class="handle" data-index="${i}" aria-label="Mover ${esc(label)} (use as setas ↑ ↓)">${SVG.grip}</button>`;

  /* =========================================================
     VÍDEOS
     ========================================================= */
  function renderVideos() {
    const n = { shorts: state.videos.shorts.length, long: state.videos.long.length };
    $('#main').innerHTML = `<section class="view">
      ${head('Vídeos', 'Cole o link de um vídeo do YouTube para adicionar ao portfólio. Arraste pela alça para mudar a ordem em que aparecem no site.')}
      ${storageNotice()}
      <form class="adder" id="adder" novalidate>
        <input class="input" id="adderInput" type="url" inputmode="url" autocomplete="off" placeholder="Cole aqui o link do YouTube (vídeo ou Short)" aria-label="Link do YouTube">
        <button class="btn btn--primary" id="adderBtn" type="submit">Buscar vídeo</button>
      </form>
      <div id="draft"></div>
      <div class="toolbar">
        <div class="seg seg--lg" role="group" aria-label="Formato">
          <button type="button" data-vtab="shorts" aria-pressed="${vtab === 'shorts'}">Shorts<span class="seg__count">${n.shorts}</span></button>
          <button type="button" data-vtab="long" aria-pressed="${vtab === 'long'}">Vídeos longos<span class="seg__count">${n.long}</span></button>
        </div>
        <span class="toolbar__hint">${vtab === 'long' ? 'A estrela coloca o vídeo na seleção do topo do site.' : 'A ordem aqui é a ordem no site.'}</span>
      </div>
      <ul class="rows" id="vrows"></ul>
    </section>`;
    renderDraft();
    renderVideoRows();
    // eventos da lista: registrados uma vez por renderização da seção
    const ul = $('#vrows');
    makeSortable(ul, state.videos[vtab], () => renderVideoRows());
    bindVideoRows(ul, state.videos[vtab]);

    const input = $('#adderInput');
    $('#adder').addEventListener('submit', e => { e.preventDefault(); fetchVideo(input.value); });
    input.addEventListener('paste', () => setTimeout(() => fetchVideo(input.value), 30));
    $$('[data-vtab]').forEach(b => b.addEventListener('click', () => { vtab = b.dataset.vtab; renderVideos(); }));
  }

  function categoryOptions(selected) {
    return state.categories.map(c => `<option value="${esc(c.id)}"${c.id === selected ? ' selected' : ''}>${esc(c.pt)}</option>`).join('') +
      '<option value="__new">+ Nova categoria…</option>';
  }

  function renderVideoRows(highlightId) {
    const list = state.videos[vtab];
    const short = vtab === 'shorts';
    const ul = $('#vrows');
    if (!list.length) {
      ul.innerHTML = `<li class="empty"><strong>Nenhum ${short ? 'Short' : 'vídeo longo'} ainda</strong>Cole um link do YouTube no campo acima para adicionar o primeiro.</li>`;
      return;
    }
    ul.innerHTML = list.map((v, i) => {
      const inCine = state.cine.includes(v.id);
      return `<li class="row${v.id === highlightId ? ' is-new' : ''}" data-id="${esc(v.id)}">
        ${handle(i, v.title || 'vídeo')}
        <img class="thumb thumb--${short ? 'short' : 'long'}" src="${esc(ytThumb(v.youtube, short))}" alt="" loading="lazy">
        <div class="row__body">
          <input class="row__title" data-f="title" value="${esc(v.title)}" placeholder="Título do vídeo" aria-label="Título">
          <div class="row__meta">
            <select class="select" data-f="cat" aria-label="Categoria">${categoryOptions(v.cat)}</select>
            <div class="seg" role="group" aria-label="Idioma do vídeo">
              <button type="button" data-lang="pt" aria-pressed="${v.lang !== 'en'}">PT</button>
              <button type="button" data-lang="en" aria-pressed="${v.lang === 'en'}">EN</button>
            </div>
            <input class="input" data-f="channel" value="${esc(v.channel)}" placeholder="Canal (opcional)" aria-label="Canal">
          </div>
        </div>
        <div class="row__actions">
          ${short ? '' : `<button type="button" class="icon-btn${inCine ? ' is-on' : ''}" data-act="star" aria-pressed="${inCine}" title="${inCine ? 'Tirar da seleção do topo' : 'Colocar na seleção do topo'}" aria-label="Seleção do topo">${SVG.star}</button>`}
          <a class="icon-btn" href="${esc(ytLink(v.youtube, short))}" target="_blank" rel="noopener" title="Abrir no YouTube" aria-label="Abrir no YouTube">${SVG.open}</a>
          <button type="button" class="icon-btn icon-btn--danger" data-act="delete" title="Remover do portfólio" aria-label="Remover do portfólio">${SVG.trash}</button>
        </div>
      </li>`;
    }).join('');
  }

  function bindVideoRows(ul, list) {
    const find = el => list.find(v => v.id === el.closest('.row').dataset.id);
    ul.addEventListener('input', e => {
      const f = e.target.dataset.f;
      if (f === 'title' || f === 'channel') { find(e.target)[f] = e.target.value; changed(); }
    });
    ul.addEventListener('change', async e => {
      if (e.target.dataset.f !== 'cat') return;
      const v = find(e.target);
      if (e.target.value === '__new') {
        const id = await newCategory();
        if (id) v.cat = id;
        renderVideoRows();
      } else v.cat = e.target.value;
      changed();
    });
    ul.addEventListener('click', e => {
      const langBtn = e.target.closest('[data-lang]');
      if (langBtn) {
        find(langBtn).lang = langBtn.dataset.lang;
        $$('[data-lang]', langBtn.parentElement).forEach(b => b.setAttribute('aria-pressed', String(b === langBtn)));
        changed();
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      const v = find(act);
      if (act.dataset.act === 'star') {
        const i = state.cine.indexOf(v.id);
        if (i >= 0) state.cine.splice(i, 1);
        else if (state.cine.length >= CINE_MAX) return toast(`A seleção do topo já tem ${CINE_MAX} vídeos. Tire um para colocar outro.`, 'info');
        else state.cine.push(v.id);
        const on = state.cine.includes(v.id);
        act.classList.toggle('is-on', on);
        act.setAttribute('aria-pressed', String(on));
        act.title = on ? 'Tirar da seleção do topo' : 'Colocar na seleção do topo';
        changed();
        toast(on ? 'Colocado na seleção do topo.' : 'Retirado da seleção do topo.', 'info');
      }
      if (act.dataset.act === 'delete') removeVideo(v);
    });
  }

  function removeVideo(v) {
    const list = state.videos[vtab];
    const index = list.indexOf(v);
    const cineIndex = state.cine.indexOf(v.id);
    list.splice(index, 1);
    if (cineIndex >= 0) state.cine.splice(cineIndex, 1);
    changed();
    const row = $(`.row[data-id="${CSS.escape(v.id)}"]`);
    const finish = () => renderVideos();
    if (row) { row.style.opacity = '0'; row.style.transform = 'translateX(12px)'; setTimeout(finish, 220); } else finish();
    toast(`"${v.title || 'Vídeo'}" removido.`, 'info', {
      label: 'Desfazer',
      run: () => {
        list.splice(index, 0, v);
        if (cineIndex >= 0) state.cine.splice(cineIndex, 0, v.id);
        changed();
        if (view === 'videos') renderVideos();
      },
    });
  }

  async function newCategory() {
    const f = await modal({
      title: 'Nova categoria',
      body: `Ela aparece nos filtros do site.
        <label class="field"><span class="field__label">Nome em português</span><input class="input" name="pt" required maxlength="40" autocomplete="off"></label>
        <label class="field"><span class="field__label">Nome em inglês</span><input class="input" name="en" maxlength="40" autocomplete="off" placeholder="Se ficar vazio, usa o mesmo nome"></label>`,
      ok: 'Criar categoria',
      focus: '[name="pt"]',
    });
    if (!f) return null;
    const pt = String(f.get('pt')).trim();
    const en = String(f.get('en')).trim() || pt;
    let id = slug(pt) || uid('c');
    const existing = state.categories.find(c => c.id === id || c.pt.toLowerCase() === pt.toLowerCase());
    if (existing) return existing.id;
    while (state.categories.some(c => c.id === id)) id += '-2';
    state.categories.push({ id, pt, en });
    toast(`Categoria "${pt}" criada.`, 'ok');
    return id;
  }

  // busca título e canal do vídeo colado
  let fetching = 0;
  async function fetchVideo(link) {
    link = String(link || '').trim();
    if (!link) return;
    const token = ++fetching;
    const btn = $('#adderBtn');
    btn.classList.add('is-loading');
    try {
      const d = await api('/api/admin/youtube?url=' + encodeURIComponent(link));
      if (token !== fetching) return;
      const dup = ['shorts', 'long'].find(k => state.videos[k].some(v => v.youtube === d.id));
      if (dup) {
        toast(`Esse vídeo já está no portfólio (${dup === 'shorts' ? 'Shorts' : 'Vídeos longos'}).`, 'info');
        return;
      }
      const format = d.isShort ? 'shorts' : (/\/shorts\//.test(link) ? 'shorts' : vtab);
      const first = state.videos[format][0];
      draft = {
        youtube: d.id,
        title: d.title,
        channel: d.channel && d.channel !== 'Laiza Elc' ? d.channel : '',
        format,
        cat: (first && first.cat) || (state.categories[0] && state.categories[0].id) || '',
        lang: 'pt',
      };
      renderDraft();
    } catch (e) {
      const msg = {
        invalid_url: 'Esse link não parece ser de um vídeo do YouTube.',
        not_found: 'Não encontramos esse vídeo. Confira se ele está público ou "não listado".',
        private: 'Esse vídeo é privado. Deixe como público ou "não listado" para poder usar.',
      }[e.message] || (e.status === 401 ? 'Sua sessão expirou. Recarregue a página e entre de novo.' : 'Não foi possível buscar o vídeo agora. Tente de novo.');
      toast(msg, 'error');
    } finally {
      if (token === fetching) btn.classList.remove('is-loading');
    }
  }

  function renderDraft() {
    const box = $('#draft');
    if (!box) return;
    if (!draft) { box.innerHTML = ''; return; }
    const short = draft.format === 'shorts';
    box.innerHTML = `<form class="draft" id="draftForm">
      <img class="draft__thumb${short ? ' is-short' : ''}" src="${esc(ytThumb(draft.youtube, short))}" alt="">
      <div class="draft__grid">
        <label class="field draft__full"><span class="field__label">Título</span><input class="input" name="title" value="${esc(draft.title)}" required maxlength="200"></label>
        <div class="field"><span class="field__label">Formato</span>
          <div class="seg" role="group" aria-label="Formato">
            <button type="button" data-format="shorts" aria-pressed="${short}">Short</button>
            <button type="button" data-format="long" aria-pressed="${!short}">Vídeo longo</button>
          </div></div>
        <div class="field"><span class="field__label">Idioma do vídeo</span>
          <div class="seg" role="group" aria-label="Idioma do vídeo">
            <button type="button" data-dlang="pt" aria-pressed="${draft.lang === 'pt'}">Português</button>
            <button type="button" data-dlang="en" aria-pressed="${draft.lang === 'en'}">Inglês</button>
          </div></div>
        <label class="field"><span class="field__label">Categoria</span><select class="select" name="cat">${categoryOptions(draft.cat)}</select></label>
        <label class="field"><span class="field__label">Canal (opcional)</span><input class="input" name="channel" value="${esc(draft.channel)}" maxlength="80" placeholder="Onde o vídeo foi publicado"></label>
        <div class="draft__actions">
          <button type="button" class="btn btn--ghost" id="draftCancel">Cancelar</button>
          <button type="submit" class="btn btn--primary">${SVG.plus} Adicionar ao portfólio</button>
        </div>
      </div>
    </form>`;
    const form = $('#draftForm');
    form.addEventListener('input', e => { if (e.target.name === 'title' || e.target.name === 'channel') draft[e.target.name] = e.target.value; });
    form.addEventListener('change', async e => {
      if (e.target.name !== 'cat') return;
      if (e.target.value === '__new') { const id = await newCategory(); if (id) draft.cat = id; renderDraft(); }
      else draft.cat = e.target.value;
    });
    form.addEventListener('click', e => {
      const fb = e.target.closest('[data-format]');
      if (fb) { draft.format = fb.dataset.format; renderDraft(); }
      const lb = e.target.closest('[data-dlang]');
      if (lb) { draft.lang = lb.dataset.dlang; renderDraft(); }
    });
    $('#draftCancel').addEventListener('click', () => { draft = null; renderDraft(); $('#adderInput').value = ''; });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!draft.title.trim()) return toast('Dê um título ao vídeo.', 'error');
      const v = { id: uid('v'), youtube: draft.youtube, title: draft.title.trim(), channel: draft.channel.trim(), cat: draft.cat, lang: draft.lang };
      state.videos[draft.format].unshift(v);
      vtab = draft.format;
      draft = null;
      changed();
      renderVideos();
      renderVideoRows(v.id);
      toast('Vídeo adicionado no topo da lista. Salve para publicar.', 'ok');
    });
    $('[name="title"]', form).focus();
  }

  /* =========================================================
     SELEÇÃO DO TOPO
     ========================================================= */
  function renderCine() {
    const byId = Object.fromEntries(state.videos.long.map(v => [v.id, v]));
    state.cine = state.cine.filter(id => byId[id]);
    const chosen = state.cine.map(id => byId[id]);
    const others = state.videos.long.filter(v => !state.cine.includes(v.id));
    $('#main').innerHTML = `<section class="view">
      ${head('Seleção do topo', `Vídeos longos que passam na vitrine do topo do site, um de cada vez. Arraste para escolher a ordem. Até ${CINE_MAX} vídeos.`)}
      ${state.reel ? `<div class="notice">${SVG.notice}<span>O showreel está ativo, então o topo do site mostra o showreel no lugar desta vitrine. Para voltar a usar a vitrine, remova o showreel.</span></div>` : ''}
      <ul class="rows" id="crows">${chosen.length ? chosen.map((v, i) => `
        <li class="row" data-id="${esc(v.id)}">
          ${handle(i, v.title)}
          <img class="thumb thumb--long" src="${esc(ytThumb(v.youtube))}" alt="" loading="lazy">
          <div class="row__body"><strong style="font-weight:500">${esc(v.title)}</strong><span style="color:var(--muted);font-size:.8125rem">${esc(catName(v.cat))}${v.channel ? ', ' + esc(v.channel) : ''}</span></div>
          <div class="row__actions"><span class="order">${i + 1}</span><button type="button" class="icon-btn icon-btn--danger" data-remove title="Tirar da seleção" aria-label="Tirar da seleção">${SVG.x}</button></div>
        </li>`).join('') : '<li class="empty"><strong>A vitrine está vazia</strong>Escolha abaixo os vídeos que devem aparecer no topo do site.</li>'}
      </ul>
      <div class="toolbar"><h2 class="tgroup__title" style="margin:0">Adicionar à seleção</h2><span class="toolbar__hint">${chosen.length >= CINE_MAX ? 'Limite atingido: tire um vídeo para colocar outro.' : 'Clique num vídeo para colocá-lo no fim da vitrine.'}</span></div>
      ${others.length ? `<div class="picker" id="picker">${others.map(v => `
        <button type="button" class="pick" data-id="${esc(v.id)}"${chosen.length >= CINE_MAX ? ' disabled style="opacity:.4"' : ''}><img src="${esc(ytThumb(v.youtube))}" alt="" loading="lazy"><span>${esc(v.title)}</span></button>`).join('')}</div>`
        : '<div class="empty">Todos os vídeos longos já estão na seleção.</div>'}
    </section>`;
    const ul = $('#crows');
    if (chosen.length) makeSortable(ul, state.cine, renderCine);
    ul.addEventListener('click', e => {
      const b = e.target.closest('[data-remove]');
      if (!b) return;
      state.cine.splice(state.cine.indexOf(b.closest('.row').dataset.id), 1);
      changed();
      renderCine();
    });
    const picker = $('#picker');
    if (picker) picker.addEventListener('click', e => {
      const b = e.target.closest('.pick');
      if (!b || state.cine.length >= CINE_MAX) return;
      state.cine.push(b.dataset.id);
      changed();
      renderCine();
    });
  }

  /* =========================================================
     TEXTOS
     ========================================================= */
  const TEXT_GROUPS = [
    ['Topo do site', [['role', 'Cargo', 60], ['heroLede', 'Descrição curta abaixo do nome', 320]]],
    ['Sobre', [['aboutBody', 'Primeiro parágrafo (em destaque)', 900], ['aboutBody2', 'Segundo parágrafo', 900], ['aboutExp', 'Experiência', 80], ['aboutFormats', 'Formatos', 80], ['aboutContent', 'Conteúdo', 120]]],
    ['Contato', [['contactLead', 'Chamada acima do contato', 120], ['contactNote', 'Observação abaixo do contato', 160]]],
  ];

  function renderTexts() {
    const field = ([key, label, max]) => `<div class="bi">
      <p class="bi__label">${label}</p>
      <div class="bi__cols">${['pt', 'en'].map(l => `<label>
        <span class="bi__lang"><span>${l === 'pt' ? 'Português' : 'English'}</span><span class="bi__count" data-count-for="${key}-${l}">${state.text[l][key].length}/${max}</span></span>
        <textarea class="textarea" rows="1" data-key="${key}" data-lang="${l}" maxlength="${max}" lang="${l === 'pt' ? 'pt-BR' : 'en'}">${esc(state.text[l][key])}</textarea>
      </label>`).join('')}</div></div>`;
    $('#main').innerHTML = `<section class="view">
      ${head('Textos', 'Tudo o que está escrito no site, em português e em inglês. O visitante vê a versão do idioma que escolher.')}
      ${TEXT_GROUPS.map(([g, fields]) => `<div class="tgroup"><h2 class="tgroup__title">${g}</h2>${fields.map(field).join('')}
        ${g === 'Contato' ? `<div class="bi"><p class="bi__label">Link do contato</p><div class="bi__cols">
          <label><span class="bi__lang">Endereço do perfil</span><input class="input" data-profile="contactUrl" value="${esc(state.profile.contactUrl)}" placeholder="https://x.com/..." inputmode="url"></label>
          <label><span class="bi__lang">Texto exibido</span><input class="input" data-profile="contactHandle" value="${esc(state.profile.contactHandle)}" placeholder="@usuario" maxlength="60"></label>
        </div></div>` : ''}</div>`).join('')}
    </section>`;
    const grow = t => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; };
    $$('.textarea').forEach(grow);
    $('#main .view').addEventListener('input', e => {
      const t = e.target;
      if (t.dataset.key) {
        state.text[t.dataset.lang][t.dataset.key] = t.value;
        grow(t);
        const c = $(`[data-count-for="${t.dataset.key}-${t.dataset.lang}"]`);
        if (c) c.textContent = `${t.value.length}/${t.maxLength}`;
        changed();
      }
      if (t.dataset.profile) { state.profile[t.dataset.profile] = t.value.trim(); changed(); }
    });
  }

  /* =========================================================
     FOTOS (recorte e compressão no navegador antes de enviar)
     ========================================================= */
  async function prepareImage(file, w, h) {
    if (!/^image\/(jpeg|png|webp|gif|heic|heif)$/.test(file.type) && !/\.(jpe?g|png|webp|heic)$/i.test(file.name)) throw new Error('bad_type');
    const bmp = await createImageBitmap(file);
    const scale = Math.max(w / bmp.width, h / bmp.height);
    const sw = w / scale, sh = h / scale;
    const sx = (bmp.width - sw) / 2, sy = (bmp.height - sh) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, w, h);
    const blob = await new Promise(r => canvas.toBlob(r, 'image/webp', 0.86));
    if (blob && blob.type === 'image/webp') return blob;
    return new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.88));
  }

  async function uploadImage(file, w, h) {
    const blob = await prepareImage(file, w, h);
    const res = await api('/api/admin/upload', { method: 'POST', body: blob, headers: { 'content-type': blob.type } });
    return res.url;
  }

  function pickFile() {
    return new Promise(resolve => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/jpeg,image/png,image/webp';
      inp.addEventListener('change', () => resolve(inp.files[0] || null));
      inp.click();
    });
  }

  async function handleImage(file, size, onDone, busyEl) {
    if (!file) return;
    if (!storageOk) return toast('O armazenamento do site ainda não está ligado no Cloudflare; não dá para enviar fotos.', 'error');
    busyEl.classList.add('is-busy');
    try {
      const url = await uploadImage(file, size[0], size[1]);
      onDone(url);
      changed();
      toast('Foto trocada. Salve para publicar.', 'ok');
    } catch (e) {
      toast(e.message === 'bad_type' ? 'Use uma imagem JPG, PNG ou WEBP.'
        : e.status === 401 ? 'Sua sessão expirou. Recarregue a página e entre de novo.'
          : e.status === 413 ? 'A imagem é grande demais.' : 'Não foi possível enviar a foto. Tente de novo.', 'error');
    } finally {
      busyEl.classList.remove('is-busy');
    }
  }

  function renderPhotos() {
    const card = (key, title, hint, shape, size) => `<div class="card photo-card">
      <h2 class="card__title">${title}</h2><p class="card__hint">${hint}</p>
      <div class="drop drop--${shape}" data-drop="${key}">${state.profile[key] ? `<img src="${esc(state.profile[key])}" alt="">` : ''}</div>
      <button type="button" class="btn" data-pick="${key}">${SVG.upload} Trocar foto</button>
      <small>Arraste uma imagem para cá ou clique em Trocar foto. Ela é recortada pelo centro.</small>
    </div>`;
    $('#main').innerHTML = `<section class="view">
      ${head('Fotos', 'As fotos do site. As imagens são ajustadas e comprimidas automaticamente antes de enviar.')}
      ${storageNotice()}
      <div class="photos">
        ${card('avatar', 'Foto do ícone', 'O círculo acima do nome, no topo do site.', 'circle', [400, 400])}
        ${card('aboutPhoto', 'Foto do Sobre', 'A foto ao lado do texto Sobre, em formato retrato.', 'portrait', [900, 1200])}
      </div>
    </section>`;
    const SIZES = { avatar: [400, 400], aboutPhoto: [900, 1200] };
    const apply = key => url => { state.profile[key] = url; renderPhotos(); };
    $$('[data-pick]').forEach(b => b.addEventListener('click', async () => {
      const key = b.dataset.pick;
      handleImage(await pickFile(), SIZES[key], apply(key), $(`[data-drop="${key}"]`));
    }));
    $$('[data-drop]').forEach(zone => {
      const key = zone.dataset.drop;
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('is-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('is-over');
        handleImage(e.dataTransfer.files[0], SIZES[key], apply(key), zone);
      });
    });
  }

  /* =========================================================
     COLABORAÇÕES
     ========================================================= */
  function renderCollabs(focusIndex) {
    const list = state.collabs;
    $('#main').innerHTML = `<section class="view">
      ${head('Colaborações', 'Criadores com quem a Laiza já trabalhou. Aparecem na faixa que desliza abaixo do topo do site. Clique na foto para trocar.',
        `<button type="button" class="btn btn--primary" id="addCollab">${SVG.plus} Adicionar criador</button>`)}
      ${storageNotice()}
      <ul class="rows" id="krows">${list.length ? list.map((c, i) => `
        <li class="row row--collab" data-index="${i}">
          ${handle(i, c.name || 'criador')}
          <button type="button" class="avatar-btn" data-photo title="Trocar foto" aria-label="Trocar foto de ${esc(c.name)}">${c.photo ? `<img src="${esc(c.photo)}" alt="">` : esc((c.name || '?').charAt(0).toUpperCase())}</button>
          <div class="collab-fields">
            <input class="input" data-f="name" value="${esc(c.name)}" placeholder="Nome" aria-label="Nome" maxlength="60">
            <select class="select" data-f="platform" aria-label="Plataforma">${PLATFORMS.map(([v, l]) => `<option value="${v}"${v === c.platform ? ' selected' : ''}>${l}</option>`).join('')}</select>
            <input class="input" data-f="url" value="${esc(c.url)}" placeholder="Link do perfil" aria-label="Link do perfil" inputmode="url">
          </div>
          <div class="row__actions"><button type="button" class="icon-btn icon-btn--danger" data-remove title="Remover" aria-label="Remover ${esc(c.name)}">${SVG.trash}</button></div>
        </li>`).join('') : '<li class="empty"><strong>Nenhum criador ainda</strong>Clique em Adicionar criador para começar.</li>'}
      </ul>
    </section>`;
    const ul = $('#krows');
    if (list.length) makeSortable(ul, list, () => renderCollabs());
    const item = el => list[Number(el.closest('.row').dataset.index)];
    ul.addEventListener('input', e => {
      const f = e.target.dataset.f;
      if (!f) return;
      item(e.target)[f] = e.target.value;
      if (f === 'name') {
        const av = $('.avatar-btn', e.target.closest('.row'));
        if (!$('img', av)) av.textContent = (e.target.value || '?').charAt(0).toUpperCase();
      }
      changed();
    });
    ul.addEventListener('change', e => { if (e.target.dataset.f === 'platform') { item(e.target).platform = e.target.value; changed(); } });
    ul.addEventListener('click', async e => {
      const ph = e.target.closest('[data-photo]');
      if (ph) {
        const c = item(ph);
        handleImage(await pickFile(), [160, 160], url => { c.photo = url; renderCollabs(); }, ph);
        return;
      }
      const rm = e.target.closest('[data-remove]');
      if (rm) {
        const i = Number(rm.closest('.row').dataset.index);
        const [c] = list.splice(i, 1);
        changed();
        renderCollabs();
        toast(`${c.name || 'Criador'} removido.`, 'info', { label: 'Desfazer', run: () => { list.splice(i, 0, c); changed(); if (view === 'collabs') renderCollabs(); } });
      }
    });
    $('#addCollab').addEventListener('click', () => {
      list.push({ name: '', platform: 'youtube', url: '', photo: '' });
      changed();
      renderCollabs(list.length - 1);
    });
    if (focusIndex !== undefined) {
      const row = $$('.row', ul)[focusIndex];
      if (row) { row.classList.add('is-new'); $('[data-f="name"]', row).focus(); row.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
  }

  /* =========================================================
     SHOWREEL
     ========================================================= */
  function renderReel() {
    $('#main').innerHTML = `<section class="view">
      ${head('Showreel', 'Quando houver um vídeo de apresentação, cole o link aqui. Ele ocupa o topo do site no lugar da vitrine de trabalhos.')}
      <div class="card">
        <label class="field"><span class="field__label">Link do showreel no YouTube</span>
          <span class="adder" style="display:flex"><input class="input" id="reelInput" inputmode="url" autocomplete="off" placeholder="Cole aqui o link" value="${state.reel ? 'https://youtu.be/' + esc(state.reel) : ''}">
          <button type="button" class="btn btn--primary" id="reelBtn">Usar este vídeo</button></span>
        </label>
        <div id="reelPreview">${state.reel ? reelPreview() : '<p class="card__hint" style="margin:14px 0 0">Sem showreel: o topo mostra a vitrine com a seleção de trabalhos.</p>'}</div>
      </div>
    </section>`;
    const use = async () => {
      const link = $('#reelInput').value.trim();
      if (!link) return;
      const btn = $('#reelBtn');
      btn.classList.add('is-loading');
      try {
        const d = await api('/api/admin/youtube?url=' + encodeURIComponent(link));
        state.reel = d.id;
        changed();
        renderReel();
        toast('Showreel definido. Salve para publicar.', 'ok');
      } catch (e) {
        toast(e.message === 'invalid_url' ? 'Esse link não parece ser de um vídeo do YouTube.' : 'Não encontramos esse vídeo. Confira se ele está público ou "não listado".', 'error');
      } finally {
        btn.classList.remove('is-loading');
      }
    };
    $('#reelBtn').addEventListener('click', use);
    $('#reelInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); use(); } });
    const rm = $('#reelRemove');
    if (rm) rm.addEventListener('click', () => { state.reel = ''; changed(); renderReel(); toast('Showreel removido. O topo volta a mostrar a vitrine.', 'info'); });
  }
  const reelPreview = () => `<div class="reel-preview">
    <img src="${esc(ytThumb(state.reel))}" alt="">
    <div><p style="margin:0 0 12px">Este vídeo aparece no topo do site.</p>
      <button type="button" class="btn btn--sm" id="reelRemove">${SVG.trash} Remover showreel</button></div>
  </div>`;

  boot();
})();
