(function($) {
  "use strict";
  $.fn.extend({
    ////////////////////////////
    // Initialize Switch Control
    ////////////////////////////
    UISwitch : function ( ) {
      var hasThumb = false;
      // Abrstract swipe for left-to-right and right-to-left:
      var swipeOn = "swiperight";
      var swipeOff = "swipeleft"
      if (document.documentElement.dir === "rtl") {
        swipeOn = "swipeleft";
        swipeOff = "swiperight";
      }
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
        $(ctx).on(swipeOn, function() {
          var checkbox = ctx.querySelector('input');
          if (ctx.classList.contains('on')) {
            ctx.classList.remove('on');
            ctx.removeAttribute('aria-checked');
            checkbox.removeAttribute('checked');
          }
        });
        $(ctx).on(swipeOff, function() {
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
          checked: 'on' || '',
          style: 'traditional' || '',
          callback : callback
        }
      */
      var settings = {
        id: $.Uuid(),
        name: '',
        value: '',
        state: '',
        checked: '',
        style: ''
      };
      $.extend(settings, options);
      if (settings.state === 'off') settings.state = '';
      var _switch = $.concat('<span class="switch', " ", settings.style, " ", settings.state, 
        '" id="', settings.id, '"><em></em>','<input type="checkbox"',
        settings.name, settings.checked, ' value="', settings.value, '"></span>');
      return $(_switch);
    }
  });
  $(function() {
    //////////////////////////
    // Handle Existing Switches:
    //////////////////////////
    $('.switch').UISwitch();
  });
})(window.$);