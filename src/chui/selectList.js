(function($) {
  'use strict'; 

  $.fn.extend({
    /////////////////////////
    // Initialize Select List 
    /////////////////////////
    /* 
    // For default selection use zero-based integer:
    options = {
      name : name // used on radio buttons as group name, defaults to uuid.
      selected : integer,
      callback : callback
      // callback example:
      function () {
        // this is the selected list item:
        console.log($(this).text());
      }
    }
    */
    UISelectList : function (options) {
      var name = (options && options.name) ? options.name : $.Uuid(); 
      var list = this[0];
      if (list && !$(list).hasClass('select')) {
        this.addClass('select');
      }
      if (!list) return [];
      list.classList.add('select');
      $(list).find('li').forEach(function(ctx, idx) {
        ctx.setAttribute('role', 'radio');
        if (options && options.selected === idx) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
          if (!$(ctx).find('input')[0]) {
            $(ctx).append('<input type="radio" checked="checked" name="' + name + '">');
          } else {
            $(ctx).find('input').attr('checked','checked');
          }
        } else {
          if (!$(ctx).find('input')[0]) {
            $(ctx).append('<input type="radio" name="' + name + '">');
          }
        }
      });
      $(list).on('singletap', 'li', function() {
        var item = this;
        $(item).siblings('li').removeClass('selected');
        $(item).siblings('li').removeAttr('aria-checked');
        $(item).siblings('li').find('input').removeAttr('checked');
        $(item).addClass('selected');
        item.setAttribute('aria-checked', true);
        $(item).find('input').attr('checked','checked');
        if (options && options.callback) {
          options.callback.apply(this, arguments);
        }
      });
    }
  });
})(window.jQuery);