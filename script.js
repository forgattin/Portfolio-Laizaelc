/* =========================================================
   COMO EDITAR OS VÍDEOS
   - Cada item da lista WORK é um vídeo.
   - youtube: cole só o ID do vídeo (o trecho depois de "v=" ou
     de "/shorts/"). A capa vem do YouTube automaticamente.
     Deixe "" para mostrar "Vídeo em breve".
   - thumb (opcional): link de uma imagem de capa própria.
   - cat: uma das chaves de CATS.
   - lang: idioma do vídeo, 'pt' ou 'en' (usado no filtro de idioma).
   - title: título do vídeo. channel (opcional): canal onde foi publicado.
   ========================================================= */

const CATS = {
  valorant: 'Valorant',
  lol: 'LoL',
  react: 'React',
  gaming: 'Gaming',
  talking: 'Talking head',
  irl: 'IRL',
  cortes: { pt: 'Cortes', en: 'Clips' },
  podcast: 'Podcast',
};

// Vídeo de destaque do topo (showreel). Cole o ID do YouTube quando tiver:
// o topo troca sozinho os destaques abaixo pelo showreel (padrão salvo).
const REEL = { id: 'reel', youtube: '', thumb: '', title: { pt: 'Showreel 2026', en: 'Showreel 2026' } };

// Vitrine do topo enquanto não há showreel: vídeos longos (ids da lista WORK)
// que passam um de cada vez, com a capa em tela cheia.
const CINE = ['l1', 'l13', 'l9', 'l15', 'l10', 'l3'];

// Colaborações (faixa abaixo do topo).
// platform: 'youtube' | 'twitch' | 'instagram'
// url: link do perfil (opcional). photo: link da foto (opcional).
const COLLABS = [
  { name: 'Felca', platform: 'youtube', url: 'https://www.youtube.com/@felcaseita', photo: 'assets/collabs/felca.webp' },
  { name: 'felquinhas', platform: 'youtube', url: 'https://www.youtube.com/@felquinhas', photo: 'assets/collabs/felquinhas.webp' },
  { name: 'Joojina', platform: 'instagram', url: 'https://www.instagram.com/joojinavlr/', photo: '' },
  { name: 'Yulla', platform: 'youtube', url: 'https://www.youtube.com/@yullalol', photo: 'assets/collabs/yulla.webp' },
  { name: 'povcain', platform: 'instagram', url: 'https://www.instagram.com/povcain/', photo: '' },
  { name: 'IANROCKS', platform: 'youtube', url: 'https://www.youtube.com/@IANROCKS0', photo: 'assets/collabs/ianrocks.webp' },
];

const WORK = {
  shorts: [
    { id: 's1', cat: 'valorant', lang: 'pt', youtube: 'gj2zL7tGWqE', title: 'Joojina 1' },
    { id: 's2', cat: 'valorant', lang: 'pt', youtube: 'gixkvSP0WlA', title: 'Daiki - Chamber' },
    { id: 's3', cat: 'valorant', lang: 'pt', youtube: '75uGwh9wgc0', title: 'TCK - Joojina' },
    { id: 's4', cat: 'valorant', lang: 'pt', youtube: 'hbQBnVU5bSU', title: 'Yulla - Estetica' },
    { id: 's5', cat: 'lol', lang: 'en', youtube: '-IAu_RVri38', title: 'MadScientist - Glaive or Voltaic' },
    { id: 's6', cat: 'react', lang: 'en', youtube: 'Mik-UF44QME', title: 'ChaseOh - Math' },
  ],
  long: [
    { id: 'l1', cat: 'react', lang: 'en', youtube: 'aweNzBc45t4', title: 'The Most INSANE Minecraft Tiktoks Of All Time..', channel: 'IANROCKS' },
    { id: 'l2', cat: 'react', lang: 'en', youtube: 'ORpL1mvb3ck', title: 'Secret Lokii' },
    { id: 'l3', cat: 'react', lang: 'pt', youtube: 'cHv63LZ2IPY', title: 'os perigos noturnos da liberdade', channel: 'felquinhas' },
    { id: 'l4', cat: 'react', lang: 'pt', youtube: '_213s5WyNcI', title: 'vai dar namoro do tiktok', channel: 'felquinhas' },
    { id: 'l5', cat: 'react', lang: 'pt', youtube: 'X5DQUVilasI', title: 'egirls bebadas na liberdade são um perigo...', channel: 'felquinhas' },
    { id: 'l6', cat: 'react', lang: 'pt', youtube: 'BveZIyYKweE', title: 'peculiaridades da rua augusta', channel: 'felquinhas' },
    { id: 'l7', cat: 'react', lang: 'pt', youtube: 'H8XpVFc4SM0', title: 'pastora esquizoide do tiktok', channel: 'felquinhas' },
    { id: 'l8', cat: 'react', lang: 'pt', youtube: 'sQ9QSBsIv6A', title: 'compilado tiktoks mais idi0tas da semana', channel: 'felquinhas' },
    { id: 'l9', cat: 'irl', lang: 'en', youtube: '2XzBFEOdHP0', title: 'I Got Injured...', channel: 'IANROCKS' },
    { id: 'l10', cat: 'gaming', lang: 'en', youtube: 'p99nOy109cw', title: 'sendo moggada por MITOMANIACAS', channel: 'Yulla' },
    { id: 'l11', cat: 'gaming', lang: 'en', youtube: '5o_sJZUl0GE', title: 'VR store final' },
    { id: 'l12', cat: 'gaming', lang: 'pt', youtube: 'uVCgRCqiBuM', title: 'Daiki - Haven' },
    { id: 'l13', cat: 'talking', lang: 'pt', youtube: 'OCCsNsQr3Co', title: 'comentários do ifood', channel: 'Felca' },
    { id: 'l14', cat: 'cortes', lang: 'pt', youtube: 'cR3PaxrJIZc', title: 'fazeno brincadeirinha gostosa', channel: 'felquinhas' },
    { id: 'l15', cat: 'podcast', lang: 'pt', youtube: '-aPuVgZaxRY', title: 'Pablo Marçal foi cobrar o Felca ao vivo', channel: 'felquinhas' },
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
    'collabs.title': 'Colaborações',
    'hero.cineAria': 'Vitrine de trabalhos', 'hero.cineLabel': 'Seleção de trabalhos', 'hero.cineAll': 'Ver todos', 'hero.cinePrev': 'Vídeo anterior', 'hero.cineNext': 'Próximo vídeo',
    'hero.reelAria': 'Assistir ao showreel', 'hero.reelSoon': 'Em breve', 'hero.reelWatch': 'Assistir',
    'work.title': 'Trabalhos', 'work.long': 'Vídeos longos',
    'filter.all': 'Todos',
    'filter.lang': 'Idioma do vídeo', 'filter.langAll': 'Todos', 'filter.pt': 'Português', 'filter.en': 'English',
    'filter.empty': 'Nenhum vídeo com esses filtros.', 'filter.clear': 'Limpar filtros',
    'about.title': 'Sobre',
    'about.body': 'Sou editora de vídeo, apaixonada por videogames e por transformar ideias em conteúdos que prendem a atenção, transmitindo sentimento e personalidade! Com 3 anos de atuação profissional, desenvolvi um olhar atento para ritmo, narrativa, estética e tendências, além de facilidade para me adaptar a diferentes estilos e propostas criativas.',
    'about.body2': 'Meu trabalho combina criatividade e técnica para entregar vídeos dinâmicos, envolventes e alinhados à identidade de cada projeto. Estou sempre buscando novas referências, aprimorando minhas habilidades e explorando maneiras de tornar cada edição mais interessante e impactante.',
    'about.expLabel': 'Experiência', 'about.exp': '3 anos de atuação profissional',
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
    'collabs.title': 'Collaborations',
    'hero.cineAria': 'Work showcase', 'hero.cineLabel': 'Selected work', 'hero.cineAll': 'See all', 'hero.cinePrev': 'Previous video', 'hero.cineNext': 'Next video',
    'hero.reelAria': 'Watch the showreel', 'hero.reelSoon': 'Coming soon', 'hero.reelWatch': 'Watch',
    'work.title': 'Work', 'work.long': 'Long-form',
    'filter.all': 'All',
    'filter.lang': 'Video language', 'filter.langAll': 'All', 'filter.pt': 'Português', 'filter.en': 'English',
    'filter.empty': 'No videos match these filters.', 'filter.clear': 'Clear filters',
    'about.title': 'About',
    'about.body': "I'm a video editor with a passion for video games and for turning ideas into content that grabs attention and carries real feeling and personality! Over three years of professional work, I've developed a keen eye for pacing, storytelling, aesthetics and trends, along with the flexibility to adapt to different styles and creative directions.",
    'about.body2': "My work blends creativity and technique to deliver dynamic, engaging videos that stay true to each project's identity. I'm always looking for new references, sharpening my skills and finding ways to make every edit more compelling and impactful.",
    'about.expLabel': 'Experience', 'about.exp': '3 years of professional work',
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
  let vlang = 'all'; // filtro de idioma do vídeo, vale para as duas abas
  const catName = c => (typeof CATS[c] === 'string' ? CATS[c] : (CATS[c] || {})[lang] || '');
  const titleOf = i => (typeof i.title === 'string' ? i.title : i.title[lang]);
  const byId = {};
  WORK.shorts.forEach(i => { byId[i.id] = { ...i, format: 'short' }; });
  WORK.long.forEach(i => { byId[i.id] = { ...i, format: 'long' }; });
  byId.reel = { ...REEL, format: 'long' };
  const reelThumb = REEL.thumb || (REEL.youtube ? `https://i.ytimg.com/vi/${encodeURIComponent(REEL.youtube)}/maxresdefault.jpg` : '');
  if (reelThumb) document.querySelector('.reel__img').style.backgroundImage = `url('${reelThumb}')`;
  if (REEL.youtube) {
    document.querySelector('[data-i18n="hero.reelSoon"]').dataset.i18n = 'hero.reelWatch';
    document.querySelector('.hero').classList.add('hero--reel');
  }

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
  // capas do YouTube: vertical (oar2) para Shorts, maxres para longos;
  // se a versão grande não existir, cai para hqdefault
  const yt = (id, file) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${file}.jpg`;
  const thumbOf = i => i.thumb || (i.youtube ? yt(i.youtube, i.format === 'short' ? 'oar2' : 'maxresdefault') : '');
  const fallbackOf = i => (i.youtube ? yt(i.youtube, 'hqdefault') : '');
  // posição do "brilho" do placeholder varia por card
  const glow = n => `--px:${[28, 70, 45, 62, 35, 55][n % 6]}%;--py:${[22, 35, 65, 18, 50, 30][n % 6]}%`;

  function card(i, n, cols, instant) {
    const thumb = thumbOf(i);
    const img = thumb
      ? `<img src="${esc(thumb)}" data-fallback="${esc(fallbackOf(i))}" alt="" loading="lazy" decoding="async">`
      : '';
    const title = titleOf(i);
    const label = `${t('card.open')}: ${title}`;
    const channel = i.channel ? `<span class="card__channel">${esc(i.channel)}</span>` : '';
    return `<li class="card reveal${instant ? ' is-in' : ''}" style="--d:${(n % cols) * 90}ms">` +
      `<button type="button" class="card__btn" data-open="${i.id}" aria-label="${esc(label)}">` +
      `<span class="card__media">` +
      `<span class="card__img" style="${glow(n)}">${img}</span>` +
      `<span class="card__lang" lang="${i.lang === 'en' ? 'en' : 'pt-BR'}">${i.lang === 'en' ? 'EN' : 'PT'}</span>` +
      `<span class="card__overlay" aria-hidden="true">` +
      `<span class="card__play"><svg viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z"/></svg></span>` +
      `<span class="card__cat">${esc(catName(i.cat))}</span>` +
      `<span class="card__title">${esc(title)}</span>${channel}</span></span>` +
      `<span class="card__caption" aria-hidden="true"><span class="card__cat">${esc(catName(i.cat))}</span>` +
      `<span class="card__title">${esc(title)}</span>${channel}</span>` +
      `</button></li>`;
  }

  // troca a capa pela reserva quando a grande não existe (o YouTube devolve 120×90)
  function wireThumbs(scope) {
    $$('img[data-fallback]', scope).forEach(img => {
      const fb = img.dataset.fallback;
      const check = () => {
        if (fb && img.src !== fb && img.naturalWidth <= 120) img.src = fb;
      };
      img.addEventListener('load', check);
      img.addEventListener('error', () => { if (fb && img.src !== fb) img.src = fb; });
      if (img.complete && img.naturalWidth) check();
    });
  }

  const matches = (group, i) =>
    (filters[group] === 'all' || i.cat === filters[group]) && (vlang === 'all' || i.lang === vlang);

  function renderList(group, instant) {
    const list = group === 'shorts' ? $('#shortsList') : $('#longList');
    const cols = group === 'shorts' ? 4 : 2;
    const items = WORK[group].filter(i => matches(group, i)).map(i => byId[i.id]);
    list.innerHTML = items.length
      ? items.map((i, n) => card(i, n, cols, instant)).join('')
      : `<li class="grid__empty"><p>${esc(t('filter.empty'))}</p>` +
        `<button type="button" class="btn" data-clear-filters>${esc(t('filter.clear'))}</button></li>`;
    wireThumbs(list);
    observe(list);
  }

  function renderFilters() {
    const cats = [...new Set(WORK[tab].map(i => i.cat))];
    const catBtns = ['all', ...cats].map(c =>
      `<button type="button" data-filter="${c}" aria-pressed="${filters[tab] === c}">${esc(c === 'all' ? t('filter.all') : catName(c))}</button>`
    ).join('');
    const langBtns = [['all', 'filter.langAll'], ['pt', 'filter.pt'], ['en', 'filter.en']].map(([v, k]) =>
      `<button type="button" data-vlang="${v}" aria-pressed="${vlang === v}">${esc(t(k))}</button>`
    ).join('');
    $('#filters').innerHTML =
      `<div class="filters__group" role="group" aria-label="${esc(t('aria.filters'))}">${catBtns}</div>` +
      `<div class="filters__group filters__group--lang" role="group" aria-label="${esc(t('filter.lang'))}">` +
      `<span class="filters__label" aria-hidden="true">${esc(t('filter.lang'))}</span>${langBtns}</div>`;
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
  async function refilter(change) {
    change();
    renderFilters();
    const list = tab === 'shorts' ? $('#shortsList') : $('#longList');
    list.classList.add('is-swapping');
    await wait(300);
    renderList(tab, true);
    // o filtro de idioma vale para as duas abas: atualiza a outra também
    renderList(tab === 'shorts' ? 'long' : 'shorts', true);
    list.classList.remove('is-swapping');
  }
  $('#filters').addEventListener('click', e => {
    const c = e.target.closest('[data-filter]');
    if (c && filters[tab] !== c.dataset.filter) refilter(() => { filters[tab] = c.dataset.filter; });
    const l = e.target.closest('[data-vlang]');
    if (l && vlang !== l.dataset.vlang) refilter(() => { vlang = l.dataset.vlang; });
  });
  $('.panels').addEventListener('click', e => {
    if (e.target.closest('[data-clear-filters]')) refilter(() => { filters[tab] = 'all'; vlang = 'all'; });
  });

  /* ---------- Cine: vitrine do topo (enquanto não há showreel) ---------- */
  const cine = (() => {
    const fig = $('#heroCine');
    const box = fig && $('.cine', fig);
    const items = CINE.map(id => byId[id]).filter(i => i && i.youtube);
    if (!box || REEL.youtube || !items.length) return { render() {} };
    const SLIDE = 6; // segundos por vídeo
    fig.style.setProperty('--slide', `${SLIDE}s`);
    const frames = $('.cine__frames', box), info = $('.cine__info', box);
    const thumbs = $('.cine__thumbs', fig), count = $('.cine__count', fig);
    thumbs.style.setProperty('--count', items.length);
    let idx = 0;

    frames.innerHTML = items.map((i, n) =>
      `<img src="${esc(thumbOf(i))}" data-fallback="${esc(fallbackOf(i))}" alt="" decoding="async"${n ? ' loading="lazy"' : ''}>`
    ).join('');
    wireThumbs(frames);

    const pad = n => String(n).padStart(2, '0');
    function paintInfo() {
      const i = items[idx];
      $('.cine__cat', info).textContent = catName(i.cat);
      $('.cine__title', info).textContent = titleOf(i);
      $('.cine__channel', info).textContent = i.channel || '';
      $('.cine__open', box).setAttribute('aria-label', `${t('card.open')}: ${titleOf(i)}`);
      count.textContent = `${pad(idx + 1)} / ${pad(items.length)}`;
    }

    function render() {
      thumbs.innerHTML = items.map((i, n) =>
        `<li><button type="button" class="cine__thumb" data-go="${n}" aria-label="${esc(`${n + 1} / ${items.length}: ${titleOf(i)}`)}">` +
        `<span class="cine__thumb-img"><img src="${esc(yt(i.youtube, 'mqdefault'))}" alt="" loading="lazy" decoding="async"></span>` +
        `<span class="cine__progress"></span></button></li>`
      ).join('');
      show(idx, true);
    }

    function show(n, instant) {
      idx = (n + items.length) % items.length;
      $$('img', frames).forEach((img, k) => {
        img.classList.remove('is-active');
        if (k === idx) { void img.offsetWidth; img.classList.add('is-active'); } // reinicia o zoom
      });
      $$('.cine__thumb', thumbs).forEach((b, k) => {
        b.classList.toggle('is-done', k < idx);
        b.classList.remove('is-active');
        b.removeAttribute('aria-current');
        if (k === idx) { void b.offsetWidth; b.classList.add('is-active'); b.setAttribute('aria-current', 'true'); }
      });
      if (instant) { paintInfo(); return; }
      info.classList.add('is-out');
      setTimeout(() => { paintInfo(); info.classList.remove('is-out'); }, reduce.matches ? 0 : 400);
    }

    // a barra do vídeo atual termina → próximo
    thumbs.addEventListener('animationend', e => {
      if (e.target.closest('.cine__thumb.is-active')) show(idx + 1);
    });
    thumbs.addEventListener('click', e => {
      const b = e.target.closest('[data-go]');
      if (b) show(Number(b.dataset.go));
    });
    $$('[data-step]', box).forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      show(idx + Number(b.dataset.step));
    }));
    $('.cine__open', box).addEventListener('click', () => openPlayer(items[idx]));
    fig.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    });

    // pausa com o mouse em cima (quadro ou painel), com foco dentro, ou fora da tela
    const pause = on => fig.classList.toggle('is-paused', on);
    fig.addEventListener('pointerenter', () => pause(true));
    fig.addEventListener('pointerleave', () => pause(false));
    fig.addEventListener('focusin', () => pause(true));
    fig.addEventListener('focusout', () => pause(false));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { if (!fig.matches(':hover')) pause(!e.isIntersecting); }).observe(fig);
    }
    return { render };
  })();

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
    cine.render();
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
    const label = t(root.dataset.theme === 'light' ? 'theme.toDark' : 'theme.toLight');
    $$('.theme').forEach(b => b.setAttribute('aria-label', label));
  }
  // dois botões (topo e rodapé) controlam o mesmo tema
  $$('.theme').forEach(b => b.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    store.set('theme', root.dataset.theme);
    syncTheme();
  }));

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
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(i.youtube)}?autoplay=1&rel=0" title="${esc(titleOf(i))}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
      : `<span class="player__soon">${esc(t('player.soon'))}</span>`;
    $('#playerCat').textContent = i.cat ? catName(i.cat) : '';
    $('#playerTitle').textContent = titleOf(i);
    player.showModal();
  }
  $('#playerClose').addEventListener('click', () => player.close());
  player.addEventListener('click', e => { if (e.target === player) player.close(); });
  player.addEventListener('close', () => { $('#playerFrame').innerHTML = ''; });

  /* ---------- Colaborações: faixa contínua ---------- */
  const ICONS = {
    youtube: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10 9.2v5.6l4.8-2.8z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24"><path d="M4.5 3.5h16v10l-4 4h-4l-3 3v-3h-5z"/><path d="M11 8v4M15.5 8v4"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r=".6"/></svg>',
  };
  const PLATFORM = { youtube: 'YouTube', twitch: 'Twitch', instagram: 'Instagram' };

  function collabItem(c, hidden) {
    const photo = c.photo ? `<img src="${esc(c.photo)}" alt="" loading="lazy">` : esc(c.name.trim().charAt(0));
    const inner =
      `<span class="collab__photo" aria-hidden="true">${photo}</span>` +
      `<span class="collab__name">${esc(c.name)}</span>` +
      `<span class="collab__icon" role="img" aria-label="${PLATFORM[c.platform] || ''}">${ICONS[c.platform] || ''}</span>`;
    const tab = hidden ? ' tabindex="-1"' : '';
    return `<li${hidden ? ' aria-hidden="true"' : ''}>${c.url
      ? `<a class="collab" href="${esc(c.url)}" target="_blank" rel="noopener"${tab}>${inner}</a>`
      : `<span class="collab">${inner}</span>`}</li>`;
  }

  // repete os cards até a lista cobrir a tela e duplica para o loop sem emenda
  function buildMarquee() {
    const track = $('#collabs .marquee__track');
    if (!track || !COLLABS.length) return;
    let items = COLLABS.slice();
    track.innerHTML = `<ul class="marquee__list">${items.map(c => collabItem(c)).join('')}</ul>`;
    const first = track.firstElementChild;
    let guard = 0;
    while (first.scrollWidth < innerWidth && guard++ < 8) {
      first.insertAdjacentHTML('beforeend', COLLABS.map(c => collabItem(c, true)).join(''));
    }
    track.insertAdjacentHTML('beforeend', `<ul class="marquee__list" aria-hidden="true">${first.innerHTML.replace(/<a /g, '<a tabindex="-1" ')}</ul>`);
    // velocidade constante (~28 px/s), qualquer que seja o número de cards
    track.style.setProperty('--marquee-duration', `${Math.round(first.scrollWidth / 28)}s`);
  }
  buildMarquee();
  let mqTimer;
  let lastW = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    clearTimeout(mqTimer);
    mqTimer = setTimeout(buildMarquee, 200);
  });
  if (document.fonts) document.fonts.ready.then(buildMarquee);

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
