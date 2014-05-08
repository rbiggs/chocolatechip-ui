(function($) {
  'use strict';

  $.extend({
    ///////////////
    // Create Popup
    ///////////////
    UIPopup : function( options ) {
      /*
      options {
        id: 'alertID',
        title: 'Alert',
        message: 'This is a message from me to you.',
        cancelButton: 'Cancel',
        continueButton: 'Go Ahead',
        callback: function() { // do nothing }
      }
      */
      if (!options) return;
      var id = options.id || $.Uuid();
      var title = options.title ? '<header><h1>' + options.title + '</h1></header>' : '';
      var message = options.message ? '<p role="note">' + options.message + '</p>' : '';
      var cancelButton = options.cancelButton ? '<a href="javascript:void(null)" class="button cancel" role="button">' + options.cancelButton + '</a>' : '';
      var continueButton = options.continueButton  ? '<a href="javascript:void(null)" class="button continue" role="button">' + options.continueButton + '</a>' : '';
      var callback = options.callback || $.noop;
      var padding = options.empty ? ' noTitle' : '';
      var panelOpen, panelClose;

      var popup = $.concat('<div class="popup closed', padding, '" role="alertdialog" id="', id, '"><div class="panel">', title, message, '</div><footer>', cancelButton, continueButton, '</footer>', panelClose, '</div>');
    
      $('body').append(popup);
      if (callback && continueButton) {
        $('.popup').find('.continue').on($.eventStart, function() {
          $('.popup').UIPopupClose();
          callback.call(callback);
        });
      }
    
      $.UICenterPopup();
      setTimeout(function() {
        $('body').find('.popup').removeClass('closed');
      }, 200);
      $('body').find('.popup').UIBlock('0.5');
      var events = $.eventStart + ' singletap ' + $.eventEnd;
      $('.mask').on(events, function(e) {
        e.stopPropagation();
      });
    },
    
    //////////////////////////////////////////
    // Center Popups When Orientation Changes:
    //////////////////////////////////////////
    UICenterPopup : function ( ) {
      var popup = $('.popup');
      if (!popup[0]) return;
      var tmpTop = ((window.innerHeight /2) + window.pageYOffset) - (popup[0].clientHeight /2) + 'px';
      var tmpLeft;
      if (window.innerWidth === 320) {
        tmpLeft = '10px';
      } else {
        tmpLeft = Math.floor((window.innerWidth - 318) /2) + 'px';
      }
      if ($.isWin) {
        popup.css({top: tmpTop}); 
      } else {
          popup.css({left: tmpLeft, top: tmpTop}); 
        }
    }
  });

  $.fn.extend({
    //////////////
    // Close Popup
    //////////////
    UIPopupClose : function ( ) {
      if (!this && !this.classList.contains('popup')) return;
      $(this).UIUnblock();
      $(this).remove();
    }
  });
  $(function() {
    //////////////////////////
    // Handle Closing Popups:
    //////////////////////////
    $('body').on($.eventStart, '.cancel', function() {
      if ($(this).closest('.popup')[0]) {
        $(this).closest('.popup').UIPopupClose();
      }
    });

    /////////////////////////////////////////////////
    // Reposition popups on window resize:
    /////////////////////////////////////////////////
    $(window).on('resize', function() {
      $.UICenterPopup();
    });
  });
})(window.jQuery);