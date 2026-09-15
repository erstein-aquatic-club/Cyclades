/* Mobile navigation v2 — click-only day changes and stable viewport. */
(function () {
  'use strict';

  /* app.js calls scrollIntoView on the active day. With the 2-row grid this can
     move the whole viewport sideways on iOS. Day buttons are all visible now,
     so suppress that call for day pills only. */
  var nativeScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (options) {
    if (this.classList && this.classList.contains('day-pill')) return;
    return nativeScrollIntoView.call(this, options);
  };

  function normalizeViewport() {
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    var rail = document.querySelector('.day-rail');
    if (rail) rail.scrollLeft = 0;
  }

  /* Keep every timeline/upcoming item visible by default and remove the
     expansion controls. This also covers rerenders after changing day. */
  function expandEverything() {
    document.querySelectorAll('.section-title .text-btn').forEach(function (button) {
      var label = (button.textContent || '').trim().toLowerCase();
      if (label === 'tout afficher' || label === 'voir tout') {
        button.click();
        button.hidden = true;
      } else if (label === 'réduire') {
        button.hidden = true;
      }
    });
    normalizeViewport();
  }

  /* Prevent the DayFocus React swipe handler from receiving horizontal touch
     move/end events. Buttons, links, vertical scrolling and arrow clicks remain
     untouched. */
  var startX = null;
  var startY = null;
  document.addEventListener('touchstart', function (event) {
    if (!event.target.closest || !event.target.closest('.day-focus')) return;
    var t = event.touches && event.touches[0];
    if (!t) return;
    startX = t.clientX;
    startY = t.clientY;
  }, true);

  document.addEventListener('touchmove', function (event) {
    if (startX === null || !event.target.closest || !event.target.closest('.day-focus')) return;
    var t = event.touches && event.touches[0];
    if (!t) return;
    var dx = Math.abs(t.clientX - startX);
    var dy = Math.abs(t.clientY - startY);
    if (dx > dy && dx > 8) event.stopPropagation();
  }, true);

  document.addEventListener('touchend', function (event) {
    if (startX !== null && event.target.closest && event.target.closest('.day-focus')) {
      event.stopPropagation();
    }
    startX = null;
    startY = null;
  }, true);

  var observer = new MutationObserver(expandEverything);
  function start() {
    expandEverything();
    var root = document.getElementById('root');
    if (root) observer.observe(root, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
