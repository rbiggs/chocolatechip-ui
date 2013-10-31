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
         UINavigationHistory : ["#" + $('article').eq(0).attr('id')]
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
         if ($.body[0].classList.contains('slide-out-app')) return;
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
            if (m && (temp = ua.match(/version\/([\.\d]+)/i))!== null) m[2]= temp[1];
            m = m ? [m[1], m[2]]: [n, navigator.appVersion, '-?'];
            return m[1];
         }
       });
       
      if ($.isWin) {
         $.body.addClass('isWindows');
      } else if ($.isiOS) {
         $.body.addClass('isiOS');
      } else if ($.isAndroid) {
         $.body.addClass('isAndroid');
      }
      if ($.isSafari && parseInt($.browserVersion(), 10) === 6) {
         $.body.addClass('isSafari6');
      }
      $.UIDesktopCompat();
   });