(function($) {
  "use strict";
  $.extend({
    ///////////////////////////////////////////
    // Creates a Tab Bar for Toggling Articles:
    ///////////////////////////////////////////
    UITabbar : function ( options ) {
      /*
      var options = {
        id: 'mySpecialTabbar',
        tabs: 4,
        labels: ["Refresh", "Add", "Info", "Downloads", "Favorite"],
        icons: ["refresh", "add", "info", "downloads", "favorite"],
        selected: 2
      }
      */
      if (!options) return;
      var settings = {
        id : $.Uuid(),
        selected : 0
      };
      $.extend(settings, options);
      $('body').addClass('hasTabBar');
      if ($.isiOS6) $('body').addClass('isiOS6');
      var tabbar = '<div class="tabbar" id="' + settings.id + '">';
      var icon = ($.isiOS || $.isSafari) ? '<span class="icon"></span>' : '';
      var articles = $('article');
      for (var i = 0; i < settings.tabs; i++) {
        tabbar += '<button class="' + settings.icons[i];
        if (settings.selected === i+1) {
          tabbar += ' selected';
        }
        tabbar += '">' + icon + '<label>' + settings.labels[i] + '</label></button>';
      }
      tabbar += '</div>';
      $('body').append(tabbar);

      //////////////////////////////////////////////////////
      // Add article id as history data attribute to button:
      //////////////////////////////////////////////////////
      $('#' + settings.id).find('button').forEach(function(ctx, idx){
        $(ctx).data('history', ['#' + articles.eq(idx)[0].id]);
      });
      $('nav').removeClass('current').addClass('next');
      $('#global-nav').removeClass('next');
      $('nav').eq(settings.selected).removeClass('next').addClass('current');
      $('article').removeClass('current').addClass('next');
      $('article').eq(settings.selected-1).removeClass('next').addClass('current');

      // Setup events on tabs:
      var tabButtonTap = 'singletap';
      if ($.isAndroid) {
        tabButtonTap = $.eventStart;
      }
      $('.tabbar').on(tabButtonTap, 'button', function() {
        var $this = this;
        var index;
        var id;
        $.publish('chui/navigate/leave', $('article.current')[0].id);

        //////////////////////////////////////////////////
        // Set the data attribute for the current history:
        //////////////////////////////////////////////////

        $this.classList.add('selected');
        $($this).siblings('button').removeClass('selected');
        index = $(this).index();
        $('article.previous').removeClass('previous').addClass('next');
        $('nav.previous').removeClass('previous').addClass('next');

        /////////////////////////////////////////////////////////////////
        // Update the history array with the current tabs stored history:
        /////////////////////////////////////////////////////////////////
        var history = $(this).data('history');

        ///////////////////////////////////////////////
        // If the history array has more than one item, 
        // we know that it is a navigation link.
        ///////////////////////////////////////////////
        if (history.length > 1) {
          $('article.current').removeClass('current').addClass('next');
          $('nav.current').removeClass('current').addClass('next');

          /////////////////////////////////////////////////
          // Set saved state of navigation list to current:
          /////////////////////////////////////////////////
          $(history[history.length-1]).removeClass('next').addClass('current');
          $(history[history.length-1]).prev().removeClass('next').addClass('current');

          ////////////////////////////////////////////////////
          // Set state for earlier screens of navigation list:
          ////////////////////////////////////////////////////
          var prevScreens = history.length-1;
          for (var i = 0; i < prevScreens; i++) {
            $(history[i]).removeClass('next').addClass('previous');
            $(history[i]).prev().removeClass('next').addClass('previous');
          }

        ////////////////////////////////////////////////
        // Otherwise, since the array has only one item, 
        // we are dealing with a single tabbar panel.
        ////////////////////////////////////////////////
        } else {
          $('article.current').removeClass('current').addClass('next');
          $('nav.current').removeClass('current').addClass('next');
          $('article').eq(index).removeClass('next').addClass('current');
          $('nav').eq(index+1).removeClass('next').addClass('current');
        }

        id = $('article').eq(index)[0].id;
        $.publish('chui/navigate/enter', id);

        // Set the chosen tab article's scroll to top:
        //============================================
        $('article').forEach(function(ctx) {
          if (window.jQuery) {
            $(ctx).scrollTop(0);
          } else if (window.$chocolatechipjs) {
            ctx.scrollTop = 0;
          }
        });
        $.UISetHashOnUrl('#'+id);
        $.UINavigationHistory = $(this).data('history');
      });
    }
  });
})(window.$);