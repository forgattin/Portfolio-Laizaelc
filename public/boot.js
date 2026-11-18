// Roda antes de desenhar a página: tema salvo e idioma (sem piscar).
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') d.dataset.theme = t;
    var l = localStorage.getItem('lang');
    if (l !== 'pt' && l !== 'en') l = (navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
    d.lang = l === 'pt' ? 'pt-BR' : 'en';
  } catch (e) {}
})();
