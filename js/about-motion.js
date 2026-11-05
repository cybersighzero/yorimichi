/* About motion: the story appears a little at a time as you read (one group per paragraph). */
(function (M) {
  var CFG = { sceneStep: 150 };
  M.reveal('.prose>*', 'up');
  M.reveal('.scene', 'up', { step: CFG.sceneStep });
  M.sections();
})(window.YMMotion);
