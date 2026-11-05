/* YORIMICHI motion core (loaded in <head>, shared by all pages)
   - Adds class "mo" to <html> only if animation is allowed, so without JS or with
     prefers-reduced-motion everything stays visible.
   - One IntersectionObserver reveals elements once; no scroll listeners. */
(function () {
  var noop = function () {};
  var M = window.YMMotion = { reveal: noop, revealEl: noop, watch: noop, sections: noop };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('mo');

  // Reveal when ~12% visible. Elements appearing in the same moment are staggered by data-step.
  var io = new IntersectionObserver(function (entries) {
    var i = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.style.setProperty('--d', (i++ * (+el.dataset.step || 0) + (+el.dataset.delay || 0)) + 'ms');
      el.classList.add('in');
      io.unobserve(el);               // once only
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  // dir: up | left | right | fade | special | soft   o: {step, delay} in ms
  function revealEl(el, dir, o) {
    if (!el || el.hasAttribute('data-reveal')) return;
    o = o || {};
    el.setAttribute('data-reveal', dir || 'up');
    if (o.step) el.dataset.step = o.step;
    if (o.delay) el.dataset.delay = o.delay;
    io.observe(el);
  }
  M.revealEl = revealEl;
  M.reveal = function (sel, dir, o) { document.querySelectorAll(sel).forEach(function (el) { revealEl(el, dir, o); }); };

  // For containers JS re-renders (product grids): first batch uses `dir`, later batches a quick soft fade.
  M.watch = function (host, child, dir, o) {
    var h = document.querySelector(host), first = true;
    if (!h) return;
    function mark() {
      var els = h.querySelectorAll(child), d = first ? dir : 'soft';
      if (els.length) first = false;
      els.forEach(function (el) { revealEl(el, d, d === 'soft' ? {} : o); });
    }
    mark();
    new MutationObserver(mark).observe(h, { childList: true });
  };

  // Gentle section transitions: headings, panels, banners, plus a fade for the dark bands.
  M.sections = function () {
    M.reveal('.sec>h1,.sec>h2,.sec>.sub,.sec>.wrap>h2,.sec>.wrap>.sub,.sec .head,.sec>.ctrls,.panel,.promo', 'up', { step: 80 });
    M.reveal('.hours,.sec.dark', 'fade');
  };
})();
