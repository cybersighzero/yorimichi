/* Product details motion: image then info, then related items. */
(function (M) {
  var CFG = { blockStep: 140, cardStep: 90 };
  M.watch('#pd', ':scope > *', 'up', { step: CFG.blockStep });
  M.watch('#rel', '.card', 'up', { step: CFG.cardStep });
  M.sections();
})(window.YMMotion);
