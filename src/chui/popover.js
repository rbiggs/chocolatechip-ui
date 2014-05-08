(function($) {
  'use strict';
  
  $.fn.extend({ 
    /////////////////
    // Create Popover
    /////////////////
    /*
      id: myUniqueID,
      title: 'Great',
      callback: myCallback
    */
    UIPopover : function ( options ) {
      if (!options) return [];
      var triggerEl = $(this);
      var triggerID;
      if (this[0].id) {
        triggerID = this[0].id;
      } else {
        triggerID = $.Uuid();
        triggerEl.attr('id', triggerID);
      }
      var id = options.id ? options.id : $.Uuid();
      var header = options.title ? ('<header><h1>' + options.title + '</h1></header>') : '';
      var callback = options.callback ? options.callback : $.noop;
      var popover = '<div class="popover" id="' + id + '">' + header + '<section></section></div>';
    
      // Calculate position of popover relative to the button that opened it:
      var _calcPopPos = function (element) {
        var offset = $(element).offset();
        var left = offset.left;
        var calcLeft;
        var calcTop;
        var popover = $('.popover');
        var popoverOffset = popover.offset();
        calcLeft = popoverOffset.left;
        calcTop = offset.top + $(element)[0].clientHeight;
        if ((popover.width() + offset.left) > window.innerWidth) {
          popover.css({
            'left': ((window.innerWidth - popover.width())-20) + 'px',
            'top': (calcTop + 20) + 'px'
          });
        } else {
          popover.css({'left': left + 'px', 'top': (calcTop + 20) + 'px'});
        }
      };

      $(this).on($.eventStart, function() {
        if ($('.mask')[0]) {
          $.UIPopoverClose();
          $('body').UIUnblock();
          return;
        }
        var $this = this;
        $(this).addClass('selected');
        setTimeout(function() {
          $($this).removeClass('selected');
        }, 1000);
        $('body').append(popover);
        $('.popover').UIBlock('.5');
        var event = 'singletap';
        if ($.isWin && $.isDesktop) {
          event = $.eventStart + ' singletap ' + $.eventEnd;
        }
        $('.mask').on(event, function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
        $('.popover').data('triggerEl', triggerID);
        if ($.isWin) {
          _calcPopPos($this);
          $('.popover').addClass('open');
        } else {
          $('.popover').addClass('open');
          setTimeout(function () {
             _calcPopPos($this);
          });
        }
        callback.call(callback, $this);
      });
    }
  });

  $.extend({
    ///////////////////////////////////////
    // Align the Popover Before Showing it:
    ///////////////////////////////////////
    UIAlignPopover : function () {
      var popover = $('.popover');
      if (!popover.length) return;
      var triggerID = popover.data('triggerEl');
      var offset = $('#'+triggerID).offset();
      var left = offset.left;
      if (($(popover).width() + offset.left) > window.innerWidth) {
        popover.css({
          'left': ((window.innerWidth - $(popover).width())-20) + 'px'
        });
      } else {
        popover.css({'left': left + 'px'});
      }
    }
  });

  $.extend({
    UIPopoverClose : function ( ) {
      $('body').UIUnblock();
      $('.popover').css('visibility','hidden');
      setTimeout(function() {
        $('.popover').remove();
      },10);
    }
  });
  $(function() {
    /////////////////////////////////////////////////
    // Reposition popovers on window resize:
    /////////////////////////////////////////////////
    $(window).on('resize', function() {
      $.UIAlignPopover();
    });
    var events = $.eventStart + ' singletap ' + $.eventEnd;
    $('body').on(events, '.mask', function(e) {
      if (!$('.popover')[0]) {
        if (e && e.nodeType === 1) return;
        e.stopPropogation();
      } else {
        $.UIPopoverClose();
      }
    });
  });
})(window.jQuery);