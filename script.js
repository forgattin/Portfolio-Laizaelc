/* =========================================================
   COMO EDITAR OS VÍDEOS
   - Cada item da lista WORK é um vídeo.
   - youtube: cole só o ID do vídeo (o trecho depois de "v=" ou
     de "/shorts/"). Deixe "" para mostrar "Vídeo em breve".
   - cat: uma das chaves de CATS.
   ========================================================= */

const CATS = {
  valorant: 'Valorant',
  lol: 'LoL',
  react: 'React',
  gaming: 'Gaming',
  talking: 'Talking head',
  irl: 'IRL',
};

const WORK = {
  shorts: [
    { id: 's1', cat: 'valorant', dur: '0:42', youtube: '', title: { pt: 'Ace de Sheriff no último round', en: 'Sheriff ace in the final round' } },
    { id: 's2', cat: 'lol', dur: '0:35', youtube: '', title: { pt: 'Pentakill de Jinx no fim do jogo', en: 'Late-game Jinx pentakill' } },
    { id: 's3', cat: 'react', dur: '0:47', youtube: '', title: { pt: 'Reação ao trailer novo', en: 'Reacting to the new trailer' } },
    { id: 's4', cat: 'valorant', dur: '0:58', youtube: '', title: { pt: 'Clutch 1v4 na Ascent', en: '1v4 clutch on Ascent' } },
    { id: 's5', cat: 'lol', dur: '0:51', youtube: '', title: { pt: 'Roubo de Barão que virou o jogo', en: 'The Baron steal that won the game' } },
    { id: 's6', cat: 'react', dur: '0:39', youtube: '', title: { pt: 'Primeira vez vendo esse clipe', en: 'Watching this clip for the first time' } },
  ],
  long: [
    { id: 'l1', cat: 'gaming', dur: '24:18', youtube: '', title: { pt: 'Do ferro ao diamante em 30 dias', en: 'Iron to Diamond in 30 days' } },
    { id: 'l2', cat: 'react', dur: '18:45', youtube: '', title: { pt: 'Reagindo aos melhores clipes do mês', en: 'Reacting to the best clips of the month' } },
    { id: 'l3', cat: 'talking', dur: '12:30', youtube: '', title: { pt: 'Como organizo minha semana de gravação', en: 'How I plan my recording week' } },
    { id: 'l4', cat: 'irl', dur: '27:09', youtube: '', title: { pt: 'Um dia inteiro na feira de games', en: 'A full day at the gaming expo' } },
    { id: 'l5', cat: 'gaming', dur: '41:02', youtube: '', title: { pt: 'Zerando no modo mais difícil', en: 'Beating it on the hardest mode' } },
  ],
};

const I18N = {
  pt: {
    'meta.title': 'Laiza Elc | Editora de vídeo',
    'meta.description': 'Portfólio de Laiza Elc, editora de vídeo para Shorts e vídeos longos: Valorant, LoL, react, talking head e IRL.',
    'nav.intro': 'Início', 'nav.shorts': 'Shorts', 'nav.long': 'Vídeos longos', 'nav.about': 'Sobre', 'nav.contact': 'Contato',
    'aria.lang': 'Idioma', 'aria.scrub': 'Navegação pela linha do tempo', 'aria.playhead': 'Posição na página',
    'theme.toLight': 'Modo claro', 'theme.toDark': 'Modo escuro',
    'hero.role': 'Editora de vídeo',
    'hero.lede': 'Edição para criadores de conteúdo. Shorts que prendem nos primeiros segundos e vídeos longos com ritmo do começo ao fim.',
    'hero.cta': 'Ver trabalhos',
    'shorts.note': 'Vertical, para YouTube Shorts, TikTok e Reels.',
    'long.title': 'Vídeos longos',
    'long.note': 'Episódios completos para o YouTube, do gameplay ao vlog.',
    'filter.all': 'Todos', 'filter.label': 'Filtrar por categoria',
    'about.title': 'Sobre',
    'about.body': 'Texto provisório. Aqui entra uma apresentação curta da Laiza: há quanto tempo edita, com quais criadores já trabalhou e como funciona o processo de edição.',
    'about.photo': 'Foto em breve',
    'contact.lead': 'Tem um vídeo para editar?',
    'contact.note': 'Mande uma DM no X.',
    'player.soon': 'Vídeo em breve', 'player.close': 'Fechar',
  },
  en: {
    'meta.title': 'Laiza Elc | Video editor',
    'meta.description': 'Portfolio of Laiza Elc, video editor for Shorts and long-form: Valorant, LoL, react, talking head and IRL.',
    'nav.intro': 'Intro', 'nav.shorts': 'Shorts', 'nav.long': 'Long-form', 'nav.about': 'About', 'nav.contact': 'Contact',
    'aria.lang': 'Language', 'aria.scrub': 'Timeline navigation', 'aria.playhead': 'Page position',
    'theme.toLight': 'Light mode', 'theme.toDark': 'Dark mode',
    'hero.role': 'Video editor',
    'hero.lede': 'Editing for content creators. Shorts that hook in the first seconds and long-form videos that hold their pace to the end.',
    'hero.cta': 'See the work',
    'shorts.note': 'Vertical, for YouTube Shorts, TikTok and Reels.',
    'long.title': 'Long-form',
    'long.note': 'Full YouTube episodes, from gameplay to vlogs.',
    'filter.all': 'All', 'filter.label': 'Filter by category',
    'about.title': 'About',
    'about.body': 'Placeholder text. A short introduction to Laiza goes here: how long she has been editing, which creators she has worked with and how her editing process works.',
    'about.photo': 'Photo coming soon',
    'contact.lead': 'Got a video to edit?',
    'contact.note': 'Send a DM on X.',
    'player.soon': 'Video coming soon', 'player.close': 'Close',
  },
};

(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
  };
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const saved = store.get('lang');
  let lang = saved === 'pt' || saved === 'en' ? saved
    : (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  const t = k => I18N[lang][k] ?? I18N.pt[k] ?? k;

  const filters = { shorts: 'all', long: 'all' };
  const revealed = new Set();
  const byId = {};
  WORK.shorts.forEach(i => { byId[i.id] = { ...i, format: 'short' }; });
  WORK.long.forEach(i => { byId[i.id] = { ...i, format: 'long' }; });

  // View Transitions quando disponível; troca direta caso contrário
  function transition(update, cls) {
    if (reduce.matches || !document.startViewTransition) { update(); return null; }
    if (cls) root.classList.add(cls);
    const tr = document.startViewTransition(update);
    tr.finished.finally(() => cls && root.classList.remove(cls));
    return tr;
  }

  /* ---------- Renderização ---------- */
  const frame = (item, extra = '') =>
    `<span class="frame frame--${item.format} ${extra}" style="--c:var(--${item.format})">` +
    `<span class="frame__word" aria-hidden="true">${esc(CATS[item.cat])}</span>` +
    `<span class="frame__play" aria-hidden="true"></span>` +
    `<span class="frame__dur">${esc(item.dur)}</span>` +
    `<span class="frame__progress" aria-hidden="true"></span></span>`;

  const visible = group => WORK[group].filter(i => filters[group] === 'all' || i.cat === filters[group]).map(i => byId[i.id]);

  function renderFilters(group) {
    const cats = [...new Set(WORK[group].map(i => i.cat))];
    $(`[data-filters="${group}"]`).innerHTML = ['all', ...cats].map(c =>
      `<button type="button" data-filter="${c}" aria-pressed="${filters[group] === c}">${esc(c === 'all' ? t('filter.all') : CATS[c])}</button>`
    ).join('');
  }

  function renderShorts() {
    $('#shortsList').innerHTML = visible('shorts').map((i, n) => {
      const r = revealed.has(i.id) ? ' is-in' : '';
      return `<li class="short" data-id="${i.id}" style="--d:${(n % 4) * 90}ms">` +
        `<button type="button" class="short__btn" data-open="${i.id}">${frame(i, 'reveal' + r)}` +
        `<span class="short__title">${esc(i.title[lang])}</span>` +
        `<span class="short__cat">${esc(CATS[i.cat])}</span></button></li>`;
    }).join('');
  }

  function renderLong() {
    $('#longList').innerHTML = visible('long').map(i => {
      const r = revealed.has(i.id) ? ' is-in' : '';
      return `<li class="long-item" data-id="${i.id}">` +
        `<button type="button" class="long-item__btn reveal${r}" data-open="${i.id}" style="--c:var(--long)">` +
        frame(i, 'long-item__thumb') +
        `<span class="long-item__title">${esc(i.title[lang])}</span>` +
        `<span class="long-item__cat">${esc(CATS[i.cat])}</span>` +
        `<span class="long-item__dur">${esc(i.dur)}</span></button></li>`;
    }).join('');
  }

  // observa o item (sem clip-path) e revela o quadro dentro dele
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.reveal', e.target).forEach(el => el.classList.add('is-in'));
      revealed.add(e.target.dataset.id);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 }) : null;

  function observeReveals() {
    $$('[data-id]').forEach(host => {
      if (revealed.has(host.dataset.id)) return;
      if (io) io.observe(host);
      else $$('.reveal', host).forEach(el => el.classList.add('is-in'));
    });
  }

  function renderAll() {
    renderFilters('shorts');
    renderFilters('long');
    renderShorts();
    renderLong();
    observeReveals();
    requestAnimationFrame(buildScrub);
  }

  /* ---------- Idioma ---------- */
  function applyLang(l) {
    lang = l;
    root.lang = l === 'pt' ? 'pt-BR' : 'en';
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('.lang-switch [data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.description'));
    syncThemeLabel();
    renderAll();
  }

  $('.lang-switch').addEventListener('click', e => {
    const b = e.target.closest('[data-set-lang]');
    if (!b || b.dataset.setLang === lang) return;
    store.set('lang', b.dataset.setLang);
    transition(() => applyLang(b.dataset.setLang));
  });

  /* ---------- Tema ---------- */
  function syncThemeLabel() {
    const label = t(root.dataset.theme === 'light' ? 'theme.toDark' : 'theme.toLight');
    $('.theme-toggle__label').textContent = label;
    $('#themeToggle').setAttribute('aria-label', label);
  }

  $('#themeToggle').addEventListener('click', e => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const tr = transition(() => {
      root.dataset.theme = next;
      store.set('theme', next);
      syncThemeLabel();
    }, 'vt-theme');
    if (tr) tr.ready.then(() => {
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(.2,.7,.1,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  });

  /* ---------- Filtros ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    const group = b.closest('[data-filters]').dataset.filters;
    const cat = b.dataset.filter;
    if (filters[group] === cat) return;
    const list = group === 'shorts' ? $('#shortsList') : $('#longList');
    const name = () => $$('[data-id]', list).forEach(li => { li.style.viewTransitionName = 'w-' + li.dataset.id; });
    name();
    const tr = transition(() => {
      filters[group] = cat;
      renderFilters(group);
      group === 'shorts' ? renderShorts() : renderLong();
      $$('.reveal', list).forEach(el => el.classList.add('is-in'));
      name();
    });
    const done = () => {
      $$('[data-id]', list).forEach(li => { li.style.viewTransitionName = ''; });
      requestAnimationFrame(buildScrub);
    };
    tr ? tr.finished.finally(done) : done();
  });

  /* ---------- Player ---------- */
  const player = $('#player');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b) openPlayer(byId[b.dataset.open]);
  });

  function openPlayer(item) {
    const fr = $('#playerFrame');
    player.classList.toggle('player--short', item.format === 'short');
    fr.className = `player__frame frame frame--${item.format}`;
    fr.style.setProperty('--c', `var(--${item.format})`);
    fr.innerHTML = item.youtube
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtube)}?autoplay=1&rel=0" title="${esc(item.title[lang])}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
      : `<span class="frame__word" aria-hidden="true">${esc(CATS[item.cat])}</span><span class="player__soon">${esc(t('player.soon'))}</span>`;
    $('#playerTitle').textContent = item.title[lang];
    player.showModal();
  }
  $('#playerClose').addEventListener('click', () => player.close());
  player.addEventListener('click', e => { if (e.target === player) player.close(); });
  player.addEventListener('close', () => { $('#playerFrame').innerHTML = ''; });

  /* ---------- Prévia que segue o cursor (vídeos longos) ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const preview = $('#preview');
    const pFrame = $('.frame', preview);
    const list = $('#longList');
    let x = 0, y = 0, cx = 0, cy = 0, on = false, raf = 0;
    const place = () => {
      const w = preview.offsetWidth, h = preview.offsetHeight;
      const px = cx + 32 + w > innerWidth ? cx - w - 32 : cx + 32;
      preview.style.transform = `translate(${px}px, ${cy - h / 2}px)`;
    };
    const loop = () => {
      const k = reduce.matches ? 1 : 0.16;
      cx += (x - cx) * k; cy += (y - cy) * k;
      place();
      raf = on || Math.abs(x - cx) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    list.addEventListener('pointerenter', e => { x = cx = e.clientX; y = cy = e.clientY; });
    list.addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.addEventListener('pointerover', e => {
      const b = e.target.closest('[data-open]');
      if (!b) return;
      const item = byId[b.dataset.open];
      $('.frame__word', pFrame).textContent = CATS[item.cat];
      $('.frame__dur', pFrame).textContent = item.dur;
      on = true;
      preview.classList.add('is-on');
    });
    list.addEventListener('pointerleave', () => { on = false; preview.classList.remove('is-on'); });
  }

  /* ---------- Timeline de navegação ---------- */
  const scrub = $('#scrub'), track = $('#scrubTrack'), head = $('#playhead'), tc = $('#tc');
  const sections = $$('[data-scrub]');
  let docH = 1, vh = 1, max = 1, trackW = 1, tops = [];

  function measure() {
    docH = root.scrollHeight;
    vh = innerHeight;
    max = Math.max(1, docH - vh);
    trackW = track.clientWidth;
    // cada clipe começa quando o topo da seção passa de 40% da tela
    tops = sections.map((s, i) => {
      if (i === 0) return 0;
      const sy = Math.min(max, Math.max(0, s.getBoundingClientRect().top + scrollY - vh * 0.4));
      return progressAt(sy) * docH;
    });
  }
  // posição de leitura: vai do topo ao fim do documento
  const progressAt = sy => Math.min(1, Math.max(0, (sy + vh * (sy / max)) / docH));
  const progress = () => progressAt(scrollY);
  const scrollFor = p => (p * docH) / (1 + vh / max);
  const pad = n => String(n).padStart(2, '0');
  const FPS = 24, TOTAL = 3 * 60 * FPS;
  const timecode = p => {
    const f = Math.round(p * TOTAL);
    return `00:${pad(Math.floor(f / (60 * FPS)))}:${pad(Math.floor(f / FPS) % 60)}:${pad(f % FPS)}`;
  };

  function buildScrub() {
    measure();
    $$('.scrub__clip', track).forEach(c => c.remove());
    sections.forEach((s, i) => {
      const left = (tops[i] / docH) * 100;
      const right = i < sections.length - 1 ? (tops[i + 1] / docH) * 100 : 100;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'scrub__clip';
      b.dataset.target = s.id;
      b.style.left = left + '%';
      b.style.width = `calc(${right - left}% - 2px)`;
      b.style.setProperty('--c', `var(--${s.dataset.color})`);
      b.textContent = t('nav.' + s.dataset.scrub);
      track.insertBefore(b, head);
    });
    update();
  }

  let ticking = false;
  function update() {
    ticking = false;
    const p = progress();
    head.style.transform = `translateX(${p * trackW}px)`;
    const pos = p * docH;
    let active = 0;
    tops.forEach((top, i) => { if (pos >= top) active = i; });
    $$('.scrub__clip', track).forEach((c, i) => c.classList.toggle('is-active', i === active));
    const code = timecode(p);
    tc.textContent = code;
    head.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    head.setAttribute('aria-valuetext', `${t('nav.' + sections[active].dataset.scrub)}, ${code}`);
  }

  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(buildScrub));
  if (document.fonts) document.fonts.ready.then(buildScrub);
  if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(buildScrub)).observe($('main'));

  const seek = (clientX, smooth) => {
    const r = track.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    scrollTo({ top: scrollFor(p), behavior: smooth && !reduce.matches ? 'smooth' : 'instant' });
  };

  let drag = null, suppressClick = false;
  scrub.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    suppressClick = false;
    drag = { x: e.clientX, id: e.pointerId, moved: false };
    if (e.target === head) { drag.moved = true; scrub.setPointerCapture(e.pointerId); scrub.classList.add('is-scrubbing'); }
  });
  scrub.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.abs(e.clientX - drag.x) < 4) return;
      drag.moved = true;
      scrub.setPointerCapture(drag.id);
      scrub.classList.add('is-scrubbing');
    }
    seek(e.clientX, false);
  });
  const endDrag = () => {
    if (drag && drag.moved) suppressClick = true;
    drag = null;
    scrub.classList.remove('is-scrubbing');
  };
  scrub.addEventListener('pointerup', endDrag);
  scrub.addEventListener('pointercancel', endDrag);
  scrub.addEventListener('click', e => {
    if (suppressClick) { suppressClick = false; return; }
    const clip = e.target.closest('.scrub__clip');
    if (clip) {
      const target = document.getElementById(clip.dataset.target);
      if (sections[0] === target) scrollTo({ top: 0, behavior: reduce.matches ? 'instant' : 'smooth' });
      else target.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth' });
    } else if (e.target !== head) {
      seek(e.clientX, true);
    }
  });
  head.addEventListener('keydown', e => {
    const steps = { ArrowRight: 0.02, ArrowUp: 0.02, ArrowLeft: -0.02, ArrowDown: -0.02, PageDown: 0.1, PageUp: -0.1 };
    let p = progress();
    if (e.key in steps) p += steps[e.key];
    else if (e.key === 'Home') p = 0;
    else if (e.key === 'End') p = 1;
    else return;
    e.preventDefault();
    scrollTo({ top: scrollFor(Math.min(1, Math.max(0, p))), behavior: 'instant' });
  });

  /* ---------- Abertura ---------- */
  const gate = $('#gate');
  const gated = $$('[data-gated]');
  const start = () => requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));

  applyLang(lang);

  if (root.classList.contains('has-lang')) {
    gate.remove();
    start();
  } else {
    gated.forEach(el => { el.inert = true; });
    const pref = $(`[data-set-lang="${lang}"]`, gate);
    if (pref) pref.focus({ preventScroll: true });
    gate.addEventListener('click', e => {
      const b = e.target.closest('[data-set-lang]');
      if (!b || gate.classList.contains('is-leaving')) return;
      store.set('lang', b.dataset.setLang);
      applyLang(b.dataset.setLang);
      gated.forEach(el => { el.inert = false; });
      gate.classList.add('is-leaving');
      start();
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        gate.remove();
        root.classList.add('has-lang');
        buildScrub();
      };
      gate.addEventListener('transitionend', ev => { if (ev.target === gate) finish(); });
      setTimeout(finish, 1100);
    });
  }
})();
