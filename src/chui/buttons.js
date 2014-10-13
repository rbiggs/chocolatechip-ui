(function($) {
  "use strict";
  $(function() {
    ///////////////////////////////////
    // Initialize singletap on buttons:
    ///////////////////////////////////
    $('body').on('singletap', 'button', function() {
      var $this = $(this);
      if ($this.parent('.segmented')[0]) return;
      if ($this.parent('.tabbar')[0]) return;
      if ($.isDesktop) return;
      $this.addClass('selected');
      setTimeout(function() {
        $this.removeClass('selected');
      }, 500);
    });
  });
})(window.$);