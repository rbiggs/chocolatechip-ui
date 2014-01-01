(function($) {
  'use strict';

  /////////////////////////////////////////
  // Set classes for desktop compatibility:
  /////////////////////////////////////////
  $.extend({
    UIDesktopCompat : function ( ) {
      if ($.isDesktop && $.isSafari) {
        $('body').addClass('isiOS').addClass('isDesktopSafari');
      } else if ($.isDesktop && $.isChrome) {
        $('body').addClass('isAndroid').addClass('isDesktopChrome');
      }
    }
  });
  ////////////////////////////////
  // Determine browser version:
  ////////////////////////////////
  $.extend({
    browserVersion : function ( ) {
      var n = navigator.appName;
      var ua = navigator.userAgent;
      var temp;
      var m = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
      if (m && (temp = ua.match(/version\/([\.\d]+)/i))!== null) m[2]= temp[1];
      m = m ? [m[1], m[2]]: [n, navigator.appVersion, '-?'];
      return m[1];
    }
  });

  $(function() {
    ////////////////////////////////
    // Added classes for client side
    // os-specific styles:
    ////////////////////////////////
    $.body = $('body');
    if ($.isWin) {
      $.body.addClass('isWindows');
    } else if ($.isiOS) {
      $.body.addClass('isiOS');
    } else if ($.isAndroid) {
      $.body.addClass('isAndroid');
    }
    if ($.isSafari && parseInt($.browserVersion(), 10) === 6) {
      $.body.addClass('isSafari6');
    }
    $.UIDesktopCompat();
  });
})(window.jQuery);