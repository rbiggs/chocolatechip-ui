(function($) {
  "use strict";
  $(function() { 
    $.body = $('body');

    //////////////////////
    // Add the global nav:
    //////////////////////
    if (!$.body[0].classList.contains('splitlayout')) {
      $('body').prepend("<nav id='global-nav'></nav>");
    }

    /////////////////////////////////////////////////
    // Fix Split Layout to display properly on phone:
    /////////////////////////////////////////////////
    if ($.body[0].classList.contains('splitlayout')) {
      if (window.innerWidth < 768) {
        $('meta[name=viewport]').attr('content','width=device-width, initial-scale=0.45, maximum-scale=2, user-scalable=yes');
      }
    }

    /////////////////////////////////////////////////////////
    // Add class to nav when button on right.
    // This allows us to adjust the nav h1 for small screens.
    /////////////////////////////////////////////////////////
    $('h1').each(function(idx, ctx) {
      if (ctx.nextElementSibling && ctx.nextElementSibling.nodeName === 'A') {
        ctx.classList.add('buttonOnRight');
      }
    });

    //////////////////////////////////////////
    // Get any toolbars and adjust the bottom 
    // of their corresponding articles:
    //////////////////////////////////////////
    $('.toolbar').prev('article').addClass('has-toolbar');

    if ($.isiOS && $.isStandalone) {
      $.body[0].classList.add('isStandalone');
    }
  });
})(window.$);