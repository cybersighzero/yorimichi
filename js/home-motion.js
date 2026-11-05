/* Home motion. Adjust the numbers below (milliseconds). The hero opening is pure CSS (see css/motion.css). */
(function (M) {
  var CFG = { cardStep: 90, tileStep: 110, specialPanelDelay: 450 };
  M.watch('#featured', '.card', 'up', { step: CFG.cardStep });          // featured products, staggered
  M.watch('#fresh', '.card', 'up', { step: CFG.cardStep });             // new arrivals
  M.watch('#special', '.card', 'special');                              // daily special: image scales in, text follows
  document.querySelectorAll('.cats .cat').forEach(function (el, i) {    // categories: alternate left / right
    M.revealEl(el, i % 2 ? 'right' : 'left', { step: CFG.tileStep });
  });
  M.reveal('.split>.panel', 'up', { delay: CFG.specialPanelDelay });
  M.sections();
})(window.YMMotion);
