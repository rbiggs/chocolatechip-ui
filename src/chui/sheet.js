(function($) {
  'use strict';

  $.extend({
    ///////////////////////////////////////////////
    // UISheet: Create an Overlay for Buttons, etc.
    ///////////////////////////////////////////////
    /*
      var options {
        id : 'starTrek',
        listClass :'enterprise',
        background: 'transparent',
      }
    */
    UISheet : function ( options ) {
      var id = $.Uuid();
      var listClass = '';
      var background = '';
      if (options) {
        id = options.id ? options.id : id;
        listClass = options.listClass ? ' ' + options.listClass : '';
        background = ' style="background-color:' + options.background + ';" ' || '';
      }
      var sheet = '<div id="' + id + '" class="sheet' + listClass + '"><div class="handle"></div><section class="scroller-vertical"></section></div>';
      $('body').append(sheet);
      $('.sheet .handle').on($.eventStart, function() {
        $.UIHideSheet();
      });
    },

    UIShowSheet : function ( ) {
      $('article.current').addClass('blurred');
      if ($.isAndroid || $.isChrome) {
        $('.sheet').css('display','block');
        setTimeout(function() {
          $('.sheet').addClass('opened');
        }, 20);
      } else {
        $('.sheet').addClass('opened');
      }
    },

    UIHideSheet : function ( ) {
      $('.sheet').removeClass('opened');
      $('article.current').addClass('removeBlurSlow');
      setTimeout(function() {
        $('article').removeClass('blurred');
        $('article').removeClass('removeBlurSlow');
      },500);
    }
  });
})(window.jQuery);