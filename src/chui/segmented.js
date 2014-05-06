(function($) {
  'use strict';
 
  $.fn.extend({
    ///////////////////////////////
    // Initialize Segmented Control
    ///////////////////////////////
    UISegmented : function ( options ) {
      /*
        var options = {
          selected: 0,
          callback: function() { alert('Boring!'); }
        }
      */
      if (this.hasClass('paging')) return;
      var callback = (options && options.callback) ? options.callback : $.noop;
      var selected;
      if (options && options.selected >= 0) selected = options.selected;
      this.find('a').each(function(idx, ctx) {
        $(ctx).find('a').attr('role','radio');
        if (idx === selected) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
        }
      });
      this.on('singletap', '.button', function(e) {
        var $this = $(this);
        if (this.parentNode.classList.contains('paging')) return;
        $this.siblings('a').removeClass('selected');
        $this.siblings('a').removeAttr('aria-checked');
        $this.addClass('selected');
        $this.attr('aria-checked', true);
        callback.call(this, e);
      });
    }
  });

  $.extend({ 
    ///////////////////////////
    // Create Segmented Control
    ///////////////////////////
    UICreateSegmented : function ( options ) {
      /* 
        options = {
          id : '#myId',
          className : 'special' || '',
          labels : ['first','second','third']
        }
      */
      var segmented;
      var id = (options && options.id) ? options.id : $.Uuid();
      var className = (options && options.className) ? options.className : '';
      var labels = (options && options.labels) ? options.labels : [];
      var selected = (options && options.selected) ? options.selected : 0;
      var _segmented = ['<div class="segmented'];
      if (className) _segmented.push(' ' + className);
      _segmented.push('">');
      labels.forEach(function(ctx, idx) {
        _segmented.push('<a role="radio" class="button');
        _segmented.push('"');
        _segmented.push('>');
        _segmented.push(ctx);
        _segmented.push('</a>');
      });
      _segmented.push('</div>');
      segmented = $(_segmented.join(''));
      segmented.attr('id', id);
      return segmented;
    }
  });
})(window.jQuery);