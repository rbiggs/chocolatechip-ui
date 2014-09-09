(function($) {
  "use strict";
  ///////////////////////////////////////
  // Initialize horizontal scroll panels:
  ///////////////////////////////////////
  $.fn.extend({
    UIHorizontalScrollPanel : function () {
      if (window.$chocolatechipjs) {
        var w = 0;
        this.forEach(function(ctx) {
          var scrollPanel = $(this).find('ul');
          var panelsWidth = 0;
          scrollPanel.find('li').forEach(function(ctx) {
              panelsWidth += ctx.offsetWidth;
          });
          var parentPadding = (parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')));
          w = (panelsWidth + (parentPadding + parentPadding / 2));
          scrollPanel.css('width', w + 'px');
        });
      } else {
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
    }
  });
})(window.$);