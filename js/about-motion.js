/* About motion + life. Adjust the numbers in CFG (milliseconds). */
(function (M) {
  var CFG = { heroStep: 100, photoStep: 140, panelStep: 140, tileStep: 120, countMs: 1400 };
  M.reveal('.ab-hero .wrap>*', 'up', { step: CFG.heroStep });
  M.reveal('.photo', 'up', { step: CFG.photoStep });
  M.reveal('.story>.panel', 'up', { step: CFG.panelStep });
  M.reveal('.tile', 'up', { step: CFG.tileStep });
  M.reveal('.stats>div', 'up', { step: 100 });
  M.sections();

  // Live Tokyo clock (updates every 15s, no scroll listeners)
  var clock = document.getElementById('tokyoTime');
  function tick() {
    if (clock) clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()) + ' JST';
  }
  tick(); setInterval(tick, 15000);

  // Numbers count up once when scrolled into view (only when motion is allowed)
  if (!document.documentElement.classList.contains('mo')) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, end = el.dataset.count === 'auto' ? PRODUCTS.length : +el.dataset.count, t0 = performance.now();
      io.unobserve(el);
      (function step(t) {
        var k = Math.min(1, (t - t0) / CFG.countMs);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = '0'; io.observe(el); });
})(window.YMMotion);
