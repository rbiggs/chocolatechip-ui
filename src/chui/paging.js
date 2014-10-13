(function($) {
  "use strict";
  $.extend({
    ///////////////////////
    // Setup Paging Control
    ///////////////////////
    UIPaging : function ( ) {
      var currentArticle = $('.segmented.paging').closest('nav').next();
      if ($('.segmented.paging').hazClass('horizontal').length) {
        currentArticle.addClass('horizontal');
      } else if ($('.segmented.paging').hazClass('vertical').length) {
        currentArticle.addClass('vertical');
      }
      
      currentArticle.children().eq(0).addClass('current');
      currentArticle.children().eq(0).siblings().addClass('next');
      var sections = function() {
        return currentArticle.children().length;
      };
      var pageBack = function($this) {
        if (sections() === 1) return;
        $this.next().removeClass('selected');
        $this.addClass('selected');
        var currentSection;
        currentSection = $('section.current');
        if (currentSection.index() === 0)  {
          currentSection.removeClass('current');
          currentArticle.children().eq(sections() - 1).addClass('current').removeClass('next');
          currentArticle.children().eq(sections() - 1).siblings().removeClass('next').addClass('previous');
        } else {
          currentSection.removeClass('current').addClass('next');
          currentSection.prev().removeClass('previous').addClass('current');
        }
        setTimeout(function() {
          $this.removeClass('selected');
        }, 250);
      };
      var pageForward = function ($this) {
        if (sections() === 1) return;
        $this.prev().removeClass('selected');
        $this.addClass('selected');
        var currentSection;
        if ($this[0].classList.contains('disabled')) return;
        currentSection = $('section.current');
        if (currentSection.index() === sections() - 1) {
          // start again!
          currentSection.removeClass('current');
          currentArticle.children().eq(0).addClass('current').removeClass('previous');
          currentArticle.children().eq(0).siblings().removeClass('previous').addClass('next');
        } else {
          currentSection.removeClass('current').addClass('previous');
          currentSection.next().removeClass('next').addClass('current');
        }
        setTimeout(function() {
          $this.removeClass('selected');
        }, 250);
      };
      $('.segmented.paging').on($.eventStart, 'button:first-of-type', function() {
        pageBack($(this));
      });
      $('.segmented.paging').on($.eventStart, 'button:last-of-type', function() {
        pageForward($(this));
      });
      // Handle swipe gestures for paging:
      if ($('article.paging.horizontal')[0]) {
        $('article.paging').on('swiperight', function() {
          pageBack($('button:first-of-type'));
        });
        $('article.paging').on('swipeleft', function() {
          pageForward($('button:last-of-type'));
        });
      }
      if ($('article.paging.vertical')[0]) {
        $('article.paging').on('swipeup', function() {
          pageBack($('button:first-of-type'));
        });
        $('article.paging').on('swipeudown', function() {
          pageForward($('button:last-of-type'));
        });
      }
    }
  });
})(window.$);