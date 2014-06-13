(function($) {
  "use strict";
  document.addEventListener('touchstart', function (e) {
    var parent = e.target,
      i = 0;

    for (i = 0; i < 10; i += 1) {
      if (parent !== null) {
        if (parent.className !== undefined) {
          if (parent.className.match('navigable')) {
            if (parent.scrollTop === 0) {
              parent.scrollTop = 1;
            } else if ((parent.scrollTop + parent.offsetHeight) === parent.scrollHeight) {
              parent.scrollTop = parent.scrollTop - 1;
            }
          }
        }
        parent = parent.parentNode;
      }
    }
  });
})(window.$);