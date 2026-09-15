/* Keep every upcoming day visible by default and remove the redundant toggle. */
(function () {
  'use strict';

  function expandUpcomingDays() {
    document.querySelectorAll('.upcoming-block').forEach(function (block) {
      var buttons = block.querySelectorAll('.section-title .text-btn');
      buttons.forEach(function (button) {
        var label = (button.textContent || '').trim().toLowerCase();
        if (label === 'voir tout' || label === 'tout afficher') {
          button.click();
          button.remove();
        } else if (label === 'réduire') {
          button.remove();
        }
      });
    });
  }

  var scheduled = false;
  function scheduleExpand() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      expandUpcomingDays();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleExpand, { once: true });
  } else {
    scheduleExpand();
  }

  new MutationObserver(scheduleExpand).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
