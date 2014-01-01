(function($) {
  'use strict';

  $.fn.extend({
    ////////////////////////////////////////////
    // Allow Segmented Control to toggle panels
    ////////////////////////////////////////////
    UIPanelToggle : function ( panel, callback ) {
      var panels;
      var selected = 0;
      selected = this.children().hazClass('selected').index() || 0;
      if (panel instanceof Array) {
        panels = panel.children('div');
      } else if (typeof panel === 'string') {
        panels = $(panel).children('div');
      }
      panels.eq(selected).siblings().css({display: 'none'});
      if (callback) callback.apply(this, arguments);
      this.on($.eventEnd, 'a', function() {
        panels.eq($(this).index()).css({display:'block'})
          .siblings().css('display','none');
      });
    
      this.on('singletap', '.button', function() {
        var $this = $(this);
        if (this.parentNode.classList.contains('paging')) return;
        $this.siblings('a').removeClass('selected');
        $this.siblings('a').removeAttr('aria-checked');
        $this.addClass('selected');
        $this.attr('aria-checked', true);
      });
    }
  });
})(window.jQuery);