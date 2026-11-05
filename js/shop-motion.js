/* Shop motion. First load: cards rise in a soft cascade. Search/filter/sort re-renders use a quick fade
   so typing never flickers. */
(function (M) {
  var CFG = { cardStep: 50 };
  M.watch('#grid', '.card', 'up', { step: CFG.cardStep });
  M.sections();
})(window.YMMotion);
