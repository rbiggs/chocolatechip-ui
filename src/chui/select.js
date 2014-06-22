(function($) {
  "use strict";
  // Widget to enable styled select boxes (pickers):
  $.extend({
    UISelectBox: function() {
      var showSelectBox = function (element) {
          var event;
          event = document.createEvent('MouseEvents');
          event.initMouseEvent('mousedown', true, true, window);
          element.dispatchEvent(event);
      };
      if (!$.isDesktop && $.isiOS) {
        $('.select-box-label').forEach(function(ctx) {
          var label = $(ctx);
          var select = label.prev();
          if (!select[0].id) {
            select.attr('id', $.Uuid());
          }
          select.trigger('singletap');
          label.text(select.val());
          label.attr('for', select.attr('id'));
        });
        $('.select-box select').on('change', function() {
          $(this).next().text($(this).val());
        });
      } else if (!$.isDesktop) {
        var showDropdown = function (element) {
            var event;
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('mousedown', true, true, window);
            element.dispatchEvent(event);
        };
        if (!$.isDesktop) {
          $('.select-box-label').forEach(function(ctx) {
            if (!ctx.id) {
              $(ctx).prev().attr('id', $.Uuid());
            }
            var val = $(ctx).siblings('select').val();
            $(ctx).text(val);
          });
          $('.select-box select').on('change', function() {
            var val = $(this).find("option:selected").text();
            var $this = $(this);
            $this.next('label').text($(this).val());
            $this.siblings('label').text(val);
          });
          $('body').on('singletap', '.select-box-label', function() {
            showDropdown($('select')[0]);
          });
        } 
      }
    }
  });
  $(function() {
    $.UISelectBox();
  });
})(window.$);