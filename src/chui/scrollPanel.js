(function($) {
  "use strict";
  ///////////////////////////////////////
  // Initialize horizontal scroll panels:
  ///////////////////////////////////////
  $.fn.extend({
    UIHorizontalScrollPanel : function () {
      return this.each(function() {
        var scrollPanel = $(this).find('ul');
        var panelsWidth = 0;
        scrollPanel.find('li').each(function(_, ctx) {
            panelsWidth += parseInt($(ctx).outerWidth(true));
        });
        var parentPadding = (parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')));
        scrollPanel.css('width', (panelsWidth + (parentPadding + parentPadding / 2)));
      });
    }
  });
})(window.$);