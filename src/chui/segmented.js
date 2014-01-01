(function($) {
  'use strict';
 
  $.fn.extend({
    ///////////////////////////////
    // Initialize Segmented Control
    ///////////////////////////////
    UISegmented : function ( options ) {
      if (this.hasClass('paging')) return;
      var callback = (options && options.callback) ? options.callback : $.noop;
      var selected;
      if (options && options.selected) selected = options.selected;
      if (options && options.callback) {
        callback = options.callback;
      }
      this.find('a').each(function(idx, ctx) {
        $(ctx).find('a').attr('role','radio');
        if (selected === 0 && idx === 0) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
        }
        if (idx === selected) {
          ctx.setAttribute('aria-checked', 'true');
          ctx.classList.add('selected');
        }
      });
      if (!selected) {
        if (!this.find('.selected')[0]) {
          this.children().eq(0).addClass('selected');
        }
      }
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
          labels : ['first','second','third'],
          selected : 0 based number of selected button
        }
      */
      var className = (options && options.className) ? options.className : '';
      var labels = (options && options.labels) ? options.labels : [];
      var selected = (options && options.selected) ? options.selected : 0;
      var _segmented = ['<div class="segmented'];
      if (className) _segmented.push(' ' + className);
      _segmented.push('">');
      labels.forEach(function(ctx, idx) {
        _segmented.push('<a role="radio" class="button');
        if (selected === idx) {
          _segmented.push(' selected" aria-checked="true"');
        } else {
          _segmented.push('"');
        }
        _segmented.push('>');
        _segmented.push(ctx);
        _segmented.push('</a>');
      });
      _segmented.push('</div>');
      return _segmented.join('');
    }
  });

  $(function() {
    /////////////////////////////////////
    // Handle Existing Segmented Buttons:
    /////////////////////////////////////
    $('.segmented').UISegmented();
  });
})(window.jQuery);