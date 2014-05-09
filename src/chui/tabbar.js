(function($) {
  'use strict';

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
      $('body').addClass('hasTabBar');
      if ($.isiOS6) $('body').addClass('isiOS6');
      var id = options.id || $.Uuid();
      var selected = options.selected || '';
      var tabbar = '<div class="tabbar" id="' + id + '">';
      var icon = ($.isiOS || $.isSafari) ? '<span class="icon"></span>' : '';
      for (var i = 0; i < options.tabs; i++) {
        tabbar += '<a class="button ' + options.icons[i];
        if (selected === i+1) {
          tabbar += ' selected';
        }
        tabbar += '">' + icon + '<label>' + options.labels[i] + '</label></a>';
      }
      tabbar += '</div>';
      $('body').append(tabbar);
      $('nav').removeClass('current').addClass('next');
      $('#global-nav').removeClass('next');
      $('nav').eq(selected).removeClass('next').addClass('current');
      $('article').removeClass('current').addClass('next');
      $('article').eq(selected-1).removeClass('next').addClass('current');
      $('body').find('.tabbar').on('singletap', '.button', function() {
        var $this = this;
        var index;
        var id;
        $.publish('chui/navigate/leave', $('article.current')[0].id);
        $this.classList.add('selected');
        $(this).siblings('a').removeClass('selected');
        index = $(this).index();
        $('article.previous').removeClass('previous').addClass('next');
        $('nav.previous').removeClass('previous').addClass('next');
        $('article.current').removeClass('current').addClass('next');
        $('nav.current').removeClass('current').addClass('next');
        id = $('article').eq(index)[0].id;
        $.publish('chui/navigate/enter', id);
        $('article').each(function(idx, ctx) {
          $(ctx).scrollTop(0);
        });
      
        $.UISetHashOnUrl('#'+id);
        if ($.UINavigationHistory[0] === ('#' + id)) {
          $.UINavigationHistory = [$.UINavigationHistory[0]];
        } else if ($.UINavigationHistory.length === 1) {
          if ($.UINavigationHistory[0] !== ('#' + id)) {
            $.UINavigationHistory.push('#'+id);
          }
        } else if($.UINavigationHistory.length === 3) {
          $.UINavigationHistory.pop();
        } else {
          $.UINavigationHistory[1] = '#'+id;
        }
        $('article').eq(index).removeClass('next').addClass('current');
        $('nav').eq(index+1).removeClass('next').addClass('current');
      });
    }
  });
})(window.jQuery);