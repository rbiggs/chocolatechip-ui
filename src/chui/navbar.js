(function($) {
  "use strict";
  /////////////////////////
  // Hide and show navbars:
  /////////////////////////
  $.extend({    
    UIHideNavBar : function () {
      $('nav').hide();
      $.body.addClass('hide-navbars');
    },

    UIShowNavBar : function () {
      $('nav').show();
      $.body.removeClass('hide-navbars');
    }
  });
})(window.$);