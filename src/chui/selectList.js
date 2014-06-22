(function($) {
  "use strict";
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
      list.classList.add('select');
      $(list).find('li').forEach(function(ctx, idx) {
        var value = ctx.getAttribute("data-select-value") !== null ? ctx.getAttribute("data-select-value") : "";
        ctx.setAttribute('role', 'radio');
        $(ctx).removeClass('selected').find('input').removeAttr('checked');
        if (options && options.selected === idx) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
          if (!$(ctx).find('input')[0]) {
            $(ctx).append('<input type="radio" checked="checked" name="' + name + '" value="' + value +'">');
          } else {
            $(ctx).find('input').prop('checked',true).attr('value', value);
          }
        } else {
          if (!$(ctx).find('input')[0]) {
            $(ctx).append('<input type="radio" name="' + name + '" value="' + value +'">');
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
        $(item).find('input').prop('checked',true);
        if (options && options.callback) {
          options.callback.apply(this, arguments);
        }
      });
    }
  });
})(window.$);