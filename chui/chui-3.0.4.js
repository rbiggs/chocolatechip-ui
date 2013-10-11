/*
    pO\     
   6  /\
     /OO\
    /OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/    
 
ChocolateChip-UI
ChUI.ios.js
Copyright 2013 Sourcebits www.sourcebits.com
License: BSD
Version: 3.0.4
*/
      

var whichJavaScriptLibrary = window.$chocolatechip || window.jQuery;
(function($) {
   'use strict';

   $.extend($, {
      eventStart : null,
      eventEnd : null,
      eventMove : null,
      eventCancel : null,
      // Define min-length for gesture detection:
      gestureLength : 30 
   });
   
   if (window && window.jQuery && $ === window.jQuery) {
      $.extend($, {
         make : function ( string ) {
            return $(string);
         },

         concat : function ( args ) {
            if (args instanceof Array) {
               return args.join('');
            } else {
               args = Array.prototype.slice.apply(arguments);
               return String.prototype.concat.apply(args.join(''));
            }
         },

         templates : {},
          
         template : function ( tmpl, variable ) {
            var regex, delimiterOpen, delimiterClosed;
            variable = variable ? variable : 'data';
            regex = /\[\[=([\s\S]+?)\]\]/g;
            delimiterOpen = '[[';
            delimiterClosed = ']]'; 
            var template =  new Function(variable, 
               "var p=[];" + "p.push('" + tmpl
               .replace(/[\r\t\n]/g, " ")
               .split("'").join("\\'")
               .replace(regex,"',$1,'")
               .split(delimiterOpen).join("');")
               .split(delimiterClosed).join("p.push('") + "');" +
               "return p.join('');");
            return template;
         },
         isiPhone : /iphone/img.test(navigator.userAgent),
         isiPad : /ipad/img.test(navigator.userAgent),
         isiPod : /ipod/img.test(navigator.userAgent),
         isiOS : /ip(hone|od|ad)/img.test(navigator.userAgent),
         isAndroid : /android/img.test(navigator.userAgent),
         isWebOS : /webos/img.test(navigator.userAgent),
         isBlackberry : /blackberry/img.test(navigator.userAgent),
         isTouchEnabled : ('createTouch' in document),
         isOnline :  navigator.onLine,
         isStandalone : navigator.standalone,
         isiOS6 : navigator.userAgent.match(/OS 6/i),
         isiOS7 : navigator.userAgent.match(/OS 7/i),
         isWin : /trident/img.test(navigator.userAgent),
         isWinPhone : (/trident/img.test(navigator.userAgent) && /mobile/img.test(navigator.userAgent)),
         isIE10 : navigator.userAgent.match(/msie 10/i),
         isIE11 : navigator.userAgent.match(/msie 11/i),
         isWebkit : navigator.userAgent.match(/webkit/),
         isMobile : /mobile/img.test(navigator.userAgent),
         isDesktop : !(/mobile/img.test(navigator.userAgent)),
         isSafari : (!/Chrome/img.test(navigator.userAgent) && /Safari/img.test(navigator.userAgent)),
         isChrome : /chrome/i.test(navigator.userAgent)
      });
   }
   
   $.extend($, {
         
      UuidSeed : 0,

      Uuid : function() {
         $.UuidSeed++;
         var date = Date.now() + $.UuidSeed;
         return date.toString(36);
      },
      
      array : Array.prototype,

      ////////////////////////////////////////////////
      // Manage location.hash for client side routing:
      ////////////////////////////////////////////////
      UITrackHashNavigation : function ( url, delimeter ) {
         url = url || true;
         $.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1], delimeter);
      },

      /////////////////////////////////////////////////////
      // Set the hash according to where the user is going:
      /////////////////////////////////////////////////////
      UISetHashOnUrl : function ( url, delimiter ) {
         delimiter = delimiter || '#/';
         var hash;
         if (/^#/.test(url)) {
            hash = delimiter + (url.split('#')[1]);
         } else {
            hash = delimiter + url;
         }
         if ($.isAndroid) {
            if (/#/.test(url)) {
               url = url.split('#')[1];
            }
            if (/\//.test(url)) {
               url = url.split('/')[1];
            }
            window.location.hash = '#/' + url;
         } else {
            window.history.replaceState('Object', 'Title', hash);
         }
      },

      //////////////////////////////////////
      // Navigate Back to Non-linear Article
      //////////////////////////////////////
      UIGoBackToArticle : function ( articleID ) {
         var historyIndex = $.UINavigationHistory.indexOf(articleID);
         var currentArticle = $('article.current');
         var destination = $(articleID);
         var currentToolbar;
         var destinationToolbar;
         var prevArticles = $.UINavigationHistory.splice(historyIndex+1);
         if (prevArticles.length) {
            prevArticles.forEach(function(ctx) {
               $(ctx).removeClass('previous').addClass('next');
               $(ctx).prev().removeClass('previous').addClass('next');
            });
         }
         if (window && window.jQuery && $ === window.jQuery) {
            if (currentArticle.next().hasClass('toolbar')) {
               currentToolbar = currentArticle.next('toolbar');
            }
            if (destination.next().hasClass('toolbar')) {
               destinationToolbar = destination.next('toolbar');
            }
         } else {
            currentToolbar = currentArticle.next().hasClass('toolbar');
            destinationToolbar = destination.next().hasClass('toolbar');
            currentToolbar.removeClass('current').addClass('next');
            destinationToolbar.removeClass('previous').addClass('current');
         }
         destination.removeClass('previous').addClass('current');
         destination.prev().removeClass('previous').addClass('current');
         currentArticle.removeClass('current').addClass('next');
         currentArticle.prev().removeClass('current').addClass('next');
         $.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1]);
      },

      ////////////////////////////////////
      // Navigate Back to Previous Article
      ////////////////////////////////////
      UIGoBack : function () {
         var histLen = $.UINavigationHistory.length;
         var currentArticle = $('article.current');
         var destination = $($.UINavigationHistory[histLen-2]);
         var currentToolbar;
         var destinationToolbar;
         if (window && window.jQuery && $ === window.jQuery) {
            if (currentArticle.next().hasClass('toolbar')) {
               currentToolbar = currentArticle.next('toolbar');
            }
            if (destination.next().hasClass('toolbar')) {
               destinationToolbar = destination.next('toolbar');
            }
         } else {
            currentToolbar = currentArticle.next().hasClass('toolbar');
            destinationToolbar = destination.next().hasClass('toolbar');
            currentToolbar.removeClass('current').addClass('next');
            destinationToolbar.removeClass('previous').addClass('current');
         }

         destination.removeClass('previous').addClass('current');
         destination.prev().removeClass('previous').addClass('current');
         currentArticle.removeClass('current').addClass('next');
         currentArticle.prev().removeClass('current').addClass('next');
         $.UISetHashOnUrl($.UINavigationHistory[histLen-2]);
         if ($.UINavigationHistory[histLen-1] !== $.firstArticle[0].id) {
            $.UINavigationHistory.pop();
         }
      },

      isNavigating : false,
      
      ///////////////////////////////
      // Navigate to Specific Article
      ///////////////////////////////
      UIGoToArticle : function ( destination ) {
         if ($.isNavigating) return;
         $.isNavigating = true;
         var current = $('article.current');
         destination = $(destination);         
         var currentNav = current.prev();
         var destinationNav = destination.prev();
         var currentToolbar;
         var destinationToolbar;
         if (window && window.jQuery && $ === window.jQuery) {
            if (current.next().hasClass('toolbar')) {
               currentToolbar = current.next('toolbar');
            } else {
               currentToolbar = $();
            }
            if (destination.next().hasClass('toolbar')) {
               destinationToolbar = destination.next('toolbar');
            } else {
               destinationToolbar = $();
            }
         } else {
            currentToolbar = current.next().hasClass('toolbar');
            destinationToolbar = destination.next().hasClass('toolbar');
         }
         if (window && window.jQuery && $ === window.jQuery) {
            if (currentToolbar[0]) {
               currentToolbar.removeClass('current').addClass('previous');
               destination.removeClass('next').addClass('current');
               destinationToolbar.removeClass('next').addClass('current'); 
            } else {
               current.removeClass('current').addClass('previous');
               currentNav.removeClass('current').addClass('previous');
               destination.removeClass('next').addClass('current');
               destinationNav.removeClass('next').addClass('current');
            }
         } else {
            current.removeClass('current').addClass('previous');
            currentNav.removeClass('current').addClass('previous');
            currentToolbar.removeClass('current').addClass('previous');
            destination.removeClass('next').addClass('current');
            destinationNav.removeClass('next').addClass('current');
            destinationToolbar.removeClass('next').addClass('current');
         }
         $.UISetHashOnUrl(destination[0].id);
         setTimeout(function() {
            $.isNavigating = false;
         }, 500);
      },
      
      ////////////////////////////
      // Initialize Deletable List
      ////////////////////////////
      UIDeletable : function ( options ) {
         /*
            options = {
               list: selector,
               editLabel : labelName || Edit,
               doneLabel : labelName || Done,
               deleteLabel : labelName || Delete,
               placement: left || right,
               callback : callback
            }
         */
         if (!options || !options.list || !options instanceof Array) {
            return;
         }
         var list = $(options.list);
         var editLabel = options.editLabel || 'Edit';
         var doneLabel = options.doneLabel || 'Done';
         var deleteLabel = options.deleteLabel || 'Delete';
         var placement = options.placement || 'right';
         var callback = options.callback || $.noop;
         var deleteButton;
         var editButton;
         var deletionIndicator;
         // Windows uses an icon for the delete button:
         if ($.isWin) deleteLabel = '';
         var setupDeletability = function(callback) {
            var deleteSlide;
            if ($.isiOS) {
               deleteSlide = '100px';
            } else if ($.isAndroid) {
               deleteSlide = '140px';
            }
            $(function() {
               $.body.on('singletap', '.edit', function() {
                  var $this = this;
                  setTimeout(function() {
                     $this.classList.remove('edit');
                     $this.classList.add('done');
                     $($this).text(doneLabel);
                     $(list).addClass('showIndicators');
                  });
               });
               $.body.on('singletap', '.done', function() {
                  var $this = this;
                  setTimeout(function() {
                     $this.classList.remove('done');
                     $this.classList.add('edit');
                     $($this).text(editLabel);
                     $(list).removeClass('showIndicators');
                     $(list).find('li').removeClass('selected');
                  });
               });
               $.body.on('singletap', '.deletion-indicator', function() {
                  if ($(this).closest('li')[0].classList.contains('selected')) {
                     $(this).closest('li').removeClass('selected');
                     return;
                  } else {
                     $(this).closest('li').addClass('selected');
                  }
               });
               
               if ($.isiOS || $.isSafari) {
                  $(list).on('swiperight singletap', 'li', function() {
                     $(this).removeClass('selected');
                  });
               }
               $(list).on('singletap', '.delete', function() {
                  var $this = this;
                  $(this).siblings().css({'-webkit-transform': 'translate3d(-1000%,0,0)', '-webkit-transition': 'all 1s ease-out'});
                  setTimeout(function() {
                     callback.call(callback, $this);
                     $($this).parent().remove();
                  }, 500);
               });
            });         
         };
         if (list[0].classList.contains('deletable')) return;
            deleteButton = $.concat('<a href="javascript:void(null)" class="button delete">', deleteLabel, '</a>');
            editButton = $.concat('<a href="javascript:void(null)" class="button edit">', editLabel, '</a>');
            deletionIndicator = '<span class="deletion-indicator"></span>';
            if (placement === 'left') {
               list.closest('article').prev().prepend(editButton);
            } else {
               list.closest('article').prev().append(editButton);
               list.closest('article').prev().find('h1').addClass('buttonOnRight');
               list.closest('article').prev().find('.edit').addClass('align-flush');
            }
            list.find('li').prepend(deletionIndicator);
            list.find('li').append(deleteButton);
            var height = $('li').eq(1)[0].clientHeight;
            $('li').find('.delete').each(function(ctx, idx) {
               if (window && window.jQuery && $ === window.jQuery) ctx = idx;
               if ($.isiOS || $.isSafari) $(ctx).css({height: height + 'px'});
            });
            setupDeletability(callback);
         
         list.addClass('deletable');
         return list;
      },
      
      ///////////////////////
      // Setup Paging Control
      ///////////////////////
      UIPaging : function ( ) {
         var currentArticle = $('.segmented.paging').closest('nav').next();
         if (window && window.jQuery && $ === window.jQuery) {
            if ($('.segmented.paging').hasClass('horizontal')) {
               currentArticle.addClass('horizontal');
            } else if ($('.segmented.paging').hasClass('vertical')) {
               currentArticle.addClass('vertical');
            }        
         } else {
            if ($('.segmented.paging').hasClass('horizontal')[0]) {
               currentArticle.addClass('horizontal');
            } else if ($('.segmented.paging').hasClass('vertical')[0]) {
               currentArticle.addClass('vertical');
            }
         }
         currentArticle.children().eq(0).addClass('current');
         currentArticle.children().eq(0).siblings().addClass('next');
         var sections = currentArticle.children().length;
         
         $('.segmented.paging').on($.eventStart, '.button:first-of-type', function() {
            $(this).next().removeClass('selected');
            $(this).addClass('selected');
            var currentSection;
            currentSection = $('section.current');
            if (currentSection.index() === 0) return;
            currentSection.removeClass('current').addClass('next');
            currentSection.prev().removeClass('previous').addClass('current');
         });
         $('.segmented.paging').on($.eventStart, '.button:last-of-type', function() {
            $(this).prev().removeClass('selected');
            $(this).addClass('selected');
            var currentSection;
            if (this.classList.contains('disabled')) return;
            currentSection = $('section.current');
            if (currentSection.index() === sections -1) return;
            currentSection.removeClass('current').addClass('previous');
            currentSection.next().removeClass('next').addClass('current');
         });
      },
      
      UISlideout : function ( position ) {
         $('article').removeClass('next');
         $('article').removeClass('current');
         $('article').prev().removeClass('next');
         $('article').prev().removeClass('current');
         position = position || 'left';
         var slideoutButton = $.make("<a class='button slide-out-button' href='javascript:void(null)'></a>");
         var slideOut = '<div class="slide-out"><section></section></div>';
         $.body.append(slideOut);
         $.body.addClass('slide-out-app');
         $('article:first-of-type').addClass('show');
         $('article:first-of-type').prev().addClass('show');
         $('#global-nav').append(slideoutButton);
         $('.slide-out-button').on($.eventStart, function() {
            $('.slide-out').toggleClass('open');
         });
         $('.slide-out').on('singletap', 'li', function() {
            var whichArticle = '#' + $(this).attr('data-show-article');
            $('.slide-out').removeClass('open');
            $('article').removeClass('show');
            $('article').prev().removeClass('show');
            $(whichArticle).addClass('show');
            $(whichArticle).prev().addClass('show');
         });
      },

      ///////////////////////////////////////////
      // Pass the id of the stepper to reset.
      // It's value will be reset to the default.
      ///////////////////////////////////////////
      // Pass it the id of the stepper:
      UIResetStepper : function ( stepper ) {
         var defaultValue = $(stepper).data('ui-value').defaultValue;
         $(stepper).find('label').html(defaultValue);
         $(stepper).find('input')[0].value = defaultValue;
      }
   });
   
   $.fn.extend({
   
      ////////////////////////////
      // Initialize Switch Control
      ////////////////////////////
      UISwitch : function ( ) {
         var hasThumb = false;
         this.each(function(ctx, idx) {
            if (window && window.jQuery && $ === window.jQuery) ctx = idx;
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
            $(ctx).on('swipeleft', function() {
               var checkbox = ctx.querySelector('input');
               if (ctx.classList.contains('on')) {
                  ctx.classList.remove('on');
                  ctx.removeAttribute('aria-checked');
                  checkbox.removeAttribute('checked');
               }
            });
            $(ctx).on('swiperight', function() {
               var checkbox = ctx.querySelector('input');
               if (!ctx.classList.contains('on')) {
                  ctx.classList.add('on');
                  checkbox.setAttribute('checked', 'checked');
                  ctx.setAttribute('aria-checked', true);
               }
            });
            $(ctx).data('ui-setup', true);
         });
      },
      
      ///////////////////////////////
      // Initialize Segmented Control
      ///////////////////////////////
      UISegmented : function ( options ) {
         if (window && window.jQuery && $ === window.jQuery) {
             if (this.hasClass('paging')) return;
         } else {
            if (this.hasClass('paging')[0]) return;
         }
         var callback = (options && options.callback) ? options.callback : $.noop;
         var selected;
         if (options && options.selected) selected = options.selected;
         if (options && options.callback) {
            callback = options.callback;
         }
         this.find('a').each(function(ctx, idx) {
            if (window && window.jQuery && $ === window.jQuery) ctx = idx;
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
      },
      
      ////////////////////////////////////////////
      // Allow Segmented Control to toggle panels
      ////////////////////////////////////////////
      UIPanelToggle : function ( panel, callback ) {
         var panels;
         var selected = 0;
         if (window && window.jQuery && $ === window.jQuery) {
            if ($(this).children().hasClass('selected')) {
               this.children().each(function(idx, ctx) {
                  if ($(ctx).hasClass('selected')) {
                     selected = idx;
                  }
               });
            }
         } else {
            if (this.children().hasClass('selected')[0]) {
               selected = this.children().hasClass('selected').index();
            }
         }

         if (panel instanceof Array) {
            panels = panel.children('div');
         } else if (typeof panel === 'string') {
            panels = $(panel).children('div');
         }
         panels.eq(selected).siblings().css({display: 'none'});
         if (callback) callback.apply(this, arguments);
         this.on($.eventEnd, 'a', function() {
            panels.eq($(this).index()).css({display:'block'})
               .siblings().css('display','none');
         });
         
         this.on('singletap', '.button', function() {
            var $this = $(this);
            if (this.parentNode.classList.contains('paging')) return;
            $this.siblings('a').removeClass('selected');
            $this.siblings('a').removeAttr('aria-checked');
            $this.addClass('selected');
            $this.attr('aria-checked', true);
         });
      },
       
      /////////////////////////
      // Initialize Select List 
      /////////////////////////
      /* 
      // For default selection use zero-based integer:
      options = {
         name : name // used on radio buttons as group name, defaults to uuid.
         selected : integer,
         callback : callback
         // callback example:
         function () {
            // this is the selected list item:
            console.log($(this).text());
         }
      }
      */
      UISelectList : function (options) {
         var name = (options && options.name) ? options.name : $.Uuid(); 
         var list = this[0];
         if (window && window.jQuery && $ === window.jQuery) {
            if (list && !$(list).hasClass('select')) {
               this.addClass('select');
            }
         } else {
            if (list && !$(list).hasClass('select')[0]) {
               this.addClass('select');
            }                  
         }
         if (!list) return [];
         list.classList.add('select');
         $(list).find('li').each(function(ctx, idx) {
            var temp;
            if (window && window.jQuery && $ === window.jQuery) {
               temp = ctx;
               ctx = idx;
               idx = temp;
            }
            ctx.setAttribute('role', 'radio');
            if (options && options.selected === idx) {
               ctx.setAttribute('aria-checked', 'true');
               ctx.classList.add('selected');
               if (!$(ctx).find('input')[0]) {
                  $(ctx).append('<input type="radio" checked="checked" name="' + name + '">');
               } else {
                  $(ctx).find('input').attr('checked','checked');
               }
            } else {
               if (!$(ctx).find('input')[0]) {
                  $(ctx).append('<input type="radio" name="' + name + '">');
               }
            }
         });
         $(list).on('singletap', 'li', function() {
            var item = this;
            $(item).siblings('li').removeClass('selected');
            $(item).siblings('li').removeAttr('aria-checked');
            $(item).siblings('li').find('input').removeAttr('checked');
            $(item).addClass('selected');
            item.setAttribute('aria-checked', true);
            $(item).find('input').attr('checked','checked');
            if (options && options.callback) {
               options.callback.apply(this, arguments);
            }
         });
      },
      
      /////////////////
      // Create stepper
      /////////////////
      /*
         var options = {
            start: 0,
            end: 10,
            defaultValue: 3
         }
      */
      UIStepper : function (options) {
         if (!options) return [];
         if (!options.start) return [];
         if (!options.end) return [];
         var stepper = this[0];
         var start = options.start;
         var end = options.end;
         var defaultValue = options.defaultValue ? options.defaultValue : options.start;
         var increaseSymbol = '+';
         var decreaseSymbol = '-';
         if ($.isWin) {
             increaseSymbol = '';
             decreaseSymbol = '';
         }
         var decreaseButton = '<a href="javascript:void(null)" class="button decrease">' + decreaseSymbol + '</a>';
         var label = '<label>' + defaultValue + '</label><input type="text" value="' + defaultValue + '">';
         var increaseButton = '<a href="javascript:void(null)" class="button increase">' + increaseSymbol + '</a>';
         $(stepper).append(decreaseButton + label + increaseButton);
         $(stepper).data('ui-value', {start: start, end: end});
         
         var decreaseStepperValue = function() {
            var currentValue = $(stepper).find('input').val();
            var value = $(stepper).data('ui-value');
            var start = value.start;
            var newValue;
            if (currentValue <= start) {
               $(this).addClass('disabled');
            } else {
               newValue = Number(currentValue) - 1;
               $(stepper).find('.button:last-of-type').removeClass('disabled');
               $(stepper).find('label').text(newValue);
               $(stepper).find('input')[0].value = newValue;
               if (currentValue === start) {
                  $(this).addClass('disabled');
               }
            }  
         };
         
         var increaseStepperValue = function() {
            var currentValue = $(stepper).find('input').val();
            var value = $(stepper).data('ui-value');
            var end = value.end;
            var newValue;
            if (currentValue >= end) {
               $(this).addClass('disabled');
            } else {
               newValue = Number(currentValue) + 1;
               $(stepper).find('.button:first-of-type').removeClass('disabled');
               $(stepper).find('label').text(newValue);
               $(stepper).find('input')[0].value = newValue;
               if (currentValue === end) {
                  $(this).addClass('disabled');
               }
            }
         };
         var $stepper = (window && window.jQuery && $ === jQuery) ? $(stepper) : [stepper];
         $stepper.find('.button:first-of-type').on('singletap', function() {
            decreaseStepperValue.call(this, stepper);
         });
         $stepper.find('.button:last-of-type').on('singletap', function() {
            increaseStepperValue.call(this, stepper);
         });
      },
      
      ////////////////////////
      // Create Busy indicator
      ////////////////////////
      /*
         var options = {
            color: 'red',
            size: '80px',
            position: 'right'
         }
      */
      UIBusy : function ( options ) {
         options = options || {};
         var $this = this;
         var color = options.color || '#000';
         var size = options.size || '80px';
         var position = (options && options.position === 'right') ? 'align-flush' : null;
         var duration = options.duration || '1s';
         var spinner;
         // For iOS:
         var iOSBusy = function() {
            var webkitAnim = {'-webkit-animation-duration': duration};
            spinner = $.make('<span class="busy"></span>');
            $(spinner).css({'background-color': color, 'height': size, 'width': size});
            $(spinner).css(webkitAnim);
            $(spinner).attr('role','progressbar');
            if (position) $(spinner).addClass(position);
            $this.append(spinner);
            return this;
         };
         // For Android:
         var androidBusy = function() {
            var webkitAnim = {'-webkit-animation-duration': duration};
            spinner = $.make('<div class="busy"><div></div><div></div></div>');
            $(spinner).css({'height': size, 'width': size, "background-image":  'url(' + '"data:image/svg+xml;utf8,<svg xmlns:svg=' + "'http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' version='1.1' x='0px' y='0px' width='400px' height='400px' viewBox='0 0 400 400' enable-background='new 0 0 400 400' xml:space='preserve'><circle fill='none' stroke='" + color + "' stroke-width='20' stroke-miterlimit='10' cx='199' cy='199' r='174'/>" + '</svg>"' + ')'});
            $(spinner).css(webkitAnim);
            $(spinner).attr('role','progressbar');
            $(spinner).innerHTML = "<div></div><div></div>";
            if (position) $(spinner).addClass('align-' + position);
            $this.append(spinner);
            return this;
         };
         // For Windows 8/WP8:
         var winBusy = function() {
            spinner = $.make('<progress class="busy"></progress>');
            $(spinner).css({ 'color': color });
            $(spinner).attr('role','progressbar');
            $(spinner).addClass('win-ring');
            if (position) $(spinner).addClass('align-' + position);
            $this.append(spinner);
            return this;
         };
         // Create Busy control for appropriate OS:
         if ($.isiOS) {
            iOSBusy(options);
         } else if ($.isAndroid) {
            androidBusy(options);
         } else if ($.isWin) {
            winBusy(options);
         }
      },
      
      //////////////////////////////
      // Center an Element on Screen
      //////////////////////////////
      UICenter : function ( ) {
         if (!this[0]) return;
         var $this = $(this);
         var parent = $this.parent();
         var position;
         if ($this.css('position') !== 'absolute') position = 'relative';
         else position = 'absolute';
         
         var height, width, parentHeight, parentWidth;
         if (position === 'absolute') {
            height = $this[0].clientHeight;
            width = $this[0].clientWidth;
            parentHeight = parent[0].clientHeight;
            parentWidth = parent[0].clientWidth;
         } else {
            height = parseInt($this.css('height'),10);
            width = parseInt($this.css('width'),10);
            parentHeight = parseInt(parent.css('height'),10);
            parentWidth = parseInt(parent.css('width'),10);
         }
         var tmpTop, tmpLeft;
         if (parent[0].nodeName === 'body') {
            tmpTop = ((window.innerHeight /2) + window.pageYOffset) - height /2 + 'px';
            tmpLeft = ((window.innerWidth / 2) - (width / 2) + 'px');
         } else {
            tmpTop = (parentHeight /2) - (height /2) + 'px';
            tmpLeft = (parentWidth / 2) - (width / 2) + 'px';
         }
         if (position !== 'absolute') tmpLeft = 0;
        // if (parseInt(tmpLeft,10) <= 0) tmpLeft = '10px';
         $this.css({left: tmpLeft, top: tmpTop});
      },
      
      /////////////////////////
      // Block Screen with Mask
      /////////////////////////
      UIBlock : function ( opacity ) {
         opacity = opacity ? " style='opacity:" + opacity + "'" : " style='opacity: .5;'";
         $(this).before("<div class='mask'" + opacity + "></div>");
         $('article.current').attr('aria-hidden',true);
         return this;
      },
      
      //////////////////////////
      // Remove Mask from Screen
      //////////////////////////
      UIUnblock : function ( ) {
         $('.mask').remove();
         $('article.current').removeAttr('aria-hidden');
         return this;
      },
      
      //////////////
      // Close Popup
      //////////////
      UIPopupClose : function ( ) {
         if (!this[0].classList.contains('popup')) return;
         $(this).UIUnblock();
         $(this).remove();
      },
      
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
            var $this = this;
            $(this).addClass('selected');
            setTimeout(function() {
               $($this).removeClass('selected');
            }, 1000);
            $.body.append(popover);
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
   
   $.extend($, {
      ////////////////////////
      // Create Switch Control
      ////////////////////////
      UICreateSwitch : function ( options ) {
         /* options = {
               id : '#myId',
               name: 'fruit.mango'
               state : 'on' || 'off' //(off is default),
               value : 'Mango' || '',
               callback : callback
            }
         */
         var id = options ? options.id : $.Uuid();
         var name = options && options.name ? (' name="' + options.name + '"') : '';
         var value= options && options.value ? (' value="' + options.value + '"') : '';
         var state = (options && options.state === 'on') ? (' ' + options.state) : '';
         var checked = (options && options.state === 'on') ? ' checked="checked"' : '';
         var _switch = $.concat('<span class="switch', state, 
            '" id="', id, '"><em></em>','<input type="checkbox"',
            name, checked, value, '></span>');
         return $.make(_switch);
      },
      
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
      },
      
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
         var padding = options.empty ? ' style="padding: 40px 0;" ' : '';
         var panelOpen, panelClose;
         if (options.empty) {
            panelOpen = '';
            panelClose = '';
         } else {
            panelOpen = '<div class="panel">';
            panelClose = '</div>';
         }
         var popup = '<div class="popup closed" role="alertdialog" id="' + id + '"' + padding + '>' + panelOpen + title + message + '<footer>' + cancelButton + continueButton + '</footer>' + panelClose + '</div>';
         
         $.body.append(popup);
         if (callback && continueButton) {
            $('.popup').find('.continue').on($.eventStart, function() {
               $('.popup').UIPopupClose();
               callback.call(callback);
            });
         }
         
         $.UICenterPopup();
         setTimeout(function() {
            $.body.find('.popup').removeClass('closed');
         }, 200);
         $.body.find('.popup').UIBlock('0.5');
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
      },
      
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
      },
      
      UIPopoverClose : function ( ) {
         $.body.UIUnblock();
         $('.popover').css('visibility','hidden');
         setTimeout(function() {
            $('.popover').remove();
         },10);
      },
   
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
         $.body.addClass('hasTabBar');
         if ($.isiOS6) $.body.addClass('isiOS6');
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
         $.body.append(tabbar);
         $('nav').removeClass('current').addClass('next');
         $('nav').eq(selected).removeClass('next').addClass('current');
         $('article').removeClass('current').addClass('next');
         $('article').eq(selected-1).removeClass('next').addClass('current');
         $.body.find('.tabbar').on('singletap', '.button', function() {
         var $this = this;
         var index;
            var id;
            $this.classList.add('selected');
            $(this).siblings('a').removeClass('selected');
            index = $(this).index();
            $('.previous').removeClass('previous').addClass('next');
            $('.current').removeClass('current').addClass('next');
            id = $('article').eq(index)[0].id;
            $.UISetHashOnUrl('#'+id);
            if ($.UINavigationHistory[0] === ('#' + id)) {
               $.UINavigationHistory = [$.UINavigationHistory[0]];
               console.log('You clicked main: ' + $.UINavigationHistory);
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
      },
      
      ///////////////////////////////////////////////
      // UISheet: Create an Overlay for Buttons, etc.
      ///////////////////////////////////////////////
      /*
         var options {
            id : 'starTrek',
            listClass :'enterprise',
            background: 'transparent',
         }
      */
      UISheet : function ( options ) {
         var id = $.Uuid();
         var listClass = '';
         var background = '';
         if (options) {
            id = options.id ? options.id : id;
            listClass = options.listClass ? ' ' + options.listClass : '';
            background = ' style="background-color:' + options.background + ';" ' || '';
         }
         var sheet = '<div id="' + id + '" class="sheet' + listClass + '"><div class="handle"></div><section class="scroller-vertical"></section></div>';
         $.body.append(sheet);
         $('.sheet .handle').on($.eventStart, function() {
            $.UIHideSheet();
         });
      },
      
      UIShowSheet : function ( ) {
         $('article.current').addClass('blurred');
         if ($.isAndroid || $.isChrome) {
            $('.sheet').css('display','block');
           setTimeout(function() {
               $('.sheet').addClass('opened');
            }, 20);
         } else {
            $('.sheet').addClass('opened');
         }
      },
      
      UIHideSheet : function ( ) {
         $('.sheet').removeClass('opened');
         $('article.current').addClass('removeBlurSlow'); 
         setTimeout(function() {
            $('article').removeClass('blurred');
            $('article').removeClass('removeBlurSlow'); 
         },500);   
      },
      
      UIDesktopCompat : function ( ) {
         if ($.isDesktop && $.isSafari) {
            $.body.addClass('isiOS').addClass('isDesktopSafari');
         } else if ($.isDesktop && $.isChrome) {
            $.body.addClass('isAndroid').addClass('isDesktopChrome');
         }
      }
      
   });
               
   //////////////////////////
   // Setup Event Variables:
   //////////////////////////
   $(function() {
      // Pointer events for Win8 and WP8:
      if (window.navigator.msPointerEnabled) {
         $.eventStart = 'MSPointerDown';
         $.eventEnd = 'MSPointerUp';
         $.eventMove = 'MSPointerMove';
         $.eventCancel = 'MSPointerCancel';
      // Touch events for iOS & Android:
      } else if ('ontouchstart' in window) {
         $.eventStart = 'touchstart';
         $.eventEnd = 'touchend';
         $.eventMove = 'touchmove';
         $.eventCancel = 'touchcancel';
      // Mouse events for desktop:
      } else {
         $.eventStart = 'mousedown';
         $.eventEnd = 'click';
         $.eventMove = 'mousemove';
         $.eventCancel = 'mouseout';
      }
      
      $.body = $('body');
      
      $.firstArticle = $('article').eq(0);
      
      if ((/android/img.test(navigator.userAgent)) && (/webkit/img.test(navigator.userAgent) ) && (!/Chrome/img.test(navigator.userAgent))) {
         document.body.classList.add('isNativeAndroidBrowser');
      }
      
      /////////////////////////////////////////////////////////
      // Stop rubber banding when dragging down on nav:
      /////////////////////////////////////////////////////////
      $('nav').on($.eventStart, function(e) {
         e.preventDefault();
      });
      
      //////////////////////////////////////////
      // Set first value for navigation history:
      //////////////////////////////////////////
      $.extend($, {
         UINavigationHistory : ["#" + $('article').eq(0).attr('id')],
      });
      
      ///////////////////////////////////////////////////////////
      // Make sure that navs and articles have navigation states:
      ///////////////////////////////////////////////////////////
      $('nav').each(function(ctx, idx) {
         var temp;
         if (window && window.jQuery && $ === window.jQuery) {
            temp = ctx;
            ctx = idx;
            idx = temp;
         }
         // Prevent if splitlayout for tablets:
         if ($.body[0].classList.contains('splitlayout')) return;
         if (idx === 0) {
            ctx.classList.add('current');
         } else { 
            ctx.classList.add('next'); 
         }
      });
      $('article').each(function(ctx, idx) {
         var temp;
         if (window && window.jQuery && $ === window.jQuery) {
            temp = ctx;
            ctx = idx;
            idx = temp;
         }
         // Prevent if splitlayout for tablets:
         if ($.body[0].classList.contains('splitlayout')) return;
         if ($.body[0].classList.contains('slide-out-app')) {
            return;
         }
         if (idx === 0) {
            ctx.classList.add('current');
         } else { 
            ctx.classList.add('next'); 
         }
      });
      
      //////////////////////
      // Add the global nav:
      //////////////////////
      
      if (!$.body[0].classList.contains('splitlayout')) {
         $.body.prepend("<nav id='global-nav'></nav>");
      }
      
      ///////////////////////////
      // Initialize Back Buttons:
      ///////////////////////////
      $.body.on('singletap', 'a.back', function() {
         if (this.classList.contains('back')) {
            $.UIGoBack();
         }
      });
      $.body.on('singletap', '.button', function() {
         var $this = $(this);
         if ($this.parent()[0].classList.contains('tabbar')) return;
         $this.addClass('selected');
         setTimeout(function() {
            $this.removeClass('selected');
         }, 500);
         if (this.classList.contains('show-popover')) {
            $this.addClass('selected');
            setTimeout(function() {
               $this.removeClass('selected');
            },500);
         }
      });
      
      ////////////////////////////////
      // Handle navigation list items:
      ////////////////////////////////
      $.body.on('singletap doubletap', 'li', function() {
         if ($.isNavigating) return;
         if (!this.hasAttribute('data-goto')) return;
         if (!this.getAttribute('data-goto')) return;
         if (!document.getElementById(this.getAttribute('data-goto'))) return;
         var destinationHref = '#' + this.getAttribute('data-goto');
         $(destinationHref).addClass('navigable');
         var destination = $(destinationHref);
         $.UIGoToArticle(destination);
         $.UINavigationHistory.push(destinationHref);
      });
      $('li[data-goto]').each(function(ctx, idx) {
         if (window && window.jQuery && $ === window.jQuery) ctx = idx;
         $(ctx).closest('article').addClass('navigable');
         var navigable =  '#' + ctx.getAttribute('data-goto');
         $(navigable).addClass('navigable');
      });
      
      /////////////////////////////////////
      // Init navigation url hash tracking:
      /////////////////////////////////////
      // If there's more than one article:
      if ($('article').eq(1)[0]) {
         $.UISetHashOnUrl($('article').eq(0)[0].id);
      }
      
      /////////////////////////////////////
      // Handle Existing Segmented Buttons:
      /////////////////////////////////////
      $('.segmented').UISegmented();
      
      //////////////////////////
      // Handle Existing Switches:
      //////////////////////////
      $('.switch').UISwitch();
      
      //////////////////////////
      // Handle Closing Popups:
      //////////////////////////
      $.body.on($.eventStart, '.cancel', function() {
         if ($(this).closest('.popup')[0]) {
            $(this).closest('.popup').UIPopupClose();
         }
      });
      
      /////////////////////////////////////////////////
      // Reposition popups & popovers on window resize:
      /////////////////////////////////////////////////
      window.onresize = function() {
         $.UICenterPopup();
         $.UIAlignPopover();
      };
      var events = $.eventStart + ' singletap ' + $.eventEnd;
      $.body.on(events, '.mask', function(e) {
         if (!$('.popover')[0]) {
            if (e && e.nodeType === 1) return;
            e.stopPropogation();
         } else {
            $.UIPopoverClose();
         }
      });
      
      /////////////////////////////////////////////////
      // Fix Split Layout to display properly on phone:
      /////////////////////////////////////////////////
      if ($.body[0].classList.contains('splitlayout')) {
         if (window.innerWidth < 768) {
            $('meta[name=viewport]').attr('content','width=device-width, initial-scale=0.45, maximum-scale=2, user-scalable=yes');
         }
      }
      
      /////////////////////////////////////////////////////////
      // Add class to nav when button on right.
      // This allows us to adjust the nav h1 for small screens.
      /////////////////////////////////////////////////////////
      $('h1').each(function(ctx, idx) {
         if (window && window.jQuery && $ === window.jQuery) ctx = idx;
         if (ctx.nextElementSibling && ctx.nextElementSibling.nodeName === 'A') {
            ctx.classList.add('buttonOnRight');
         }
      });
      
      //////////////////////////////////////////
      // Get any toolbars and adjust the bottom 
      // of their corresponding articles:
      //////////////////////////////////////////
      $('.toolbar').prev().addClass('has-toolbar');
      
      ////////////////////////////////
      // Added classes for client side
      // os-specific styles:
      ////////////////////////////////
      $.extend({
         browserVersion : function ( ) {
            var n = navigator.appName;
            var ua = navigator.userAgent;
            var temp;
            var m = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if (m && (temp = ua.match(/version\/([\.\d]+)/i))!= null) m[2]= temp[1];
            m = m ? [m[1], m[2]]: [n, navigator.appVersion, '-?'];
            return m[1];
         }
       });
       
      if ($.isAndroid) {
         $.body.addClass('isAndroid');
      } else if ($.isiOS) {
         $.body.addClass('isiOS');
      } else if ($.isWin) {
         $.body.addClass('isWindows');
      }
      if ($.isSafari && parseInt($.browserVersion(), 10) === 6) {
         $.body.addClass('isSafari6');
      }
      $.UIDesktopCompat();
   });
   
})(whichJavaScriptLibrary);

//////////////////////////////////////////////////////
// Swipe Gestures for ChocolateChip.
// Includes mouse gestures for desktop compatibility.
//////////////////////////////////////////////////////

(function($){
   'use strict';

   var touch = {};
   var touchTimeout;
   var swipeTimeout;
   var tapTimeout;
   var longTapDelay = 750;
   var singleTapDelay = 150;
   var longTapTimeout;
   
   function parentIfText(node) {
      return 'tagName' in node ? node : node.parentNode;
   }

   function swipeDirection(x1, x2, y1, y2) {
      var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
      return xDelta >= yDelta ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');
   }

   function longTap() {
      longTapTimeout = null;
      if (touch.last) {
         try {
            touch.el.trigger('longtap');
            touch = {};
         } catch(err) { }
      }
   }

   function cancelLongTap() {
      if (longTapTimeout) clearTimeout(longTapTimeout);
      longTapTimeout = null;
   }

   function cancelAll() {
      if (touchTimeout) clearTimeout(touchTimeout);
      if (tapTimeout) clearTimeout(tapTimeout);
      if (swipeTimeout) clearTimeout(swipeTimeout);
      if (longTapTimeout) clearTimeout(longTapTimeout);
      touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
      touch = {};
   }

   $(document).ready(function(){
      var now;
      var delta;
      var body = $(document.body);
      var twoTouches = false;
      body.on($.eventStart, function(e) {
         now = Date.now();
         delta = now - (touch.last || now);
         if (e.originalEvent) e = e.originalEvent;
         
         // Handle MSPointer Events:
         if (window.navigator.msPointerEnabled) {
            if (window && window.jQuery && $ === window.jQuery) {
               if (e.originalEvent && !e.originalEvent.isPrimary) return;
            } else {
               if (!e.isPrimary) return;
            }
            e = e.originalEvent ? e.originalEvent : e;
            body.on('MSHoldVisual', function (e) {
               e.preventDefault();
            });
               touch.el = $(parentIfText(e.target));
               touchTimeout && clearTimeout(touchTimeout);
               touch.x1 = e.pageX;
               touch.y1 = e.pageY;
               twoTouches = false;
         } else {
            if ($.eventStart === 'mousedown') {
               touch.el = $(parentIfText(e.target));
               touchTimeout && clearTimeout(touchTimeout);
               touch.x1 = e.pageX;
               touch.y1 = e.pageY;
               twoTouches = false;
            } else {
               // User to detect two or more finger gestures:
               if (e.touches.length === 2) {
                  console.log('two fingers'); 
               // One finger touch:
               } else if (e.touches.length === 1) {
                  touch.el = $(parentIfText(e.touches[0].target));
                  touchTimeout && clearTimeout(touchTimeout);
                  touch.x1 = e.touches[0].pageX;
                  touch.y1 = e.touches[0].pageY;
                  if (e.targetTouches.length === 2) {
                     twoTouches = true;
                  } else {
                     twoTouches = false;
                  }
               }
            }
         }
         if (delta > 0 && delta <= 250) {
            touch.isDoubleTap = true;
         }
         touch.last = now;
         longTapTimeout = setTimeout(longTap, longTapDelay);
      });
      body.on($.eventMove, function(e) {
         if (e.originalEvent) e = e.originalEvent;
         if (window.navigator.msPointerEnabled) {
            if (window && window.jQuery && $ === window.jQuery) {
               if (e.originalEvent && !e.originalEvent.isPrimary) return;
            } else {
               if (!e.isPrimary) return;
            }
            e = e.originalEvent ? e.originalEvent : e;
            cancelLongTap();
            touch.x2 = e.pageX;
            touch.y2 = e.pageY;
         } else {
            cancelLongTap();
            if ($.eventMove === 'mousemove') {
               touch.x2 = e.pageX;
               touch.y2 = e.pageY;
            } else {
               // One finger gesture:
               if (e.touches.length === 1) { 
                  touch.x2 = e.touches[0].pageX;
                  touch.y2 = e.touches[0].pageY;
               }
            }
         }
      });
      body.on($.eventEnd, function(e) {
         if (window.navigator.msPointerEnabled) {
            if (window && window.jQuery && $ === window.jQuery) {
               if (e.originalEvent && !e.originalEvent.isPrimary) return;
            } else {
               if (!e.isPrimary) return;
            }
         }
         cancelLongTap();
         if (!!touch.el) {
            // Swipe detection:
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > $.gestureLength) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > $.gestureLength))  {
               swipeTimeout = setTimeout(function() {
                  touch.el.trigger('swipe');
                  touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                  touch = {};
               }, 0);

            // Normal tap:
            } else if ('last' in touch) {

               // Delay by one tick so we can cancel the 'tap' event if 'scroll' fires:
               tapTimeout = setTimeout(function() {

                  // Trigger universal 'tap' with the option to cancelTouch():
                  touch.el.trigger('tap');

                  // Trigger double tap immediately:
                  if (touch.isDoubleTap) {
                     touch.el.trigger('doubletap');
                     touch = {};
                  } else {
                     // Trigger single tap after singleTapDelay:
                     touchTimeout = setTimeout(function(){
                        touchTimeout = null;
                        touch.el.trigger('singletap');
                        touch = {};
                        return false;
                     }, singleTapDelay);
                  }

               }, 0);
            }
         } else { return; }
      });
      body.on('touchcancel', cancelAll);
   });

   ['swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'doubletap', 'tap', 'singletap', 'longtap'].forEach(function(method){       
      // Add gesture events to ChocolateChipJS:
      $.fn.extend({
         method : function(callback){ 
            return this.on(method, callback);
         }
      });
   });
})(whichJavaScriptLibrary);