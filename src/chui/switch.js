(function($) {
  'use strict';

  $.fn.extend({

    ////////////////////////////
    // Initialize Switch Control
    ////////////////////////////
    UISwitch : function ( ) {
      var hasThumb = false;
      this.forEach(function(ctx, idx) {
        ctx.setAttribute('role','checkbox');
        if ($(ctx).data('ui-setup') === true) return;
        if (!ctx.querySelector('input')) {
          ctx.insertAdjacentHTML('afterBegin', '<input type="checkbox">');
        }
        if (ctx.classList.contains('on')) {
          ctx.querySelector('input').setAttribute('checked', 'checked');
        }
        if (ctx.querySelector('em')) hasThumb = true;
        if (!hasThumb) {
          ctx.insertAdjacentHTML('afterBegin', '<em></em>');
        }
        $(ctx).on('singletap', function() {
          var checkbox = ctx.querySelector('input');
          if (ctx.classList.contains('on')) {
            ctx.classList.remove('on');
            ctx.removeAttribute('aria-checked');
            checkbox.removeAttribute('checked');
          } else {
            ctx.classList.add('on');
            checkbox.setAttribute('checked', 'checked');
            ctx.setAttribute('aria-checked', true);
          }
        });
        $(ctx).on('swipeleft', function() {
          var checkbox = ctx.querySelector('input');
          if (ctx.classList.contains('on')) {
            ctx.classList.remove('on');
            ctx.removeAttribute('aria-checked');
            checkbox.removeAttribute('checked');
          }
        });
        $(ctx).on('swiperight', function() {
          var checkbox = ctx.querySelector('input');
          if (!ctx.classList.contains('on')) {
            ctx.classList.add('on');
            checkbox.setAttribute('checked', 'checked');
            ctx.setAttribute('aria-checked', true);
          }
        });
        $(ctx).data('ui-setup', true);
      });
    }
  });

  $.extend({
    ////////////////////////
    // Create Switch Control
    ////////////////////////
    UICreateSwitch : function ( options ) {
      /* options = {
          id : '#myId',
          name: 'fruit.mango'
          state : 'on' || 'off' //(off is default),
          value : 'Mango' || '',
          callback : callback
        }
      */
      var id = options ? options.id : $.Uuid();
      var name = options && options.name ? (' name="' + options.name + '"') : '';
      var value= options && options.value ? (' value="' + options.value + '"') : '';
      var state = (options && options.state === 'on') ? (' ' + options.state) : '';
      var checked = (options && options.state === 'on') ? ' checked="checked"' : '';
      var _switch = $.concat('<span class="switch', state, 
        '" id="', id, '"><em></em>','<input type="checkbox"',
        name, checked, value, '></span>');
      return $(_switch);
    }
  });

  $(function() {
    //////////////////////////
    // Handle Existing Switches:
    //////////////////////////
    $('.switch').UISwitch();
  });
})(window.jQuery); 