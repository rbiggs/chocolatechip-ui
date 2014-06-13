(function($) {
  "use strict";
  $.extend({
    eventStart : null,
    eventEnd : null,
    eventMove : null,
    eventCancel : null,
    // Define min-length for gesture detection:
    gestureLength : 30 
  });

  $(function() {
    //////////////////////////
    // Setup Event Variables:
    //////////////////////////
    // Pointer events for IE10 and WP8:
    if (window.navigator.pointerEnabled) {
      $.eventStart = 'pointerdown';
      $.eventEnd = 'pointerup';
      $.eventMove = 'pointermove';
      $.eventCancel = 'pointercancel';
    // Pointer events for IE10 and WP8:
    } else if (window.navigator.msPointerEnabled) {
      $.eventStart = 'MSPointerDown';
      $.eventEnd = 'MSPointerUp';
      $.eventMove = 'MSPointerMove';
      $.eventCancel = 'MSPointerCancel';
    // Touch events for iOS & Android:
    } else if ('ontouchstart' in window) {
      $.eventStart = 'touchstart';
      $.eventEnd = 'touchend';
      $.eventMove = 'touchmove';
      $.eventCancel = 'touchcancel';
    // Mouse events for desktop:
    } else {
      $.eventStart = 'mousedown';
      $.eventEnd = 'click';
      $.eventMove = 'mousemove';
      $.eventCancel = 'mouseout';
    }
  });
})(window.$);