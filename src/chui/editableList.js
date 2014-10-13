(function($) {
  "use strict";
  $.fn.extend({
    ////////////////////////////
    // Initialize Editable List,
    // allows moving items and
    // deleting them.
    ////////////////////////////
    UIEditList : function ( options ) {
      /*
        options = {
          editLabel : labelName,
          doneLabel : labelName,
          deleteLabel : labelName,
          callback : callback (Tapping "Done" fires this),
          deletable: false (no deletables),
          movable: false (no movables)
        }
      */
      var settings = {
        editLabel : 'Edit',
        doneLabel : 'Done',
        deleteLabel : 'Delete',
        callback : $.noop,
        deletable: true,
        movable: true
      };
      if (!options) {
        return;
      }
      $.extend(settings, options);

      if (!settings.deletable && !settings.movable) {
        return;
      }

      var editLabel = settings.editLabel;
      var doneLabel = settings.doneLabel;
      var deleteLabel = settings.deleteLabel;
      var placement = settings.placement;
      var callback = settings.callback;

      var deleteButton;
      var editButton;
      var deletionIndicator;
      var button;
      var dispelDeletable = 'swiperight';
      var enableDeletable = 'swipeleft';
      var moveUpIndicator;
      var moveDownIndicator;
      var dir = $('html').attr('dir');
      dir = dir ? dir.toLowerCase() : '';
      if (dir === 'rtl') {
        dispelDeletable = 'swipeleft';
        enableDeletable = 'swiperight';
      }
      // Windows uses an icon for the delete button:
      if ($.isWin) deleteLabel = '';
      var height = $('li').eq(0)[0].clientHeight;

      if (settings.deletable) {
        deleteButton = $.concat('<button class="delete"><label>', deleteLabel, '</label></button');
        deletionIndicator = '<span class="deletion-indicator"></span>';
        $(this).addClass('deletable');
      }
      if (settings.movable) {
        var moveUpIndicator = "<span class='move-up'></span>";
        var moveDownIndicator = "<span class='move-down'></span>";
        $(this).addClass('editable');
      }
      editButton = $.concat('<button class="edit">', editLabel, '</button');
      if (!$(this).closest('article').prev().find('.edit')[0] && !$(this).closest('article').prev().find('.done')[0]) {
        $(this).closest('article').prev().append(editButton);
      }

      button = $(this).closest('article').prev().find('.edit');
      $(this).find('li').forEach(function(ctx) {
        if (!$(ctx).has('.deletion-indicator').length) {
          if (settings.deletable) {
            $(ctx).prepend(deletionIndicator);
          }
          if (settings.movable) {
            $(ctx).append(moveUpIndicator);
            $(ctx).append(moveDownIndicator);
          }
          if (settings.deletable) {
            $(ctx).append(deleteButton);
          }
        }
      });

      var listData = [];
      this.find('li').forEach(function(ctx) {
        listData.push($(ctx).attr('data-ui-value'));
      });

      // Callback to setup indicator interactions:
      var setupDeletability = function(callback, list, button) {
        $(function() {
          button.on('singletap', function() {
            var $this = this;

            // When button is in "Edit" state:
            if (this.classList.contains('edit')) {
              setTimeout(function() {
                $this.classList.remove('edit');
                $this.classList.add('done');
                $($this).text(settings.doneLabel);
                $(list).addClass('showIndicators');
              });

            // When button is in "Done" state:
            } else if (this.classList.contains('done')) {
              // Execute callback if edit was performed:
              //========================================
              if ($(list).data('list-edit')) {
                callback.call(callback, $this);
              }
              setTimeout(function() {
                $this.classList.remove('done');
                $this.classList.add('edit');
                $($this).text(settings.editLabel);
                $(list).removeClass('showIndicators');
                $(list).find('li').removeClass('selected');
              });            
            }
          });

          // Handle deletion indicators:
          $(list).off('singletap', '.deletion-indicator');
          $(list).on('singletap', '.deletion-indicator', function() {
            if ($(this).parent('li').hazClass('selected').length) {
              $(this).parent('li').removeClass('selected');
              return;
            } else {
              $(this).parent('li').addClass('selected');
            }
          });
        
          // Handle swipe gestures:
          $(list).on(dispelDeletable, 'li', function() {
            // If no deletables, disable swipes:
            if (!settings.deletable) return;
            // Else reveal delete button:
            $(this).removeClass('selected');
          });
          
          $(list).on(enableDeletable, 'li', function() {
            // If no deletables, disable swipes:
            if (!settings.deletable) return;
            // Else reveal delete button:
            $(this).addClass('selected');
          });

          // Move list item up:
          $(list).on('singletap', '.move-up', function(e) {
            var item = $(this).closest('li');
            if ((window.$chocolatechipjs && item.is('li:first-child')[0]) || window.jQuery && item.is('li:first-child')) {
              return;
            } else {
              // Mark list as edited:
              $(list).data('list-edit', true);
              var clone = $(this).closest('li').clone();
              item.prev().before(clone);
              item.remove();
            }
          });

          // Move list item down:
          $(list).on('singletap', '.move-down', function(e) {
            var item = $(this).closest('li');
            if ((window.$chocolatechipjs && item.is('li:last-child')[0]) || window.jQuery && item.is('li:last-child')) {
              return;
            } else {
              // Mark list as edited:
              $(list).data('list-edit', true);
              var clone = $(this).closest('li').clone();
              item.next().after(clone);
              item.remove();
            }
          });

          // Handle deletion of list item:
          $(list).on('singletap', '.delete', function() {
            var $this = this;
            // Mark list as edited:
            $(list).data('list-edit', true);
            var direction = '-1200%';
            if ($('html').attr('dir') === 'rtl') direction = '1000%';
            $(this).siblings().css({'-webkit-transform': 'translate3d(' + direction + ',0,0)', '-webkit-transition': 'all 1s ease-out', 'transform': 'translate3d(' + direction + ',0,0)', 'transition': 'all 1s ease-out'});
            setTimeout(function() {
              $($this).parent().remove();
            }, 500);
          });
        });    
      };
      // Initialize the editable list:
      return setupDeletability(settings.callback, $(this), button);
    }

  });
})(window.$);