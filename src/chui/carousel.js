(function($) {
  "use strict";
  //////////////////////////////////
  // Initialize a swipeable carousel:
  //////////////////////////////////
  $(function() {
    var UICarousel = (function () {
      var discoverVendorStyle = document.createElement('div').style,
        vendor = (function () {
          var vendors = 't,webkitT'.split(',');
          var l = vendors.length;
          var t;
          for ( var i = 0 ; i < l; i++ ) {
          t = vendors[i] + 'ransform';
            if ( t in discoverVendorStyle ) {
              return vendors[i].substr(0, vendors[i].length - 1);
            }
          }
          return false;
        })();
      var cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '';
      var transform = prefixStyle('transform');
      var transitionDuration = prefixStyle('transitionDuration');
      var hasTouch = 'ontouchstart' in window;
      if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) hasTouch = false;
      var startEvent = $.eventStart;
      var moveEvent = $.eventMove;
      var endEvent = $.eventEnd;
      var cancelEvent = $.eventCancel;
      var transitionEndEvent = (function () {
        if ( vendor === false ) return false;
        var transitionEnd = {
          '': 'transitionend',
          'webkit': 'webkitTransitionEnd'
          };
        return transitionEnd[vendor];
      })();
        
      var UICarousel = function ( options ) {
        if (!options) return;
        var ul, li, className;
        this.carouselContainer = typeof options.target === 'string' ? document.querySelector(options.target) : options.target;
        this.options = {
          panels: options.panels || 3,
          snapThreshold: null,
          loop: options.loop || true
        };
        // Adjustment for RTL carousels:
        if ($.isRTL) {
          options.loop = true;
        }
        // Include user's options:
        for (var i in options) this.options[i] = options[i];
        this.carouselContainer.style.overflow = 'hidden';
        this.carouselContainer.style.position = 'relative';
        this.carouselPanels = [];
        ul = document.createElement('ul');
        ul.className = 'carousel-track';
        ul.style.cssText = 'position:relative;top:0;height:100%;width:100%;' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform:translateZ(0);' + cssVendor + 'transition-timing-function:ease-out';
        this.carouselContainer.appendChild(ul);
        this.track = ul;
        this.refreshSize();
        var whichPanelIndex;
        for (var j = -1; j < 2; j++) {
          li = document.createElement('li');
          li.id = 'carousel-panel-' + (j + 1);
          li.style.cssText = cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;left:' + j * 100 + '%';
          whichPanelIndex = j === -1 ? this.options.panels - 1 : j;
          $(li).data('upcomingPanelIndex', whichPanelIndex);
          if (!this.options.loop && j === -1) li.style.visibility = 'hidden';
          this.track.appendChild(li);
          this.carouselPanels.push(li);
        }
        className = this.carouselPanels[1].className;
        this.carouselPanels[1].className = !className ? 'carousel-panel-active' : className + ' carousel-panel-active';
        this.carouselContainer.addEventListener(startEvent, this, false);
        this.carouselContainer.addEventListener(moveEvent, this, false);
        this.carouselContainer.addEventListener(endEvent, this, false);
        this.track.addEventListener(transitionEndEvent, this, false);
        var pagination;
        if (options.pagination) {
          pagination = document.createElement('ul');
          pagination.className = 'pagination';
          for (var k = 0; k < this.options.panels; k++) {
            li = document.createElement('li');
            if (k === 0) {
              li.className = 'selected';
            }
            pagination.appendChild(li);
          }
          if (window.$chocolatechipjs) {
            this.carouselContainer.insertAdjacentElement('afterEnd', pagination);
          } else {
            $(this.carouselContainer).after(pagination);
          }
        }
      };
      UICarousel.prototype = {
        currentPanel: 1,
        x: 0,
        panel: 0,
        customEvents: [],
        
        onSlide: function (fn) {
          this.carouselContainer.addEventListener('carousel-panel-move', fn, false);
          this.customEvents.push(['move', fn]);
        },
        destroy: function () {
          while ( this.customEvents.length ) {
            this.carouselContainer.removeEventListener('carousel-panel-' + this.customEvents[0][0], this.customEvents[0][1], false);
            this.customEvents.shift();
          }
          // Remove event listeners:
          this.carouselContainer.removeEventListener(startEvent, this, false);
          this.carouselContainer.removeEventListener(moveEvent, this, false);
          this.carouselContainer.removeEventListener(endEvent, this, false);
          this.track.removeEventListener(transitionEndEvent, this, false);
        },
        refreshSize: function () {
          this.carouselContainerWidth = this.carouselContainer.clientWidth;
          this.carouselContainerHeight = this.carouselContainer.clientHeight;
          this.panelWidth = this.carouselContainerWidth;
          this.maxX = -this.options.panels * this.panelWidth + this.carouselContainerWidth;
          this.snapThreshold = this.options.snapThreshold === null ?
            Math.round(this.panelWidth * 0.15) :
            /%/.test(this.options.snapThreshold) ?
              Math.round(this.panelWidth * this.options.snapThreshold.replace('%', '') / 100) :
              this.options.snapThreshold;
        },
        
        updatePanelCount: function (n) {
          this.options.panels = n;
          this.maxX = -this.options.panels * this.panelWidth + this.carouselContainerWidth;
        },
        
        goToPanel: function (p) {
          this.carouselPanels[this.currentPanel].className = this.carouselPanels[this.currentPanel].className.replace(/(^|\s)carousel-panel-active(\s|$)/, '');
          p = p < 0 ? 0 : p > this.options.panels-1 ? this.options.panels - 1 : p;
          console.log('p: ' , p);
          this.panel = p;
          this.track.style[transitionDuration] = '0s';
          this.getPosition(-p * this.panelWidth);
          this.currentPanel = (this.panel + 1) - Math.floor((this.panel + 1) / 3) * 3;
          this.carouselPanels[this.currentPanel].className = this.carouselPanels[this.currentPanel].className + ' carousel-panel-active';
          if (this.currentPanel === 0) {
            this.carouselPanels[2].style.left = this.panel * 100 - 100 + '%';
            this.carouselPanels[0].style.left = this.panel * 100 + '%';
            this.carouselPanels[1].style.left = this.panel * 100 + 100 + '%';
            $(this.carouselPanels[2]).data('upcomingPanelIndex', this.panel === 0 ? this.options.panels - 1 : this.panel - 1);
            $(this.carouselPanels[0]).data('upcomingPanelIndex', this.panel);
            $(this.carouselPanels[1]).data('upcomingPanelIndex', this.panel === this.options.panels - 1 ? 0 : this.panel + 1);
          } else if (this.currentPanel === 1) {
            this.carouselPanels[0].style.left = this.panel * 100 - 100 + '%';
            this.carouselPanels[1].style.left = this.panel * 100 + '%';
            this.carouselPanels[2].style.left = this.panel * 100 + 100 + '%';
            $(this.carouselPanels[0]).data('upcomingPanelIndex', this.panel === 0 ? this.options.panels - 1 : this.panel - 1);
            $(this.carouselPanels[1]).data('upcomingPanelIndex', this.panel);
            $(this.carouselPanels[2]).data('upcomingPanelIndex', this.panel === this.options.panels - 1 ? 0 : this.panel + 1);
          } else {
            this.carouselPanels[1].style.left = this.panel * 100 - 100 + '%';
            this.carouselPanels[2].style.left = this.panel * 100 + '%';
            this.carouselPanels[0].style.left = this.panel * 100 + 100 + '%';
            $(this.carouselPanels[1]).data('upcomingPanelIndex', this.panel === 0 ? this.options.panels - 1 : this.panel - 1);
            $(this.carouselPanels[2]).data('upcomingPanelIndex', this.panel);
            $(this.carouselPanels[0]).data('upcomingPanelIndex', this.panel === this.options.panels - 1 ? 0 : this.panel + 1);
          }
          this.slide();
        },
        handleEvent: function (e) {
          switch (e.type) {
            case startEvent:
              this.start(e);
              break;
            case moveEvent:
              this.move(e);
              break;
            case cancelEvent:
            case endEvent:
              this.end(e);
              break;
          }
        },
        getPosition: function (x) {
          this.x = x;
          this.track.style[transform] = 'translate(' + x + 'px,0) translateZ(0)';
        },
        resize: function () {
          this.refreshSize();
          this.track.style[transitionDuration] = '0s';
          this.getPosition(-this.panel * this.panelWidth);
        },
        start: function (e) {
          if (this.initiated) return;
          var point = hasTouch ? e.touches[0] : e;
          this.initiated = true;
          this.moved = false;
          this.thresholdExceeded = false;
          this.startX = point.pageX;
          this.startY = point.pageY;
          this.pointX = point.pageX;
          this.pointY = point.pageY;
          this.stepsX = 0;
          this.stepsY = 0;
          this.directionX = 0;
          this.directionLocked = false;
          this.track.style[transitionDuration] = '0s';
          this.event('touchstart');
        },
        
        move: function (e) {
          if (!this.initiated) return;
          var point = hasTouch ? e.touches[0] : e;
          var deltaX = point.pageX - this.pointX;
          var deltaY = point.pageY - this.pointY;
          var newX = this.x + deltaX;
          var dist = Math.abs(point.pageX - this.startX);
          this.moved = true;
          this.pointX = point.pageX;
          this.pointY = point.pageY;
          this.directionX = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0;
          this.stepsX += Math.abs(deltaX);
          this.stepsY += Math.abs(deltaY);
          // Use buffer to calculate direction of swipe:
          if (this.stepsX < 10 && this.stepsY < 10) {
            return;
          }
          // If scrolling vertically, cancel:
          if (!this.directionLocked && this.stepsY > this.stepsX) {
            this.initiated = false;
            return;
          }
          e.preventDefault();
          this.directionLocked = true;
          if (!this.options.loop && (newX > 0 || newX < this.maxX)) {
            newX = this.x + (deltaX / 2);
          }
          this.getPosition(newX);
        },
        
        end: function (e) {
          if (!this.initiated) return;
          var point = hasTouch ? e.changedTouches[0] : e;
          var dist = Math.abs(point.pageX - this.startX);
          this.initiated = false;
          if (!this.moved) return;
          if (!this.options.loop && (this.x > 0 || this.x < this.maxX)) {
            dist = 0;
          }
          // Check if exceeded snap threshold:
          if (dist < this.snapThreshold) {
            this.track.style[transitionDuration] = Math.floor(300 * dist / this.snapThreshold) + 'ms';
            this.getPosition(-this.panel * this.panelWidth);
            return;
          }
          this.checkPosition();
        },
        
        checkPosition: function () {
          var panelMove;
          var pageFlipIndex;
          var className;
          this.carouselPanels[this.currentPanel].className = '';
          // Slide the panel:
          if (this.directionX > 0) {
            this.panel = -Math.ceil(this.x / this.panelWidth);
            this.currentPanel = (this.panel + 1) - Math.floor((this.panel + 1) / 3) * 3;
            panelMove = this.currentPanel - 1;
            panelMove = panelMove < 0 ? 2 : panelMove;
            this.carouselPanels[panelMove].style.left = this.panel * 100 - 100 + '%';
            pageFlipIndex = this.panel - 1;
          } else {
            this.panel = -Math.floor(this.x / this.panelWidth);
            this.currentPanel = (this.panel + 1) - Math.floor((this.panel + 1) / 3) * 3;
            panelMove = this.currentPanel + 1;
            panelMove = panelMove > 2 ? 0 : panelMove;
            this.carouselPanels[panelMove].style.left = this.panel * 100 + 100 + '%';
            pageFlipIndex = this.panel + 1;
          }
          // Add active class to current panel:
          className = this.carouselPanels[this.currentPanel].className;
          /(^|\s)carousel-panel-active(\s|$)/.test(className) || (this.carouselPanels[this.currentPanel].className = !className ? 'carousel-panel-active' : className + ' carousel-panel-active');
          className = this.carouselPanels[panelMove].className;
          pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / this.options.panels) * this.options.panels;
          $(this.carouselPanels[panelMove]).data('upcomingPanelIndex', pageFlipIndex);
          // Index to be loaded in the newly moved panel:
          var newX = -this.panel * this.panelWidth;
          this.track.style[transitionDuration] = Math.floor(500 * Math.abs(this.x - newX) / this.panelWidth) + 'ms';
          // Hide the next panel if looping disabled:
          if (!this.options.loop) {
            this.carouselPanels[panelMove].style.visibility = newX === 0 || newX === this.maxX ? 'hidden' : '';
          }
          if (this.x === newX) {
            this.slide();
          } else {
            this.getPosition(newX);
            this.slide();
          }
        },
        
        slide: function () {
          this.event('move');
        },
        event: function (type) {
          var ev = document.createEvent("Event");
          ev.initEvent('carousel-panel-' + type, true, true);
          this.carouselContainer.dispatchEvent(ev);
        }
      };
      function prefixStyle (style) {
        if ( vendor === '' ) return style;
        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
      }
      return UICarousel;
    })();
    /*
      options = {
        target : (container of carousel),
        panels: (array of content for panels),
        loop: true/false
      }
    */
    $.extend({
      UISetupCarousel : function ( options ) {
        // Method to adjust panel content for RTL:
        function reverseList ( array ) {
          var a = array.shift(0);
          array.reverse();
          array.unshift(a);
          return array;
        }
        if (!options) return;
        options.loop = options.loop || false;
        var carousel = new UICarousel({
          target: options.target,
          panels: options.panels.length,
          loop: options.loop,
          pagination: options.pagination
        });
        $(options.target).data('carousel', carousel);
        // Reverse array of data if RTL:
        if ($.isRTL) options.panels = reverseList(options.panels);
        var panel;
        // Load initial data:
        for (var i = 0; i < 3; i++) {
          panel = (i === 0) ? options.panels.length - 1 : i - 1;
          carousel.carouselPanels[i].innerHTML = options.panels[Number(panel)];
        }
        var index = 0;
        var pagination = $(options.target).next('ul.pagination');
        carousel.onSlide(function () {
          for (var i = 0; i < 3; i++) {
            var upcoming = $(carousel.carouselPanels[i]).data('upcomingPanelIndex');
            carousel.carouselPanels[i].innerHTML = options.panels[Number(upcoming)];
          }
          index = $('.carousel-panel-active').data('upcomingPanelIndex');
          pagination.find('li').removeClass('selected');
          // Handle pagination differently if RTL:
          if ($.isRTL) {
            pagination.find('li').removeClass('selected');
            if (index < 1) {
              pagination.find('li').eq(0).addClass('selected');
            } else {
              pagination.find('li').eq(options.panels.length - index).addClass('selected');
            }
          } else {
            pagination.find('li').eq(index).addClass('selected');
          }
        }); 
        $(options.target).on('mousedown', 'img', function() {return false;});
        var width = $(options.target).css('width');
        pagination.css('width', width);
        pagination.on('click', 'li', function() {
          $(this).siblings('li').removeClass('selected');
          $(this).addClass('selected');
          var goto = 0;
          // Handle pagination differently if RTL:
          if ($.isRTL) {
            var reverse = $(this).parent().children('li').length;
            if ($(this).index() === 0) {
              carousel.goToPanel(0);
            } else {
              goto = reverse - $(this).index();
              carousel.goToPanel(goto);
            }
            $(this).siblings('li').removeClass('selected');
            $(this).addClass('selected');
          } else {
            if ($(this).index() === 0) {
              carousel.goToPanel(0);
            } else {
              carousel.goToPanel($(this).index()); 
            }          
          }
        });
      }
    });
  });
})(window.$);