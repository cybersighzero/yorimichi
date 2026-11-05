/* Basket motion: runs on first load only. Quantity changes re-render the list without replaying it. */
(function (M) {
  var CFG = { rowStep: 70 };
  document.querySelectorAll('#cartBox .row,#cartBox .empty').forEach(function (el) {
    M.revealEl(el, 'up', { step: CFG.rowStep });
  });
  M.sections();
})(window.YMMotion);
