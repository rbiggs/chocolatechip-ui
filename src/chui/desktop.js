(function($) {
  "use strict";
  /////////////////////////////////////////
  // Set classes for desktop compatibility:
  /////////////////////////////////////////
  $.extend({
    UIDesktopCompat : function ( ) {
      if ($.isDesktop && $.isSafari) {
        $('body').addClass('isiOS').addClass('isDesktopSafari isDesktop');
      } else if ($.isDesktop && $.isChrome) {
        $('body').addClass('isAndroid').addClass('isDesktopChrome isDesktop');
      }
    }
  });
  $(function() {
    $.UIDesktopCompat();
  });
})(window.$);