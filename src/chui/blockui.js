(function($) {
  "use strict";
  $.fn.extend({
    /////////////////////////
    // Block Screen with Mask
    /////////////////////////
    UIBlock : function ( opacity ) {
      opacity = opacity ? " style='opacity:" + opacity + "'" : " style='opacity: .5;'";
      $(this).before("<div class='mask'" + opacity + "></div>");
      $('article.current').attr('aria-hidden',true);
      return this;
    },

    //////////////////////////
    // Remove Mask from Screen
    //////////////////////////
    UIUnblock : function ( ) {
      $('.mask').remove();
      $('article.current').removeAttr('aria-hidden');
      return this;
    }
  });
})(window.$);