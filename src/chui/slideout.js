(function($) {
  "use strict";
  $.extend({
    ////////////////////////////////////////////////
    // Create Slideout with toggle button.
    // Use $.UISlideout.populate to polate slideout.
    // See widget-factor.js for details.
    ////////////////////////////////////////////////
    /*
    var options = {
      dynamic: false,
      callback: $.noop
    };
    */
    UISlideout : function ( options ) {
      var settings = {
        dynamic: false,
        callback: $.noop
      }
      if (options && typeof options === "object") {
        $.extend(settings, options);
      }
      var slideoutButton = $("<button class='slide-out-button'></button>");
      var slideOut = '<div class="slide-out"><section></section></div>';
      var articles = $('article');
      $('body').append(slideOut);
      $('body').addClass('slide-out-app');
      $('article:first-of-type').addClass('show');
      $('article:first-of-type').prev().addClass('show');
      $('#global-nav').append(slideoutButton);
      $('.slide-out-button').on($.eventStart, function() {
        $('.slide-out').toggleClass('open');
        $(this).toggleClass('focused');
        // Slide-out was closed && navigable is current:
        if ($(".slide-out.open")[0] && $('.navigable').hazClass('current')[0]) {
          $('.back').prop('disabled', 'disabled');
          $('.back').attr('disabled', 'disabled');
        }
        // Slide-out was open && is not current:
        if ($(".slide-out.open")[0] && !$('.navigable').hazClass('current')[0]) {
          $('.back').removeAttr('disabled');
        }
        // Slide-out was open && navigable is current:
        if (!$(".slide-out.open")[0] && $('.navigable').hazClass('current')[0]) {
           $('.back').removeAttr('disabled');
        }
        // Slide-out was open && navigable is not current:
        if (!$(".slide-out.open")[0] && $('.navigable').hazntClass('current')[0]) {
          $('.back').removeAttr('disabled');
        }
      });
      if (!settings.dynamic) {
        $('.slide-out').on('singletap', 'li', function() {
          $.UINavigationHistory.splice(0,1);
          var $this = $(this);
          $this.addClass('selected');
          setTimeout(function() {
            $this.removeClass('selected');
          }, 500);
          var whichArticle = '#' + $(this).attr('data-show-article');
          $('.navigable').removeClass('previous').addClass('next');
          $('.navigable').prev().removeClass('previous').addClass('next');
          $('.navigable').removeClass('current').removeClass('previous').addClass('next');
          $('.navigable').prev().removeClass('current').removeClass('previous').addClass('next');
          $.UINavigationHistory[0] = whichArticle;
          $.UISetHashOnUrl(whichArticle);
          $.publish('chui/navigate/leave', $('article.show')[0].id);
          $.publish('chui/navigate/enter', whichArticle);
          $('.back').removeProp('disabled');
          if ($(whichArticle).hazClass('navigable')[0]) {
            $(whichArticle).removeClass('next').addClass('current');
            $(whichArticle).prev().removeClass('next').addClass('current');
          }
          if ($.isAndroid || $.isChrome) {
            setTimeout(function() {
            $('.slide-out').removeClass('open');
            articles.removeClass('show');
            articles.prev().removeClass('show');
            $(whichArticle).addClass('show');
            $(whichArticle).prev().addClass('show');
            $('.slide-out-button').removeClass('focused');
            }, 400);
          } else {
            $('.slide-out').removeClass('open');
            articles.removeClass('show');
            articles.prev().removeClass('show');
            $(whichArticle).addClass('show');
            $(whichArticle).prev().addClass('show');
            $('.slide-out-button').removeClass('focused');
          }
        });
      } else {
        $('.slide-out').on('singletap', 'li', function() {
          var $this = $(this);
          $this.addClass('selected');
          $('.slide-out').removeClass('open');
          $('.slide-out-button').removeClass('focused');
          setTimeout(function() {
            $this.removeClass('selected');
          }, 500);
          if ($.isAndroid || $.isChrome) {
            setTimeout(function() {
              settings.callback($this);
              $('.slide-out-button').removeClass('focused');
            }, 400);
          } else {
            settings.callback($this);
            $('.slide-out-button').removeClass('focused');
          }
        });
      }
    }
  });
  $.extend($.UISlideout, {
    /////////////////////////////////////////////////////////////////
    // Method to populate a slideout with actionable items.
    // The argument is an array of objects consisting of a key/value.
    // The key will be the id of the article to be shown.
    // The value is the title for the list item.
    // [{music:'Music'},{docs:'Documents'},{recipes:'Recipes'}]
    /////////////////////////////////////////////////////////////////
    populate: function( args ) {
      var slideout = $('.slide-out');
      if (!slideout[0]) return;
      if (!$.isArray(args)) {
        return;
      } else {
        slideout.find('section').append('<ul class="list"></ul>');
        var list = slideout.find('ul');
        args.forEach(function(ctx) {
          for (var key in ctx) {
            if (key === 'header') {
              list.append('<li class="slideout-header"><h2>'+ctx[key]+'</h2></li>');
            } else {
              list.append('<li data-show-article="' + key + '"><h3>' + ctx[key] + '</h3></li>');
            }
          }
        });
      }
    }
  });
})(window.$);
