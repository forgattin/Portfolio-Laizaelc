/* =========================================================
   COMO EDITAR OS VÍDEOS
   - Cada item da lista WORK é um vídeo.
   - youtube: cole só o ID do vídeo (o trecho depois de "v=" ou
     de "/shorts/"). A capa vem do YouTube automaticamente.
     Deixe "" para mostrar "Vídeo em breve".
   - thumb (opcional): link de uma imagem de capa própria.
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

// Vídeo de destaque do topo (showreel). Cole o ID do YouTube quando tiver.
const REEL = { id: 'reel', youtube: '', thumb: '', title: { pt: 'Showreel 2026', en: 'Showreel 2026' } };

const WORK = {
  shorts: [
    { id: 's1', cat: 'valorant', dur: '0:42', youtube: '', title: { pt: 'Ace de Sheriff no último round', en: 'Sheriff ace in the final round' } },
    { id: 's2', cat: 'lol', dur: '0:35', youtube: '', title: { pt: 'Pentakill de Jinx', en: 'Jinx pentakill' } },
    { id: 's3', cat: 'react', dur: '0:47', youtube: '', title: { pt: 'Reação ao trailer novo', en: 'Reacting to the new trailer' } },
    { id: 's4', cat: 'valorant', dur: '0:58', youtube: '', title: { pt: 'Clutch 1v4 na Ascent', en: '1v4 clutch on Ascent' } },
    { id: 's5', cat: 'lol', dur: '0:51', youtube: '', title: { pt: 'O roubo de Barão que virou o jogo', en: 'The Baron steal that won the game' } },
    { id: 's6', cat: 'react', dur: '0:39', youtube: '', title: { pt: 'Primeira vez vendo esse clipe', en: 'Watching this clip for the first time' } },
    { id: 's7', cat: 'valorant', dur: '0:44', youtube: '', title: { pt: 'Leitura de rotação perfeita', en: 'A perfect rotation read' } },
    { id: 's8', cat: 'lol', dur: '0:33', youtube: '', title: { pt: 'Outplay de Yasuo no meio', en: 'Yasuo outplay in mid lane' } },
  ],
  long: [
    { id: 'l1', cat: 'gaming', dur: '24:18', youtube: '', title: { pt: 'Do ferro ao diamante em 30 dias', en: 'Iron to Diamond in 30 days' } },
    { id: 'l2', cat: 'react', dur: '18:45', youtube: '', title: { pt: 'Reagindo aos melhores clipes do mês', en: 'Reacting to the best clips of the month' } },
    { id: 'l3', cat: 'talking', dur: '12:30', youtube: '', title: { pt: 'Como organizo minha semana de gravação', en: 'How I plan my recording week' } },
    { id: 'l4', cat: 'irl', dur: '27:09', youtube: '', title: { pt: 'Um dia inteiro na feira de games', en: 'A full day at the gaming expo' } },
  ],
};

const I18N = {
  pt: {
    'meta.description': 'Portfólio de Laiza Elc, editora de vídeo para Shorts e vídeos longos: Valorant, LoL, react, talking head e IRL.',
    'nav.work': 'Trabalhos', 'nav.about': 'Sobre', 'nav.contact': 'Contato', 'nav.menu': 'Menu', 'nav.close': 'Fechar',
    'aria.nav': 'Seções', 'aria.lang': 'Idioma', 'aria.tabs': 'Formato', 'aria.filters': 'Filtrar por categoria',
    'theme.toLight': 'Ativar modo claro', 'theme.toDark': 'Ativar modo escuro',
    'hero.lede': 'Edição para criadores de conteúdo. Shorts que prendem nos primeiros segundos e vídeos longos com ritmo do começo ao fim.',
    'hero.cta': 'Ver trabalhos',
    'clients.title': 'Clientes',
    'hero.reelAria': 'Assistir ao showreel', 'hero.reelSoon': 'Em breve', 'hero.reelWatch': 'Assistir',
    'work.title': 'Trabalhos', 'work.long': 'Vídeos longos',
    'filter.all': 'Todos',
    'about.title': 'Sobre',
    'about.body': 'Texto provisório. Aqui entra uma apresentação curta da Laiza: há quanto tempo edita, com quais criadores já trabalhou e como funciona o processo de edição.',
    'about.photo': 'Foto em breve',
    'about.formatsLabel': 'Formatos', 'about.formats': 'Shorts e vídeos longos',
    'about.contentLabel': 'Conteúdo',
    'contact.lead': 'Tem um vídeo para editar?',
    'contact.note': 'Mande uma DM no X.',
    'footer.top': 'Voltar ao topo',
    'player.soon': 'Vídeo em breve', 'player.close': 'Fechar', 'card.open': 'Assistir',
  },
  en: {
    'meta.description': 'Portfolio of Laiza Elc, video editor for Shorts and long-form: Valorant, LoL, react, talking head and IRL.',
    'nav.work': 'Work', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.menu': 'Menu', 'nav.close': 'Close',
    'aria.nav': 'Sections', 'aria.lang': 'Language', 'aria.tabs': 'Format', 'aria.filters': 'Filter by category',
    'theme.toLight': 'Switch to light mode', 'theme.toDark': 'Switch to dark mode',
    'hero.lede': 'Editing for content creators. Shorts that hook in the first seconds and long-form videos that hold their pace to the end.',
    'hero.cta': 'See the work',
    'clients.title': 'Clients',
    'hero.reelAria': 'Watch the showreel', 'hero.reelSoon': 'Coming soon', 'hero.reelWatch': 'Watch',
    'work.title': 'Work', 'work.long': 'Long-form',
    'filter.all': 'All',
    'about.title': 'About',
    'about.body': 'Placeholder text. A short introduction to Laiza goes here: how long she has been editing, which creators she has worked with and how her editing process works.',
    'about.photo': 'Photo coming soon',
    'about.formatsLabel': 'Formats', 'about.formats': 'Shorts and long-form',
    'about.contentLabel': 'Content',
    'contact.lead': 'Got a video to edit?',
    'contact.note': 'Send a DM on X.',
    'footer.top': 'Back to top',
    'player.soon': 'Video coming soon', 'player.close': 'Close', 'card.open': 'Watch',
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
  const wait = ms => new Promise(r => setTimeout(r, reduce.matches ? 0 : ms));

  const saved = store.get('lang');
  let lang = saved === 'pt' || saved === 'en' ? saved
    : (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  const t = k => I18N[lang][k] ?? I18N.pt[k] ?? k;

  let tab = 'shorts';
  const filters = { shorts: 'all', long: 'all' };
  const byId = {};
  WORK.shorts.forEach(i => { byId[i.id] = { ...i, format: 'short' }; });
  WORK.long.forEach(i => { byId[i.id] = { ...i, format: 'long' }; });
  byId.reel = { ...REEL, format: 'long' };
  const reelThumb = REEL.thumb || (REEL.youtube ? `https://i.ytimg.com/vi/${encodeURIComponent(REEL.youtube)}/maxresdefault.jpg` : '');
  if (reelThumb) document.querySelector('.reel__img').style.backgroundImage = `url('${reelThumb}')`;
  if (REEL.youtube) document.querySelector('[data-i18n="hero.reelSoon"]').dataset.i18n = 'hero.reelWatch';

  /* ---------- Revelação ao rolar ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
  const observe = scope => $$('.reveal:not(.is-in)', scope).forEach(el => (io ? io.observe(el) : el.classList.add('is-in')));

  /* ---------- Cards ---------- */
  const thumbOf = i => i.thumb || (i.youtube ? `https://i.ytimg.com/vi/${encodeURIComponent(i.youtube)}/hqdefault.jpg` : '');
  // posição do "brilho" do placeholder varia por card
  const glow = n => `--px:${[28, 70, 45, 62, 35, 55][n % 6]}%;--py:${[22, 35, 65, 18, 50, 30][n % 6]}%`;

  function card(i, n, cols, instant) {
    const thumb = thumbOf(i);
    const img = thumb ? `background-image:url('${esc(thumb)}');` : '';
    const label = `${t('card.open')}: ${i.title[lang]}`;
    return `<li class="card reveal${instant ? ' is-in' : ''}" style="--d:${(n % cols) * 90}ms">` +
      `<button type="button" class="card__btn" data-open="${i.id}" aria-label="${esc(label)}">` +
      `<span class="card__media">` +
      `<span class="card__img" style="${img}${glow(n)}"></span>` +
      `<span class="card__dur">${esc(i.dur)}</span>` +
      `<span class="card__overlay" aria-hidden="true">` +
      `<span class="card__play"><svg viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg></span>` +
      `<span class="card__cat">${esc(CATS[i.cat])}</span>` +
      `<span class="card__title">${esc(i.title[lang])}</span></span></span>` +
      `<span class="card__caption" aria-hidden="true"><span class="card__cat">${esc(CATS[i.cat])}</span>` +
      `<span class="card__title">${esc(i.title[lang])}</span></span>` +
      `</button></li>`;
  }

  function renderList(group, instant) {
    const list = group === 'shorts' ? $('#shortsList') : $('#longList');
    const cols = group === 'shorts' ? 4 : 2;
    const items = WORK[group].filter(i => filters[group] === 'all' || i.cat === filters[group]).map(i => byId[i.id]);
    list.innerHTML = items.map((i, n) => card(i, n, cols, instant)).join('');
    observe(list);
  }

  function renderFilters() {
    const cats = [...new Set(WORK[tab].map(i => i.cat))];
    $('#filters').innerHTML = ['all', ...cats].map(c =>
      `<button type="button" data-filter="${c}" aria-pressed="${filters[tab] === c}">${esc(c === 'all' ? t('filter.all') : CATS[c])}</button>`
    ).join('');
  }

  $('#count-shorts').textContent = WORK.shorts.length;
  $('#count-long').textContent = WORK.long.length;

  /* ---------- Abas: Shorts / Vídeos longos ---------- */
  let busy = false;
  async function setTab(next, focus) {
    if (next === tab || busy) return;
    busy = true;
    const from = $(`#panel-${tab}`), to = $(`#panel-${next}`);
    $$('[role="tab"]').forEach(b => {
      const on = b.dataset.tab === next;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    from.classList.add('is-hiding');
    await wait(450);
    from.hidden = true;
    from.classList.remove('is-hiding');
    tab = next;
    renderFilters();
    to.classList.add('is-hiding');
    to.hidden = false;
    $$('.card', to).forEach(c => c.classList.add('is-in'));
    requestAnimationFrame(() => requestAnimationFrame(() => to.classList.remove('is-hiding')));
    busy = false;
  }
  $('.tabs').addEventListener('click', e => {
    const b = e.target.closest('[role="tab"]');
    if (b) setTab(b.dataset.tab);
  });
  $('.tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    setTab(tab === 'shorts' ? 'long' : 'shorts', true);
  });

  /* ---------- Filtros ---------- */
  $('#filters').addEventListener('click', async e => {
    const b = e.target.closest('[data-filter]');
    if (!b || filters[tab] === b.dataset.filter) return;
    filters[tab] = b.dataset.filter;
    renderFilters();
    const list = tab === 'shorts' ? $('#shortsList') : $('#longList');
    list.classList.add('is-swapping');
    await wait(300);
    renderList(tab, true);
    list.classList.remove('is-swapping');
  });

  /* ---------- Idioma ---------- */
  function applyLang(l) {
    lang = l;
    root.lang = l === 'pt' ? 'pt-BR' : 'en';
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('.lang [data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
    $('meta[name="description"]').setAttribute('content', t('meta.description'));
    syncTheme();
    syncMenuLabel();
    renderFilters();
    renderList('shorts', $$('#shortsList .is-in').length > 0);
    renderList('long', $$('#longList .is-in').length > 0);
  }

  $('.lang').addEventListener('click', async e => {
    const b = e.target.closest('[data-set-lang]');
    if (!b || b.dataset.setLang === lang) return;
    store.set('lang', b.dataset.setLang);
    const main = $('main');
    main.style.transition = 'opacity .35s ease';
    main.style.opacity = '0';
    await wait(350);
    applyLang(b.dataset.setLang);
    main.style.opacity = '';
  });

  /* ---------- Tema ---------- */
  function syncTheme() {
    $('#themeToggle').setAttribute('aria-label', t(root.dataset.theme === 'light' ? 'theme.toDark' : 'theme.toLight'));
  }
  $('#themeToggle').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    store.set('theme', root.dataset.theme);
    syncTheme();
  });

  /* ---------- Menu (celular) ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  function syncMenuLabel() { $('span', menuBtn).textContent = t(menu.hidden ? 'nav.menu' : 'nav.close'); }
  async function toggleMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      menu.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => menu.classList.add('is-open'));
    } else {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      await wait(500);
      menu.hidden = true;
    }
    syncMenuLabel();
    if (!open) $('span', menuBtn).textContent = t('nav.menu');
  }
  menuBtn.addEventListener('click', () => toggleMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) toggleMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) toggleMenu(false); });

  /* ---------- Navegação: fundo ao rolar e link ativo ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (io) {
    const links = $$('.nav__links a');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section').forEach(s => spy.observe(s));
  }

  /* ---------- Player ---------- */
  const player = $('#player');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (b) openPlayer(byId[b.dataset.open]);
  });
  function openPlayer(i) {
    player.classList.toggle('player--short', i.format === 'short');
    $('#playerFrame').innerHTML = i.youtube
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(i.youtube)}?autoplay=1&rel=0" title="${esc(i.title[lang])}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
      : `<span class="player__soon">${esc(t('player.soon'))}</span>`;
    $('#playerCat').textContent = i.cat ? CATS[i.cat] : '';
    $('#playerTitle').textContent = i.title[lang];
    player.showModal();
  }
  $('#playerClose').addEventListener('click', () => player.close());
  player.addEventListener('click', e => { if (e.target === player) player.close(); });
  player.addEventListener('close', () => { $('#playerFrame').innerHTML = ''; });

  /* ---------- Início: idioma detectado (ou salvo) e entrada do hero ---------- */
  applyLang(lang);
  observe(document);
  const start = () => requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));

  /* ---------- Boas-vindas: só quando não há idioma salvo ---------- */
  const welcome = $('#welcome');
  const hasSaved = saved === 'pt' || saved === 'en';
  if (hasSaved || !welcome || typeof welcome.showModal !== 'function') {
    if (welcome) welcome.remove();
    start();
  } else {
    let closing = false;
    const choose = async l => {
      if (closing) return;
      closing = true;
      store.set('lang', l);
      if (l !== lang) applyLang(l);
      welcome.classList.add('is-closing');
      await wait(600);
      welcome.close();
      welcome.remove();
      start();
    };
    welcome.addEventListener('click', e => {
      const b = e.target.closest('[data-welcome]');
      if (b) choose(b.dataset.welcome);
    });
    // Esc mantém o idioma detectado no navegador
    welcome.addEventListener('cancel', e => { e.preventDefault(); choose(lang); });
    welcome.showModal();
    $(`[data-welcome="${lang}"]`, welcome).focus();
  }
})();
