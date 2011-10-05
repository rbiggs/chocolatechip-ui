/*
	pO\		
   6  /\
	 /OO\
	/OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/   
 
ChocolateChip-UI
Three yummy ingredients make this something to sink your teeth into:
ChococlateChip.js: It's tiny but delicious
ChUI.css: Good looks do impress
ChUI.js: The magic to make it happen
Also staring WAML--Web App Markup Language: no more masquerading as a Web page.
WAML makes coding a Web app logical and straightforward, the way it was meant to be.

Copyright 2011 Robert Biggs: www.chocolatechip-ui.com
License: BSD
Version: 0.8.8 beta

*/

var CHUIVersion = "0.8.8 beta";
	
var UIExpectedChocolateChipJSVersion = "1.1.7"; 

var UICheckChocolateChipJSVersion = function() {
	if ($.version !== UIExpectedChocolateChipJSVersion) {
		console.error("This version of ChocolateChip-UI requries ChococlateChip.js version " + UIExpectedChocolateChipJSVersion + "!");
		console.error("The version of ChocolateChip.js which you are using is: " + $.version);
		console.error("ChocolateChip.js has been disabled until this problem is resolved.");
		window.$ = null;
	}
};
UICheckChocolateChipJSVersion();

$.ready(function() {
	$.body = $("body");
	$.app = $("app");
	$.main = $("#main");
	$.views = $$("view");
});
$.tablet = false;
if ( window.innerWidth > 600 ) {
	$.tablet = true;
}
$.extend($, {
	UIUuidSeed : function ( seed ) {
		if (seed) {
			return (((1 + Math.random()) * 0x10000) | 0).toString(seed).substring(1);
		} else {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
	},
	AlphaSeed : function ( ) {
		var text = "";
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		text += chars.charAt(Math.floor(Math.random() * chars.length));
		return text;
	},
	UIUuid : function() {
		return ($.AlphaSeed() + $.UIUuidSeed(20) + $.UIUuidSeed() + "-" + $.UIUuidSeed() + "-" + $.UIUuidSeed() + "-" + $.UIUuidSeed() + "-" + $.UIUuidSeed() + $.UIUuidSeed() + $.UIUuidSeed());
	},
	resetApp : function ( hard ) {
		if (hard === "hard") {
			window.location.reload(true);
		} else {
			$.views.forEach(function(view) {
				view.setAttribute("ui-navigation-status", "upcoming");
			});
			$.main.setAttribute("ui-navigation-status", "current");
			$.UINavigationHistory = ["#main"];
		}
	}
});
$.extend(HTMLElement.prototype, {
	UIIdentifyChildNodes : function ( ) {
		var kids = this.childElementCount;
		for (var i = 0; i < kids; i++) {
			this.children[i].setAttribute("ui-child-position", i);
		}
	}
});
$.extend($, {
	UINavigationHistory : ["#main"],
	UINavigateBack : function() {
		 var parent = $.UINavigationHistory[$.UINavigationHistory.length-1];
		$.UINavigationHistory.pop();
		$($.UINavigationHistory[$.UINavigationHistory.length-1])
		.setAttribute("ui-navigation-status", "current");
		$(parent).setAttribute("ui-navigation-status", "upcoming");
		$.UIHideURLbar();
		if ($.app.getAttribute("ui-kind")==="navigation-with-one-navbar" && $.UINavigationHistory[$.UINavigationHistory.length-1] === "#main") {
			$("navbar > uibutton[ui-implements=back]", $.app).css("display","none");
		}
	},
	UIBackNavigation : function () {
		$.app.delegate("uibutton", "click", function(item) {
			if (item.getAttribute("ui-implements") === "back") {
			   $.UINavigateBack();
			}
		});
		$.app.delegate("uibutton", "touchstart", function(item) {
			if (item.getAttribute("ui-implements") === "back") {
			   $.UINavigateBack();
			}
		});
	},
	UIDoubleTapDelta : 700,
	UIDoubleTapTimer : null,
	UIDoubleTapFunction1 : null,
	UIDoubleTapFunction2 : null,
	UIDoubleTapTimeout : function ( ) {
		$.UIDoubleTapFunction1();
		$.UIDoubleTapTimer = null;
	},
	UIDoubleTap : function (firstTap, secondTap) {
		if ($.UIDoubleTapTimer === null) {
			$.UIDoubleTapTimer = setTimeout($.UIDoubleTapTimeout, $.UIDoubleTapDelta);
			$.UIDoubleTapFunction1 = firstTap;
			$.UIDoubleTapFunction2 = secondTap;
		} else {
			$.UIDoubleTapTimer = null;
			$.UIDoubleTapFunction2();
		}
	},
	
	UINavigationEvent : false,
	
    UINavigationList : function() {
		var navigateList = function(item) {
			if ($.app.getAttribute("ui-kind")==="navigation-with-one-navbar") {
				$("navbar > uibutton[ui-implements=back]", $.app).css("display: block;");
			}
			$(item.getAttribute("href")).setAttribute("ui-navigation-status", "current");
			$($.UINavigationHistory[$.UINavigationHistory.length-1]).setAttribute("ui-navigation-status", "traversed");
			if ($("#main").getAttribute("ui-navigation-status") !== "traversed") {
				$("#main").setAttribute("ui-navigation-status", "traversed");
			}
			$.UINavigationHistory.push(item.getAttribute("href"));
			$.UIHideURLbar();  
		};
        $.app.delegate("tablecell", "click", function(item) {
            if (item.hasAttribute("href")) {
	            if ($.UINavigationEvent) {
	                return;
	            } else {
					$.UINavigationEvent = false;
	                navigateList(item);
					$.UINavigationEvent = true;
	            }
            }
        });
	},
    
    UITouchedTableCell : null
});
$.ready(function() {
    $.UIBackNavigation();
    $.UINavigationList();
    $.app.delegate("input", "click", function(input) {
        input.focus();
    });
    $.app.delegate("input", "touchstart", function(input) {
        input.focus();
    });
    $.app.delegate("textarea", "click", function(textarea) {
        textarea.focus();
    }); 
    $.app.delegate("textarea", "touchstart", function(textarea) {
        textarea.focus();
    }); 
    $.app.delegate("view","webkitTransitionEnd", function() {
        if (!$("view[ui-navigation-status=current]")) {
            $($.UINavigationHistory[$.UINavigationHistory.length-2])     
                .setAttribute("ui-navigation-status", "current");
            $.UINavigationHistory.pop(); 
        }	
		$.UINavigationEvent = false;
    });
});
 
$.extend(HTMLElement.prototype, {
	UIToggleButtonLabel : function ( label1, label2 ) {
		if ($("label", this).text() === label1) {
			$("label", this).text(label2);
		} else {
			$("label", this).text(label1);
		}
	}
});


$.UISupports3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
$.UISupportsTouch = ('ontouchstart' in window);
$.UISupportsGestures = ('ongesturestart' in window);
$.UISupportsCompositing = ('WebKitTransitionEvent' in window);
$.UIisIDevice = ((/iphone|ipad|ipod/gi).test(navigator.appVersion));
$.UIisAndroid = ((/android/gi).test(navigator.appVersion));
$.UIResizeEvt = ('onorientationchange' in window ? 'orientationchange' : 'resize');
$.UIStartEvt = ($.UISupportsTouch ? 'touchstart' : 'mousedown');
$.UIMoveEvt = ($.UISupportsTouch ? 'touchmove' : 'mousemove');
$.UIEndEvt = ($.UISupportsTouch ? 'touchend' : 'mouseup');
$.UICancelEvt = ($.UISupportsTouch ? 'touchcancel' : 'mouseup');
$.UITransOpen = ('translate' + ($.UISupports3d ? '3d(' : '('));
$.UITransClose = ($.UISupports3d ? ',0)' : ')');
$.UIFakeFunction = function() {};
$.extend($, {
	UIScroll : function (el, options) {
		var that = this;
		var doc = document;
		var div = null;
		var i = null;
		that.wrapper = (typeof el == 'object' ? el : $(el).parentNode);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];
		that.options = {
			HWTransition: true,
			HWCompositing: true,
			hScroll: true,
			vScroll: true,
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: $.UIisAndroid,
			fadeScrollbar: ($.UIisIDevice && $.UISupports3d) || !$.UISupportsTouch,
			hideScrollbar: $.UIisIDevice || !$.UISupportsTouch,
			scrollbarClass: '',
			bounce: $.UISupports3d,
			bounceLock: false,
			momentum: $.UISupports3d,
			lockDirection: true,
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			snap: false,
			pullToRefresh: false,
			pullDownLabel: ['Pull down to refresh...', 'Release to refresh...', 'Loading...'],
			pullUpLabel: ['Pull up to refresh...', 'Release to refresh...', 'Loading...'],
			onPullDown: function () {},
			onPullUp: function () {},
			onScrollStart: null,
			onScrollEnd: null,
			onZoomStart: null,
			onZoomEnd: null,
			checkDOMChange: false
		};
		for (i in options) {
			that.options[i] = options[i];
		}
		that.options.HWCompositing = that.options.HWCompositing && $.UISupportsCompositing;
		that.options.HWTransition = that.options.HWTransition && $.UISupportsCompositing;
		if (that.options.HWCompositing) {
			that.scroller.style.cssText += '-webkit-transition-property:-webkit-transform;-webkit-transform-origin:0 0;-webkit-transform:' + $.UITransOpen + '0,0' + $.UITransClose;
		} else {
			that.scroller.style.cssText += '-webkit-transition-property:top,left;-webkit-transform-origin:0 0;top:0;left:0';
		}
		if (that.options.HWTransition) {
			that.scroller.style.cssText += '-webkit-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-webkit-transition-duration:0;';
		}
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.pullDownToRefresh = that.options.pullToRefresh == 'down' || that.options.pullToRefresh == 'both';
		that.pullUpToRefresh = that.options.pullToRefresh == 'up' || that.options.pullToRefresh == 'both';
		if (that.pullDownToRefresh) {
			div = doc.createElement('div');
			div.className = 'iScrollPullDown';
			div.innerHTML = '<span class="iScrollPullDownIcon"></span><span class="iScrollPullDownLabel">' + that.options.pullDownLabel[0] + '</span>\n';
			that.scroller.insertBefore(div, that.scroller.children[0]);
			that.options.bounce = true;
			that.pullDownEl = div;
			that.pullDownLabel = div.getElementsByTagName('span')[1];
		}
		if (that.pullUpToRefresh) {
			div = doc.createElement('div');
			div.className = 'iScrollPullUp';
			div.innerHTML = '<span class="iScrollPullUpIcon"></span><span class="iScrollPullUpLabel">' + that.options.pullUpLabel[0] + '</span>\n';
			that.scroller.appendChild(div);
			that.options.bounce = true;
			that.pullUpEl = div;
			that.pullUpLabel = div.getElementsByTagName('span')[1];
		}
		that.refresh();
		that._bind($.UIResizeEvt, window);
		that._bind($.UIStartEvt);
		if ($.UISupportsGestures && that.options.zoom) {
			that._bind('gesturestart');
			that.scroller.style.webkitTransform = that.scroller.style.webkitTransform + ' scale(1)';
		}
		if (!$.UISupportsTouch) {
			that._bind('mousewheel');
		}
		if (that.options.checkDOMChange) {
			that.DOMChangeInterval = setInterval(function () { that._checkSize(); }, 250);
		}
	}
});

$.UIScroll.prototype = {
	x: 0, y: 0,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	offsetBottom: 0,
	offsetTop: 0,
	scale: 1, lastScale: 1,
	contentReady: true,
	handleEvent: function (e) {
		var that = this;
		if (e.target.tagName != "SELECT") { 
			 e.preventDefault(); 
			 e.stopPropagation(); 
		}
		switch(e.type) {
			case $.UIStartEvt: that._start(e); break;
			case $.UIMoveEvt: that._move(e); break;
			case $.UIEndEvt: $.UIFakeFunction();
			case $.UICancelEvt: that._end(e); break;
			case 'webkitTransitionEnd': that._transitionEnd(e); break;
			case $.UIResizeEvt: that._resize(); break;
			case 'gesturestart': that._gestStart(e); break;
			case 'gesturechange': that._gestChange(e); break;
			case 'gestureend':
			case 'gesturecancel': that._gestEnd(e); break;
			case 'mousewheel': that._wheel(e); break;
		}
	},
	_scrollbar: function (dir) {
		var that = this;
		var	   doc = document;
		var	   bar = null;
		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				that[dir + 'ScrollbarIndicator'].style.webkitTransform = '';	
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}
			return;
		}
		if (!that[dir + 'ScrollbarWrapper']) {
			bar = doc.createElement('div');
			if (that.options.scrollbarClass) {
				bar.className = that.options.scrollbarClass + dir.toUpperCase();
			} else {
				bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:7px' : 'width:7px;bottom:7px;top:2px;right:1px');
			}
			bar.style.cssText += 'pointer-events:none;-webkit-transition-property:opacity;-webkit-transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');
			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-webkit-background-clip:padding-box;-webkit-box-sizing:border-box;' + (dir == 'h' ? 'height:100%;-webkit-border-radius:4px 3px;' : 'width:100%;-webkit-border-radius:3px 4px;');
			}
			bar.style.cssText += 'pointer-events:none;-webkit-transition-property:-webkit-transform;-webkit-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-webkit-transition-duration:0;-webkit-transform:' + $.UITransOpen + '0,0' + $.UITransClose;
			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}
		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = Math.max(Math.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = Math.max(Math.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}
		that._indicatorPos(dir, true);
	},
	_resize: function () {
		var that = this;
		setTimeout(function () {
			that.refresh();
		}, 0);
	},
	_checkSize: function () {
		var that = this;
		var	   scrollerW = null;
		var	   scrollerH = null;
		if (that.moved || that.zoomed || !that.contentReady) return;
		scrollerW = Math.round(that.scroller.offsetWidth * that.scale);
		scrollerH = Math.round((that.scroller.offsetHeight - that.offsetBottom - that.offsetTop) * that.scale);
		if (scrollerW == that.scrollerW && scrollerH == that.scrollerH) return;
		that.refresh();
	},
	_pos: function (x, y) {
		var that = this;
		that.x = that.hScroll ? x : 0;
		that.y = that.vScroll ? y : 0;
		that.scroller.style.webkitTransform = $.UITransOpen + that.x + 'px,' + that.y + 'px' + $.UITransClose + ' scale(' + that.scale + ')';
		that._indicatorPos('h');
		that._indicatorPos('v');
	},
	_indicatorPos: function (dir, hidden) {
		var that = this;
		var	   pos = dir == 'h' ? that.x : that.y;
		if (!that[dir + 'Scrollbar']) return;
		pos = that[dir + 'ScrollbarProp'] * pos;
		if (pos < 0) {
			pos = that.options.fixedScrollbar ? 0 : pos + pos*3;
			if (that[dir + 'ScrollbarIndicatorSize'] + pos < 9) pos = -that[dir + 'ScrollbarIndicatorSize'] + 8;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			pos = that.options.fixedScrollbar ? that[dir + 'ScrollbarMaxScroll'] : pos + (pos - that[dir + 'ScrollbarMaxScroll'])*3;
			if (that[dir + 'ScrollbarIndicatorSize'] + that[dir + 'ScrollbarMaxScroll'] - pos < 9) pos = that[dir + 'ScrollbarIndicatorSize'] + that[dir + 'ScrollbarMaxScroll'] - 8;
		}
		that[dir + 'ScrollbarWrapper'].style.webkitTransitionDelay = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style.webkitTransform = $.UITransOpen + (dir == 'h' ? pos + 'px,0' : '0,' + pos + 'px') + $.UITransClose;
	},
	_transitionTime: function (time) {
		var that = this;
		time += 'ms';
		that.scroller.style.webkitTransitionDuration = time;
		if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionDuration = time;
		if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionDuration = time;
	},
	_start: function (e) {
		var that = this;
		var	   point = $.UISupportsTouch ? e.changedTouches[0] : e;
		var	   matrix = null;
		that.moved = false;
		e.preventDefault();
		if ($.UISupportsTouch && e.touches.length == 2 && that.options.zoom && $.UISupportsGestures && !that.zoomed) {
			that.originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft*2) / 2 - that.x;
			that.originY = Math.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop*2) / 2 - that.y;
		}
		that.moved = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;
		that.returnTime = 0;
		that._transitionTime(0);
		if (that.options.momentum) {
			if (that.scrollInterval) {
				clearInterval(that.scrollInterval);
				that.scrollInterval = null;
			}
			if (that.options.HWCompositing) {
				matrix = new WebKitCSSMatrix(window.getComputedStyle(that.scroller, null).webkitTransform);
				if (matrix.m41 != that.x || matrix.m42 != that.y) {
					that._unbind('webkitTransitionEnd');
					that._pos(matrix.m41, matrix.m42);
				}
			} else {
				matrix = window.getComputedStyle(that.scroller, null);
				if (that.x + 'px' != matrix.left || that.y + 'px' != matrix.top) {
					that._unbind('webkitTransitionEnd');
					that._pos(matrix.left.replace(/[^0-9]/g)*1, matrix.top.replace(/[^0-9]/g)*1);
				}
			}
		}
		that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.66,0.66,1)';
		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;
		that.startTime = e.timeStamp;
		if (that.options.onScrollStart) {
			that.options.onScrollStart.call(that);
		}
		that._bind($.UIMoveEvt);
		that._bind($.UIEndEvt);
	},
	_move: function (e) {
		if ($.UISupportsTouch && e.touches.length > 1) return;
		var that = this;
		var	   point = $.UISupportsTouch ? e.changedTouches[0] : e;
		var	   deltaX = point.pageX - that.pointX;
		var	   deltaY = point.pageY - that.pointY;
		var	   newX = that.x + deltaX;
		var	   newY = that.y + deltaY;
		e.preventDefault();
		that.pointX = point.pageX;
		that.pointY = point.pageY;
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2.4) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > 0 || newY < that.maxScrollY) { 
			newY = that.options.bounce ? that.y + (deltaY / 2.4) : newY >= 0 || that.maxScrollY >= 0 ? 0 : that.maxScrollY;
			if (that.options.pullToRefresh && that.contentReady) {
				if (that.pullDownToRefresh && newY > that.offsetBottom) {
					that.pullDownEl.className = 'iScrollPullDown flip';
					that.pullDownLabel.innerText = that.options.pullDownLabel[1];
				} else if (that.pullDownToRefresh && that.pullDownEl.className.match('flip')) {
					that.pullDownEl.className = 'iScrollPullDown';
					that.pullDownLabel.innerText = that.options.pullDownLabel[0];
				}
				if (that.pullUpToRefresh && newY < that.maxScrollY - that.offsetTop) {
					that.pullUpEl.className = 'iScrollPullUp flip';
					that.pullUpLabel.innerText = that.options.pullUpLabel[1];
				} else if (that.pullUpToRefresh && that.pullUpEl.className.match('flip')) {
					that.pullUpEl.className = 'iScrollPullUp';
					that.pullUpLabel.innerText = that.options.pullUpLabel[0];
				}
			}
		}
		if (that.absDistX < 4 && that.absDistY < 4) {
			that.distX += deltaX;
			that.distY += deltaY;
			that.absDistX = Math.abs(that.distX);
			that.absDistY = Math.abs(that.distY);
			return;
		}
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY+3) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX+3) {
				newX = that.x;
				deltaX = 0;
			}
		}
		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
		if (e.timeStamp - that.startTime > 300) {
			that.startTime = e.timeStamp;
			that.startX = that.x;
			that.startY = that.y;
		}
	},
	_end: function (e) {
		if ($.UISupportsTouch && e.touches.length !== 0) return;
		var that = this;
		var	   point = $.UISupportsTouch ? e.changedTouches[0] : e;
		var	   target, ev;
		var	   momentumX = { dist:0, time:0 };
		var	   momentumY = { dist:0, time:0 };
		var	   duration = e.timeStamp - that.startTime;
		var	   newPosX = that.x; 
		var newPosY = that.y;
		var	   newDuration;
		var	   snap;
		that._unbind($.UIMoveEvt);
		that._unbind($.UIEndEvt);
		that._unbind($.UICancelEvt);
		if (that.zoomed) return;
		if (!that.moved) {
			if ($.UISupportsTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? 2 : 1);
				} else {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) {
							target = target.parentNode;
						}
						ev = document.createEvent('MouseEvents');
						ev.initMouseEvent('click', true, true, e.view, 1,
							point.screenX, point.screenY, point.clientX, point.clientY,
							e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
							0, null);
						ev._fake = true;
						target.dispatchEvent(ev);
					}, that.options.zoom ? 250 : 0);
				}
			}
			that._resetPos();
			return;
		}
		if (that.pullDownToRefresh && that.contentReady && that.pullDownEl.className.match('flip')) {
			that.pullDownEl.className = 'iScrollPullDown loading';
			that.pullDownLabel.innerText = that.options.pullDownLabel[2];
			that.scroller.style.marginTop = '0';
			that.offsetBottom = 0;
			that.refresh();
			that.contentReady = false;
			that.options.onPullDown();
		}
		if (that.pullUpToRefresh && that.contentReady && that.pullUpEl.className.match('flip')) {
			that.pullUpEl.className = 'iScrollPullUp loading';
			that.pullUpLabel.innerText = that.options.pullUpLabel[2];
			that.scroller.style.marginBottom = '0';
			that.offsetTop = 0;
			that.refresh();
			that.contentReady = false;
			that.options.onPullUp();
		}
		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;
			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;
			 if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
			 if ((that.y > 0 && newPosY > 0) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}
		if (momentumX.dist || momentumY.dist) {
			newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 10);
			if (that.options.snap) {
				snap = that._snap(newPosX, newPosY);
				newPosX = snap.x;
				newPosY = snap.y;
				newDuration = Math.max(snap.time, newDuration);
			}
			that.scrollTo(newPosX, newPosY, newDuration);
			return;
		}
		if (that.options.snap) {
			snap = that._snap(that.x, that.y);
			if (snap.x != that.x || snap.y != that.y) {
				that.scrollTo(snap.x, snap.y, snap.time);
			}
			return;
		}
		that._resetPos();
	},
	_resetPos: function (time) {
		var that = this;
		var	   resetX = that.x;
		var	   resetY = that.y;
		if (that.x >= 0) resetX = 0;
		else if (that.x < that.maxScrollX) resetX = that.maxScrollX;

		if (that.y >= 0 || that.maxScrollY > 0) resetY = 0;
		else if (that.y < that.maxScrollY) resetY = that.maxScrollY;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
				that.moved = false;
			}
			if (that.zoomed) {
				if (that.options.onZoomEnd) that.options.onZoomEnd.call(that);
				that.zoomed = false;
			}
			if (that.hScrollbar && that.options.hideScrollbar) {
				that.hScrollbarWrapper.style.webkitTransitionDelay = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				that.vScrollbarWrapper.style.webkitTransitionDelay = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}
			return;
		}
		if (time === undefined) time = 200;
		if (time) {
			that.scroller.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
			if (that.hScrollbar) that.hScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
			if (that.vScrollbar) that.vScrollbarIndicator.style.webkitTransitionTimingFunction = 'cubic-bezier(0.33,0.0,0.33,1)';
		}
		that.scrollTo(resetX, resetY, time);
	},
	_timedScroll: function (destX, destY, runtime) {
		var that = this;
		var	   startX = that.x; 
		var startY = that.y;
		var	   startTime = (new Date()).getTime();
		var	   easeOut;
		that._transitionTime(0);
		if (that.scrollInterval) {
			clearInterval(that.scrollInterval);
			that.scrollInterval = null;
		}
		that.scrollInterval = setInterval(function () {
			var now = (new Date()).getTime(),
				newX, newY;
			if (now >= startTime + runtime) {
				clearInterval(that.scrollInterval);
				that.scrollInterval = null;
				that._pos(destX, destY);
				that._transitionEnd();
				return;
			}
			now = (now - startTime) / runtime - 1;
			easeOut = Math.sqrt(1 - now * now);
			newX = (destX - startX) * easeOut + startX;
			newY = (destY - startY) * easeOut + startY;
			that._pos(newX, newY);
		}, 20);
	},
	
	_transitionEnd: function (e) {
		var that = this;
		if (e) e.stopPropagation();
		that._unbind('webkitTransitionEnd');
		that._resetPos(that.returnTime);
		that.returnTime = 0;
	},
	_gestStart: function (e) {
		var that = this;
		that._transitionTime(0);
		that.lastScale = 1;
		if (that.options.onZoomStart) that.options.onZoomStart.call(that);
		that._unbind('gesturestart');
		that._bind('gesturechange');
		that._bind('gestureend');
		that._bind('gesturecancel');
	},
	_gestChange: function (e) {
		var that = this;
		var	   scale = that.scale * e.scale;
		var	   x, y, relScale;
		that.zoomed = true;
		if (scale < that.options.zoomMin) scale = that.options.zoomMin;
		else if (scale > that.options.zoomMax) scale = that.options.zoomMax;
		relScale = scale / that.scale;
		x = that.originX - that.originX * relScale + that.x;
		y = that.originY - that.originY * relScale + that.y;
		that.scroller.style.webkitTransform = $.UITransOpen + x + 'px,' + y + 'px' + $.UITransClose + ' scale(' + scale + ')';
		that.lastScale = relScale;
	},
	_gestEnd: function (e) {
		var that = this;
		var	   scale = that.scale;
		var	   lastScale = that.lastScale;
		that.scale = scale * lastScale;
		if (that.scale < that.options.zoomMin + 0.05) that.scale = that.options.zoomMin;
		else if (that.scale > that.options.zoomMax - 0.05) that.scale = that.options.zoomMax;
		lastScale = that.scale / scale;
		that.x = that.originX - that.originX * lastScale + that.x;
		that.y = that.originY - that.originY * lastScale + that.y;
		that.scroller.style.webkitTransform = $.UITransOpen + that.x + 'px,' + that.y + 'px' + $.UITransClose + ' scale(' + that.scale + ')';
		setTimeout(function () {
			that.refresh();
		}, 0);
		that._bind('gesturestart');
		that._unbind('gesturechange');
		that._unbind('gestureend');
		that._unbind('gesturecancel');
	},
	_wheel: function (e) {
		var that = this;
		var	   deltaX = that.x + e.wheelDeltaX / 12;
		var	   deltaY = that.y + e.wheelDeltaY / 12;
		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;
		if (deltaY > 0) deltaY = 0;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
		that.scrollTo(deltaX, deltaY, 0);
	},
	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var that = this,
			deceleration = 0.0006,
			speed = Math.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			that.returnTime = 800 / size * outsideDist + 100;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			that.returnTime = 800 / size * outsideDist + 100;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}
		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;
		return { dist: newDist, time: Math.round(newTime) };
	},
	_offset: function (el, tree) {
		var left = -el.offsetLeft;
		var	   top = -el.offsetTop;
		if (!tree) return { x: left, y: top };
		el = el.offsetParent;
		while (el) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
			el = el.offsetParent;
		} 
		return { x: left, y: top };
	},
	_snap: function (x, y) {
		var that = this;
		var	   i; 
		var l;
		var	   page; 
		var time;
		var	   sizeX; 
		var sizeY;
		page = that.pagesX.length-1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = Math.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? Math.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = Math.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? Math.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;
		time = Math.round(Math.max(sizeX, sizeY)) || 200;
		return { x: x, y: y, time: time };
	},
	_bind: function (type, el) {
		(el || this.scroller).addEventListener(type, this, false);
	},
	_unbind: function (type, el) {
		(el || this.scroller).removeEventListener(type, this, false);
	},
	destroy: function () {
		var that = this;
		if (that.options.checkDOMChange) clearTimeout(that.DOMChangeInterval);
		if (that.pullDownToRefresh) {
			that.pullDownEl.parentNode.removeChild(that.pullDownEl);
		}
		if (that.pullUpToRefresh) {
			that.pullUpEl.parentNode.removeChild(that.pullUpEl);
		}
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');
		that.scroller.style.webkitTransform = '';
		that._unbind('webkitTransitionEnd');
		that._unbind($.UIResizeEvt);
		that._unbind($.UIStartEvt);
		that._unbind($.UIMoveEvt);
		that._unbind($.UIEndEvt);
		that._unbind($.UICancelEvt);
		if (that.options.zoom) {
			that._unbind('gesturestart');
			that._unbind('gesturechange');
			that._unbind('gestureend');
			that._unbind('gesturecancel');
		}
	},
	refresh: function () {
		var that = this;
		var	   pos = 0; 
		var page = 0;
		var	   i; 
		var l; 
		var els;
		var	   oldHeight;
		var offsets;
		var	   loading;
		if (that.pullDownToRefresh) {
			loading = that.pullDownEl.className.match('loading');
			if (loading && !that.contentReady) {
				oldHeight = that.scrollerH;
				that.contentReady = true;
				that.pullDownEl.className = 'iScrollPullDown';
				that.pullDownLabel.innerText = that.options.pullDownLabel[0];
				that.offsetBottom = that.pullDownEl.offsetHeight;
				that.scroller.style.marginTop = -that.offsetBottom + 'px';
			} else if (!loading) {
				that.offsetBottom = that.pullDownEl.offsetHeight;
				that.scroller.style.marginTop = -that.offsetBottom + 'px';
			}
		}
		if (that.pullUpToRefresh) {
			loading = that.pullUpEl.className.match('loading');
			if (loading && !that.contentReady) {
				oldHeight = that.scrollerH;
				that.contentReady = true;
				that.pullUpEl.className = 'iScrollPullUp';
				that.pullUpLabel.innerText = that.options.pullUpLabel[0];
				that.offsetTop = that.pullUpEl.offsetHeight;
				that.scroller.style.marginBottom = -that.offsetTop + 'px';
			} else if (!loading) {
				that.offsetTop = that.pullUpEl.offsetHeight;
				that.scroller.style.marginBottom = -that.offsetTop + 'px';
			}
		}
		that.wrapperW = that.wrapper.clientWidth;
		that.wrapperH = that.wrapper.clientHeight;
		that.scrollerW = Math.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = Math.round((that.scroller.offsetHeight - that.offsetBottom - that.offsetTop) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH;
		that.dirX = 0;
		that.dirY = 0;
		that._transitionTime(0);
		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);
		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;
		that._scrollbar('h');
		that._scrollbar('v');
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				that.pagesX[i] = pos.x < that.maxScrollX ? that.maxScrollX : pos.x * that.scale;
				that.pagesY[i] = pos.y < that.maxScrollY ? that.maxScrollY : pos.y * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];
			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}
		if (that.options.zoom) {
			offsets = that._offset(that.wrapper, true);
			that.wrapperOffsetLeft = -offsets.x;
			that.wrapperOffsetTop = -offsets.y;
		}
		if (oldHeight && that.y === 0) {
			oldHeight = oldHeight - that.scrollerH + that.y;
			that.scrollTo(0, oldHeight, 0);
		}
		that._resetPos();
	},
	scrollTo: function (x, y, time, relative) {
		var that = this;
		if (relative) {
			x = that.x - x;
			y = that.y - y;
		}
		time = !time || (Math.round(that.x) === Math.round(x) && Math.round(that.y) === Math.round(y)) ? 0 : time;
		that.moved = true;
		if (!that.options.HWTransition) {
			that._timedScroll(x, y, time);
			return;
		}
		if (time) that._bind('webkitTransitionEnd');
		that._transitionTime(time);
		that._pos(x, y);
		if (!time) setTimeout(function () { that._transitionEnd(); }, 0);
	},
	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;
		pos = that._offset(el);
		pos.x = pos.x > 0 ? 0 : pos.x < that.maxScrollX ? that.maxScrollX : pos.x;
		pos.y = pos.y > 0 ? 0 : pos.y < that.maxScrollY ? that.maxScrollY : pos.y;
		time = time === undefined ? Math.max(Math.abs(pos.x)*2, Math.abs(pos.y)*2) : time;
		that.scrollTo(pos.x, pos.y, time);
	},
	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;
			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;
			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}
		that.scrollTo(x, y, time || 400);
	},
	zoom: function (x, y, scale) {
		var that = this;
		var	   relScale = scale / that.scale;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;
		that.scale = scale;
		if (that.options.onZoomStart) that.options.onZoomStart.call(that);
		that.refresh();
		that._bind('webkitTransitionEnd');
		that._transitionTime(200);
		setTimeout(function () {
			that.zoomed = true;
			that.scroller.style.webkitTransform = $.UITransOpen + that.x + 'px,' + that.y + 'px' + $.UITransClose + ' scale(' + scale + ')';
		}, 0);
	}
};

$.extend($, {
	UIScrollers : {},
	UIEnableScrolling : function(options) {
		$.ready(function() {
			try {
				var scrollpanels = $$("scrollpanel");
				var count = 0;
				scrollpanels.forEach(function(item) {
					item.setAttribute("ui-scroller", $.UIUuid());
					var whichScroller = item.getAttribute("ui-scroller");
					$.UIScrollers[whichScroller] = new $.UIScroll(item.parentNode, options);
				});
			} catch(e) { }
		});
	}
});
$.UIEnableScrolling({ desktopCompatibility: true });
$.extend($, {
	UIPaging : function( selector, opts ) {
		var myPager = new $.UIScroll( selector, opts );
		var stack = null;
		if (selector.nodeType === 1) {
			stack = $("stack", selector);
			selector.parentNode.setAttribute("ui-scroller", "myPager");
		} else {
			stack = $("stack", $(selector));
			selector = $(selector);
			selector.parentNode.setAttribute("ui-scroller", "myPager");
		}
		var panels = stack.children.length;
		var indicatorsWidth = selector.parentNode.css("width");
		var indicators = '<stack ui-implements="indicators" style="width:"' + indicatorsWidth + ';">';
		for (var i = 0; i < panels; i++) {
			if (i === 0) {
				indicators += '<indicator class="active"></indicator>';
			} else {
				indicators += "<indicator></indicator>";
			}
		}
		indicators += "</stack>";
		// The maximum number of indicators in portrait view is 17.
		selector.parentNode.parentNode.insert(indicators);
	}
});

$.ready(function() {
	if ($("stack[ui-implements=paging]")) {
		$.UIPaging("stack[ui-implements=paging] > panel", {
			snap: true,
			momentum: false,
			hScrollbar: false,
			onScrollEnd: function () {
				document.querySelector('stack[ui-implements="indicators"] > indicator.active').removeClass('active');
				document.querySelector('stack[ui-implements="indicators"] > indicator:nth-child(' + (this.currPageX+1) + ')').addClass('active');
			}
		});
	
	}
});

$.extend($, {
	UIDeletableTableCells : [],
	UIDeleteTableCell : function( selector, toolbar, callback ) {
		this.deletionList = [];
		var listEl = $(selector);
		var toolbarEl = $(toolbar);
		var deleteButtonTemp = '<uibutton ui-bar-align="left" ui-implements="delete" class="disabled" style="display: none;"><label>Delete</label></uibutton>';
		var editButtonTemp = '<uibutton ui-bar-align="right"  ui-implements="edit"><label>Edit</label></uibutton>';
		toolbarEl.insertAdjacentHTML("afterBegin", deleteButtonTemp);
		toolbarEl.insertAdjacentHTML("beforeEnd", editButtonTemp);
		var deleteDisclosure = '<deletedisclosure><span>&#x2713</span></deletedisclosure>';
		$$(selector + " > tablecell").forEach(function(item) {
			item.insertAdjacentHTML("afterBegin", deleteDisclosure);
		});
		
		listEl.setAttribute("data-deletable-items", 0);
		var UIEditExecution = function() {
		   $(toolbar + " > uibutton[ui-implements=edit]").bind("click", function() {
			   if ($("label", this).text() === "Edit") {
				   this.UIToggleButtonLabel("Edit", "Done");
				   this.setAttribute("ui-implements", "done");
				   listEl.addClass("ui-show-delete-disclosures");
				   this.parentNode.firstElementChild.style.display = "-webkit-inline-box";
				   if (/uibutton/i.test(toolbarEl.children[1].nodeName)) {
					   toolbarEl.children[1].css("display", "none;");
				   }
				   $$("tablecell > img", listEl).forEach(function(img) {
					img.css("-webkit-transform: translate3d(40px, 0, 0)");
				   });
			   } else {
				   this.UIToggleButtonLabel("Edit", "Done");
				   this.removeAttribute("ui-implements");
				   this.parentNode.firstElementChild.style.display = "none";
				   listEl.removeClass("ui-show-delete-disclosures");
				   $$("deletedisclosure").forEach(function(disclosure) {
					   disclosure.removeClass("checked");
					   disclosure.ancestor("tablecell").removeClass("deletable");
				   });
				   if (/uibutton/i.test(toolbarEl.children[1].nodeName)) {
					   toolbarEl.children[1].css("display", "-webkit-inline-box");
				   }
				   $("uibutton[ui-implements=delete]").addClass("disabled");
				   
				   $$("tablecell > img", listEl).forEach(function(img) {
					img.css("-webkit-transform: translate3d(0, 0, 0)");
				   });
			   }
		   });
		};
		var UIDeleteDisclosureSelection = function() {
			$$("deletedisclosure").forEach(function(disclosure) {
				disclosure.bind("click", function() {
					disclosure.toggleClass("checked");
					disclosure.ancestor("tablecell").toggleClass("deletable");
					$("uibutton[ui-implements=delete]").removeClass("disabled");
					if (!disclosure.ancestor("tablecell").hasClass("deletable")) {
						listEl.setAttribute("data-deletable-items", parseInt(listEl.data("deletable-items"), 10) - 1);
						if (parseInt(listEl.data("deletable-items"), 10) === 0) {
							toolbarEl.firstElementChild.addClass("disabled");
						}
					} else {
						listEl.data("deletable-items", parseInt(listEl.data("deletable-items"), 10) + 1);
					}
				}); 
			});
		};
		
		var UIDeletionExecution = function() {
		   $("uibutton[ui-implements=delete]").bind("click", function() {
			   if (this.hasClass("disabled")) {
				   return;
			   }
			   $$(".deletable").forEach(function(item) {
				   listEl.data("deletable-items", parseInt(listEl.data("deletable-items"), 10) - 1);
				   $.UIDeletableTableCells.push(item.id);
				   item.remove();
				   if (!!callback) {
					   callback.call(this, item);
				   }
				   $.UIDeletableTableCells = [];
				   listEl.setAttribute("data-deletable-items", 0);
			   });
			   this.addClass("disabled");
			$.UIScrollers[$("scrollpanel", $(selector).ancestor("view")).getAttribute("ui-scroller")].refresh();
		   });
		};
		UIEditExecution();
		UIDeleteDisclosureSelection();
		UIDeletionExecution();
	}
});

$.extend(HTMLElement.prototype, {
	UIScreenCover : function() {
		var screencover = '<screencover ui-visible-state="hidden"></screencover>';
		if (!$("screencover")) {
			this.insert(screencover);
		}
	}
});
$.extend($, {
	/*
		option values:
		selector:
		name: 
		range: {start:, end:, values: }
		step:
		defaultValue:
		buttonClass:
		indicator:
	*/
	UISpinner : function (opts) {
		var spinner = opts.selector || null;
		var defaultValue = null;
		var range = null;
		var step = opts.step;
		if (opts.range.start >= 0) {
			var rangeStart = opts.range.start || "";
			var rangeEnd = opts.range.end || "";
			var tempNum = rangeEnd - rangeStart;
			tempNum++;
			range = [];
			if (step) {
				var mod = ((rangeEnd-rangeStart)/step);
				if (opts.range.start === 0) {
					range.push(0);
				} else {
					range.push(rangeStart);
				}
				for (var i = 1; i < mod; i++) {
					range.push(range[i-1] + step);
				}
				range.push(range[range.length-1] + step);
			} else {
				for (var j = 0; j < tempNum; j++) {
					range.push(rangeStart + j);				
				}
			}
		}
		var icon = (opts.indicator === "plus") ? "<icon class='indicator'></icon>" : "<icon></icon>";
		var buttonClass = opts.buttonClass ? " class='" + opts.buttonClass + "' " : "";
		var decreaseButton = "<uibutton " + buttonClass + "ui-implements='icon'>" + icon + "</uibutton>";
		var increaseButton = "<uibutton " + buttonClass + "ui-implements='icon'>" + icon + "</uibutton>";
		var spinnerTemp = decreaseButton + "<label ui-kind='spinner-label'></label><input type='text'/>" + increaseButton;
		spinner.insert(spinnerTemp);
		if (opts.range.values) {
			spinner.data("range-value", opts.range.values.join(","));
		}
		if (!opts.defaultValue) {
			if (!!opts.range.start || opts.range.start === 0) {
				defaultValue = opts.range.start === 0 ? "0": opts.range.start;
			} else if (opts.range.values instanceof Array) {
				defaultValue = opts.range.values[0];
				$("uibutton:first-of-type", opts.selector).addClass("disabled");
			}
		} else {
			defaultValue = opts.defaultValue;
		}
		if (range) {
			spinner.data("range-value", range.join(","));
		}
		
		$("label[ui-kind=spinner-label]", spinner).text(defaultValue);
		$("input", spinner).value = defaultValue;
		
		if (defaultValue === opts.range.start) {
			$("uibutton:first-of-type", spinner).addClass("disabled");
		}
		if (defaultValue == opts.range.end) {
			$("uibutton:last-of-type", spinner).addClass("disabled");
		}
		$("uibutton:first-of-type", opts.selector).bind("click", function(button) {
			$.decreaseSpinnerValue.call(this, opts.selector);
		});
		$("uibutton:last-of-type", opts.selector).bind("click", function(button) {
			$.increaseSpinnerValue.call(this, opts.selector);
		});
	},
	
	decreaseSpinnerValue : function(selector) {
		var values = $(selector).data("range-value");
		values = values.split(",");
		var defaultValue = $("label", selector).text().trim();
		var idx = values.indexOf(defaultValue);
		if (idx !== -1) {
			$("uibutton:last-of-type", selector).removeClass("disabled");
			$("[ui-kind=spinner-label]", selector).text(values[idx-1]);
			$("input", selector).value = values[idx-1];
			if (idx === 1) {
				this.addClass("disabled");
			} 
		}	
	},
	
	increaseSpinnerValue : function(selector) {
		var values = $(selector).data("range-value");
		values = values.split(",");
		var defaultValue = $("label", selector).text().trim();
		var idx = values.indexOf(defaultValue);
		if (idx !== -1) {
			$("uibutton:first-of-type", selector).removeClass("disabled");
			$("label[ui-kind=spinner-label]", selector).text(values[idx+1]);
			$("input", selector).value = values[idx+1];
			if (idx === values.length-2) {
				this.addClass("disabled");
			}
		}
	}	
});
$(function() {
	$.extend($, {
		UIPopUpIsActive : null,
		UIPopUpIdentifier : null,
	
		UIPopUp : function( opts ) {
			var id = opts.id || $.UIUuid();
			var title = opts.title || "Alert!";
			var message = opts.message || "";
			var cancelUIButton = opts.cancelUIButton || "Cancel";
			var continueUIButton = opts.continueUIButton || "Continue";
			var callback = opts.callback || function() {};
			var popup = '<popup id=' + id + ' ui-visible-state="hidden">\
				<panel>\
					<toolbar ui-placement="top">\
						<h1>' + title + '</h1>\
					</toolbar>\
					<p>' + message + '</p>\
					<toolbar ui-placement="bottom">\
						<uibutton ui-kind="action" ui-implements="cancel">\
							<label>' + cancelUIButton + '</label>\
						</uibutton>\
						<uibutton ui-kind="action" ui-implements="continue">\
							<label>' + continueUIButton + '</label>\
						</uibutton>\
					</toolbar>\
				</panel>\
			</popup>';
			$("app").UIScreenCover();
			$("app").insertAdjacentHTML("beforeEnd", popup);
			var popupBtn = "#" + id + " uibutton";
			$$(popupBtn).forEach(function(button) {
			  	button.bind("click", function(e) {
	                e.preventDefault();
	                $("screencover").setAttribute("ui-visible-state", "hidden");
	                $("#" + id).setAttribute("ui-visible-state", "hidden");
	            });
			  	button.bind("click", function(e) {
	                e.preventDefault();
	                $("screencover").setAttribute("ui-visible-state", "hidden");
	                $("#" + id).setAttribute("ui-visible-state", "hidden");
	            });
	            $.UIPopUpIsActive = false;
	            $.UIPopUpIdentifier = null;
	            button.bind("touchend", function(e) {
	                e.preventDefault();
	                $("screencover").setAttribute("ui-visible-state", "hidden");
	                $("#" + id).setAttribute("ui-visible-state", "hidden");
	            }); 
	            $.UIPopUpIsActive = false;
	            $.UIPopUpIdentifier = null;
	        });
			var callbackSelector = "#" + id + " uibutton[ui-implements=continue]";
			$(callbackSelector).bind("click", function() {
				callback.call(callback, this);
			});
		}
	});
});

$.extend($, {
	UIPopUpIsActive : false,
	UIPopUpIdentifier : null,
	UIScreenCoverIdentifier : null,
	UIShowPopUp : function( popup ) {
		$.UIPopUpIsActive = true;
		$.UIPopUpIdentifier = popup;
		var screenCover = $("screencover");
		$.UIScreenCoverIdentifier = screenCover;
		screenCover.bind("touchmove", function(e) {
			e.preventDefault();
		});
		$.UIPositionScreenCover(screenCover); 
		$.UIPositionPopUp(popup);
		screenCover.setAttribute("ui-visible-state", "visible");
		$(popup).setAttribute("ui-visible-state", "visible");
		
	},
	UIPositionScreenCover : function(screenCover) {
		screenCover.cssText = "height:" + (window.innerHeight + window.pageYOffset) + "px";
	},
	UIPositionPopUp : function(selector) {
		$.UIPopUpIsActive = true;
		$.UIPopUpIdentifier = selector;
		var popup = $(selector);
		popup.style.top = ((window.innerHeight /2) + window.pageYOffset) - (popup.clientHeight /2) + "px";
		popup.style.left = (window.innerWidth / 2) - (popup.clientWidth / 2) + "px";
	},
	UIRepositionPopupOnOrientationChange : function ( ) {
		$.body.bind("orientationchange", function() {
			if (window.orientation === 90 || window.orientation === -90) {
				if ($.UIPopUpIsActive) {
					$.UIPositionScreenCover($.UIScreenCoverIdentifier);
					$.UIPositionPopUp($.UIPopUpIdentifier);
				}
			} else {
				if ($.UIPopUpIsActive) {
					$.UIPositionScreenCover($.UIScreenCoverIdentifier);
					$.UIPositionPopUp($.UIPopUpIdentifier);
				}
			}
		});
		window.addEventListener("resize", function() {
			if ($.UIPopUpIsActive) {
				$.UIPositionScreenCover($.UIScreenCoverIdentifier);
				$.UIPositionPopUp($.UIPopUpIdentifier);
			}
		}, false);	
	}
});

$.ready(function() {
	$.UIRepositionPopupOnOrientationChange();
});

$.extend(HTMLElement.prototype, {
	UISelectionList : function ( callback ) {
		var listitems = $.collectionToArray(this.children);
		listitems.forEach(function(item) {
			if (item.nodeName.toLowerCase() === "tablecell") {
				var checkmark = "<checkmark>&#x2713</checkmark>";
				item.insert(checkmark);
				item.bind("click", function() {
					listitems.forEach(function(check) {
						check.removeClass("selected");
					});
					this.addClass("selected");
					this.last().checked = true; 
					if (callback) {
						callback.call(callback, this);
					}
				});
			}
		});
	}
});

$.extend(HTMLElement.prototype, {
	UICreateSwitchControl : function( opts ) {
		var id = opts.id;
		var customClass = opts.customClass || "";
		var status = opts.status || "off";
		var value = opts.value || "";
		var callback = opts.callback || function() { return false; };
		var uiswitch = '<switchcontrol class="' + status + customClass + '" id="' + id + '"' + '" ui-value="' + value + '"><label ui-implements="on">ON</label><thumb></thumb><label ui-implements="off">OFF</label></switchcontrol>';
		if (this.css("position")  !== "absolute") {
			this.css("position: relative;");
		}
		this.insert(uiswitch);
		var newSwitchID = "#" + id;
		this.addClass("ui-no-hover");
		$(newSwitchID).bind("click", function() {
			this.UISwitchControl(callback);
		});
	}
}); 

$.extend(HTMLElement.prototype, {
	UISwitchControl : function (callback) {
		callback = callback || function() { return false; };
		if (this.nodeName.toLowerCase()==="switchcontrol") {
			callback.call(callback, this);
			if (this.hasClass("off")) {
				this.toggleClass("on", "off");
				this.checked = true;
				this.querySelector("thumb").focus();
			} else {
				this.toggleClass("on", "off");
				this.checked = false;
			}
		} else {
			return;
		}
	}
});

$.extend(HTMLElement.prototype, {
	UIInitSwitchToggling : function() {
		$$("switchcontrol", this).forEach(function(item) {
			item.parentNode.addClass("ui-no-hover");
			if (item.hasClass("on")) {
				item.checked = true;
			} else {
				item.checked = false;
			}
			item.bind("click", function(e) {
				this.parentNode.style.backgroundImage = "none";
				e.preventDefault();
				this.UISwitchControl();
			});
		});
	}
});
$.ready(function() {
	$.app.UIInitSwitchToggling();
});

$.extend(HTMLElement.prototype, {
	UICreateSegmentedControl : function(opts, position) {
		position = position || null;
		var segmentedControl = "<segmentedcontrol";
		if (opts.id) {
			segmentedControl += " id='" + opts.id + "'";
		}
		if (opts.placement) {
			segmentedControl += " ui-bar-align='" + opts.placement + "'";
		}
		if (opts.selectedSegment) {
			segmentedControl += " ui-selected-index='" + opts.selectedSegment + "'";
		} else {
			segmentedControl += " ui-selected-index=''";
		}
		if (opts.container) {
			segmentedControl += " ui-segmented-container='#" + opts.container + "'";
		}
		var segClass = opts.cssClass || "";
		segmentedControl += "'>";
		if (opts.numberOfSegments) {
			segments = opts.numberOfSegments;
			var count = 1;
			for (var i = 0; i < segments; i++) {
				segmentedControl += "<uibutton";
				segmentedControl += " id='" + $.UIUuid() + "'";
				segmentedControl += " class='" + segClass[count-1];
				if (opts.selectedSegment) {
					if (opts.selectedSegment === i) {
						segmentedControl += " selected'";
					}
				}
				if (opts.disabledSegment) {
					if (opts.disabledSegment === i) {
						segmentedControl += " disabled'";
					}
				}
				segmentedControl += "'";
				
				segmentedControl += " ui-kind='segmented'";
				if (opts.placementOfIcons) {
					segmentedControl += " ui-icon-alignment='" + opts.placementOfIcons[count-1] + "'";
				}
				segmentedControl += ">";
				if (opts.iconsOfSegments) {
					if (!!opts.iconsOfSegments[i]) {
					segmentedControl += "<icon ui-implements='icon-mask' style='-webkit-mask-box-image: url(icons/" + opts.iconsOfSegments[count-1] +"." + opts.fileExtension[count-1] + ")'  ui-implements='icon-mask'></icon>";
					}
				}
				if (opts.titlesOfSegments) {
					segmentedControl += "<label>" + opts.titlesOfSegments[count-1] + "</label>";
				}
				segmentedControl += "</uibutton>";
				count++;
			}
			segmentedControl += "</segmentedcontrol>";
			if (position) {
				this.insert(segmentedControl, position);
			} else {
				this.insert(segmentedControl);
			}
			$("#" + opts.id).UISegmentedControl();
			if (opts.container) {
				if (opts.selectedSegment) {
					$(opts.container).children[opts.selectedSegment].css("opacity: 1; z-index: " + opts.numberOfSegments);
				} else {
					$(opts.container).children[0].css("opacity: 1; z-index: " + opts.numberOfSegments);
				}
			}
		}
	}
});

$.extend(HTMLElement.prototype, {
	UISegmentedControl : function( callback, container ) {
		var that = this;
		container = container || null;
		var val = null;
		callback = callback || function(){};
		var buttons = $.collectionToArray(this.children);
				var cont = $(container);
		if (!this.hasAttribute('ui-selected-segment')) {
			this.setAttribute("ui-selected-segment", "");
		}
		if (this.getAttribute("ui-selected-index")) {
			val = this.getAttribute("ui-selected-index");
			var seg = this.children(val);
			try {
				seg = seg.getAttribute("id");
				this.setAttribute("ui-selected-segment", seg);
				this.childred[val].addClass("selected");
			} catch(e) {}
		} else {
			var checkChildNodesForAttr = -1;
			for (var i = 0, len = this.children.length; i < len; i++) {
				if (this.children[i].hasClass("selected")) {
					this.setAttribute("ui-selected-index", i);
				} else {
					checkChildNodesForAttr++;
				}
			}
			if (checkChildNodesForAttr === this.children.length-1) {
				this.setAttribute("ui-selected-index", 0);
				this.firstElementChild.addClass("selected");
			}
		}
		if (container) {
			container = $(container);
			if (val) { 
				container.setAttribute("ui-selected-index", val);
			} else {
				container.setAttribute("ui-selected-index", 0);
			}
			var containerChildren = $.collectionToArray(container.children);
			containerChildren.forEach(function(child) {
				child.css("opacity: 0; z-index: 1;");
			});
			containerChildren[val].css("opacity: 1; z-index: " + containerChildren.length);
			that.setAttribute("ui-segmented-container", ("#" + container.id));
			var selectedIndex = this.getAttribute("ui-selected-index");
			var containerHeight = container.children[selectedIndex].css("height");
			container.style.height = containerHeight;
		}
		
		buttons.forEach(function(button) {
			if (!button.hasAttribute("id")) {
				button.setAttribute("id", $.UIUuid());
			}
			if (!that.getAttribute("ui-selected-segment")) {
				if (button.hasClass("selected")) {
					that.setAttribute("ui-selected-segment", button.getAttribute("id"));
				}
			}
			button.bind("click", function() {
				var selectedSegment = that.getAttribute("ui-selected-segment");
				var selectedIndex = that.getAttribute("ui-selected-index");
				var childPosition = null;
				var container = null;
				var ancestor = this.ancestor("segmentedcontrol");
				if (ancestor.hasAttribute("ui-segmented-container")) {
					container = ancestor.getAttribute("ui-segmented-container");
				}
				var oldSelection = null;
				if (ancestor.hasAttribute("ui-selected-index")) {
					oldSelection = ancestor.getAttribute("ui-selected-index");
				}
				var uisi = null;
				if (!selectedSegment) {
					uisi = this.getAttribute("ui-child-position");
					that.setAttribute("ui-selected-index", uisi);
					that.setAttribute("ui-selected-segment", this.getAttribute("id"));
					this.addClass("selected");
					childPosition = this.getAttribute("ui-child-position");
					container.children[val].css("opacity: 0; z-index: 1;");
					container.children[childPosition].css("opacity: 0; z-index: " + val);
				} 
				if (selectedSegment) {
					uisi = this.getAttribute("ui-child-position");
					that.setAttribute("ui-selected-index", uisi);
					var oldSelectedSegment = $(("#" + selectedSegment));
					oldSelectedSegment.removeClass("selected");
					that.setAttribute("ui-selected-segment", this.getAttribute("id"));
					this.addClass("selected");
					childPosition = this.getAttribute("ui-child-position");
					if (that.getAttribute("ui-segmented-container")) {
						container = $(that.getAttribute("ui-segmented-container"));
						container.children(oldSelection).css("opacity: 0; z-index: 1;");
						container.children(uisi).css("opacity: 1; z-index: 3;");
						container.children[oldSelectedSegment.getAttribute("ui-child-position")].css("{z-index: 1;}");
						container.children[childPosition].css("z-index: " + container.children.length);
						container.style.height = container.children[childPosition].css("height");
						var scrollpanel = container.ancestor("scrollpanel");
						var scroller = new $.UIScroll(scrollpanel, { desktopCompatibility: true });
					}
				}
				this.addClass("selected");
					callback.call(callback, button);
			});
		});
		this.UIIdentifyChildNodes();
	}
});

$.ready(function() {   
	$$("segmentedcontrol").forEach(function(segmentedcontrol) {
		if (segmentedcontrol.getAttribute("ui-implements") !== "segmented-paging") {
			segmentedcontrol.UISegmentedControl();
			var scroller = segmentedcontrol.ancestor("scrollpanel").getAttribute("ui-scroller");
			$.UIScrollers[scroller].destroy();
			$.UIScrollers[scroller] = new $.UIScroll(segmentedcontrol.ancestor("scrollpanel").parentNode); 
		}
	});
});

$.extend(HTMLElement.prototype, {
	UISegmentedPagingControl : function ( ) {
		var segmentedPager = $("segmentedcontrol[ui-implements=segmented-paging]");
		var pagingOrientation = segmentedPager.getAttribute("ui-paging");
		segmentedPager.setAttribute("ui-paged-subview", 0);
		segmentedPager.first().addClass("disabled");
		var subviews = $$("subview", this);
		segmentedPager.setAttribute("ui-pagable-subviews", subviews.length);
		var childPosition = 0;
		subviews.forEach(function(item) {
			item.setAttribute("ui-navigation-status", "upcoming");
			item.setAttribute("ui-child-position", childPosition);
			childPosition++;
			item.setAttribute("ui-paging-orient", pagingOrientation);
		});
		subviews[0].setAttribute("ui-navigation-status", "current");
		segmentedPager.delegate("uibutton", "click", function(button) {
			var pager = button.ancestor("segmentedcontrol");
			if (button.isSameNode(button.parentNode.firstElementChild)) {
				if (pager.getAttribute("ui-paged-subview") === 1) {
					button.addClass("disabled");
					pager.setAttribute("ui-paged-subview", 0);
					subviews[0].setAttribute("ui-navigation-status", "current");
					subviews[1].setAttribute("ui-navigation-status", "upcoming");
				} else {
					subviews[pager.getAttribute("ui-paged-subview") - 1 ].setAttribute( "ui-navigation-status", "current");
					subviews[pager.getAttribute("ui-paged-subview")].setAttribute("ui-navigation-status", "upcoming");
					pager.setAttribute("ui-paged-subview", pager.getAttribute("ui-paged-subview")-1);
					button.next().removeClass("disabled");
					if (pager.getAttribute("ui-paged-subview") <= 0) {
						button.addClass("disabled");
					}
				}
			} else {
				var pagableSubviews = pager.getAttribute("ui-pagable-subviews");
				var pagedSubview = pager.getAttribute("ui-paged-subview");
				if (pager.getAttribute("ui-paged-subview") == pagableSubviews-1) {
					button.addClass("disabled");
				} else {
					button.previous().removeClass("disabled");
					subviews[pagedSubview].setAttribute("ui-navigation-status", "traversed");
					subviews[++pagedSubview].setAttribute("ui-navigation-status", "current");
					pager.setAttribute("ui-paged-subview", (pagedSubview));
					if (pager.getAttribute("ui-paged-subview") == pagableSubviews-1) {
						button.addClass("disabled");
					}
				}
			}
		});
	}
});

$.extend(HTMLElement.prototype, {
	UICreateTabBar : function ( opts ) {
		var id = opts.id || $.UIUuid();
		var imagePath = opts.imagePath || "icons\/";
		var numberOfTabs = opts.numberOfTabs || 1;
		var tabLabels = opts.tabLabels;
		var iconsOfTabs = opts.iconsOfTabs;
		var selectedTab = opts.selectedTab || 0;
		var disabledTab = opts.disabledTab || null;
		var tabbar = "<tabbar ui-selected-tab='" + selectedTab + "'>";
		this.setAttribute("ui-tabbar-id", id);
		for (var i = 0; i < numberOfTabs; i++) {
			tabbar += "<uibutton ui-implements='tab' ";
			if (i === selectedTab || i === disabledTab) {
				tabbar += "class='";
				if (i === selectedTab) {
					tabbar += "selected";
				}
				if (i === disabledTab) {
					tabbar += "disabled";
				}
				tabbar += "'";
			}
			tabbar += "><icon style='-webkit-mask-box-image: url(" + imagePath;
			tabbar += iconsOfTabs[i] + ".svg);'></icon>";
			tabbar += "<label>" + tabLabels[i] + "</label></uibutton>";
		}
		tabbar += "</tabbar>";
		this.insert(tabbar);
		var subviews = $$("subview", this);
		subviews[selectedTab].addClass("selected");
		this.UITabBar();
	},

	UITabBar : function ( ) {
		var tabs = $$("tabbar > uibutton[ui-implements=tab]", this);
		$("tabbar", this).UIIdentifyChildNodes();
		var tabbar = $("tabbar", this);
		var subviews = $$("subview", this);
		subviews.forEach(function(subview) {
			subview.addClass("unselected");
		});
		var selectedTab = tabbar.getAttribute("ui-selected-tab") || 0;
		subviews[selectedTab].toggleClass("unselected","selected");
		tabs[selectedTab].addClass("selected");
		tabs.forEach(function(tab) {
			tab.bind("click", function() {
				if (tab.hasClass("disabled") || tab.hasClass("selected")) {
					return;
				}
				var whichTab = tab.ancestor("tabbar").getAttribute("ui-selected-tab");
				tabs[whichTab].removeClass("selected");
				tab.addClass("selected");
				subviews[whichTab].removeClass("selected");
				subviews[whichTab].addClass("unselected");
				subviews[tab.getAttribute("ui-child-position")].addClass("selected");
				subviews[tab.getAttribute("ui-child-position")].removeClass("unselected");
				tabbar.setAttribute("ui-selected-tab", tab.getAttribute("ui-child-position"));
			});
		});
	},

	UITabBarForViews : function ( ) {
		var tabs = $$("tabbar > uibutton[ui-implements=tab]", this);
		$("tabbar", this).UIIdentifyChildNodes();
		var tabbar = $("tabbar", this);
		var views = $$("view[ui-implements=tabbar-panel]", this);
		views.forEach(function(subview) {
			subview.setAttribute("ui-navigation-status","upcoming");
		});
		var selectedTab = tabbar.getAttribute("ui-selected-tab") || 0;
		views[selectedTab].setAttribute("ui-navigation-status","current");
		tabs[selectedTab].addClass("selected");
		tabs.forEach(function(tab) {
			tab.bind("click", function() {
				if (tab.hasClass("disabled") || tab.hasClass("selected")) {
					return;
				}
				var whichTab = tab.ancestor("tabbar").getAttribute("ui-selected-tab");
				tabs[whichTab].removeClass("selected");
				tab.addClass("selected");
				views[whichTab].setAttribute("ui-navigation-status", "upcoming");
				views[tab.getAttribute("ui-child-position")].setAttribute("ui-navigation-status", "current");
				tabbar.setAttribute("ui-selected-tab", tab.getAttribute("ui-child-position"));
			});
		});
	}
});

$.extend(HTMLElement.prototype, {
	UIActionSheet : function(opts) {
		var that = this;
		var actionSheetID = opts.id;
		var actionSheetColor = "undefined";
		if (!!opts.color) {
			actionSheetColor = opts.color;
		}
		
		$.body.UIScreenCover();
		var createActionSheet = function() {
			var actionSheetStr = "<actionsheet id='" + actionSheetID + "' class='hidden' ui-contains='action-buttons'";
			if (actionSheetColor) {
				actionSheetStr += " ui-action-sheet-color='" + actionSheetColor + "'";
			}
			actionSheetStr += "><scrollpanel>";
			var uiButtons = "", uiButtonObj, uiButtonImplements, uiButtonTitle, uiButtonCallback;
			if (!!opts.uiButtons) {
				for (var i = 0, len = opts.uiButtons.length; i < len; i++) {
					uiButtonObj = opts.uiButtons[i];
					uiButtons += "<uibutton ui-kind='action' ";
					uiButtonTitle = uiButtonObj.title;
					uiButtonImplements = uiButtonObj.uiButtonImplements || "";
					uiButtonCallback = uiButtonObj.callback;
					actionSheetID.trim();
					actionSheetID.capitalize();
					uiButtons += ' ui-implements="' + uiButtonImplements + '" class="stretch" onclick="' + uiButtonCallback + '(\'#' + actionSheetID + '\')"><label>';
					uiButtons += uiButtonTitle;
					uiButtons +=	"</label></uibutton>"	;			
				}
			}
			actionSheetStr += uiButtons + "<uibutton ui-kind='action' ui-implements='cancel' class='stretch' onclick='$.UIHideActionSheet(\"#" + actionSheetID + "\")'><label>Cancel</label></uibutton></scrollpanel></actionsheet>";
			var actionSheet = $.make(actionSheetStr);
			that.insert(actionSheet, "last");
		};
		createActionSheet();
		var actionSheetUIButtons = "#" + actionSheetID + " uibutton";
		$$(actionSheetUIButtons).forEach(function(button) {
			button.bind("click", function() {
				$.UIHideActionSheet();
			});
		});
		var myScroll = new $.UIScroll($("#" + actionSheetID + " > scrollpanel"), { desktopCompatibility: true });
	}
});
$.extend($, {
	
	UIShowActionSheet : function(actionSheetID) {
		$.app.data("ui-action-sheet-id", actionSheetID);
		window.scrollTo(0,1);
		var screenCover = $("body > screencover");
		screenCover.css("width: '" + window.innerWidth + "px; height: " + window.innerHeight + "px;");
		screenCover.setAttribute("ui-visible-state", "visible");
		$(actionSheetID).removeClass("hidden");
		screenCover.addEventListener("touchmove", function(e) {
			e.preventDefault();
		}, false );
	},
	UIHideActionSheet : function() {
		var actionSheet = $.app.data("ui-action-sheet-id");
		$("screencover").setAttribute("ui-visible-state", "hidden");
		try{ $(actionSheet).addClass("hidden"); } catch(e) {}
		$.app.removeData("ui-action-sheet-id");
	},
	UIReadjustActionSheet : function() {
		var actionSheetID = "";
		if ($.app.data("ui-action-sheet-id")) {
			actionSheetID = $.app.data("ui-action-sheet-id");
			if (!$.standalone) {
				$(actionSheetID).css("right: 0; bottom: -60px; left: 0;");
			} else {
				$(actionSheetID).css("right: 0; bottom: -10px; left: 0;");
			}
		}
	}
});
document.addEventListener("orientationchange", function() {
	$.UIReadjustActionSheet();
}, false);

$.extend(HTMLElement.prototype, {
	UIExpander : function ( opts ) {
		opts = opts || {};
		var status = opts.status || "expanded";
		var title = opts.title || "Open";
		var altTitle = opts.altTitle || "Close";
		var expander = this;
		var panel = $("panel", this);
		var header = "<header><label></label></header>";
		this.insert(header, "first");
		panel.setAttribute("ui-height", parseInt(panel.css("height"), 10));
		if (status === "expanded") {
			expander.toggleClass("ui-status-expanded", "ui-status-collapsed");
			$("label", this).text(altTitle);
			panel.style.height = panel.getAttribute("ui-height") + "px";
			panel.css("opacity: 1;");
		} else {
			$("label", this).text(title);
			panel.css("height: 0px; opacity: 0;");
			expander.toggleClass("ui-status-collapsed", "ui-status-expanded");
		}
		$("header", expander).bind("click", function() {
			if (panel.style.height === "0px") {
				panel.style.height = panel.getAttribute("ui-height") + "px";
				panel.style.opacity = 1;
				$("label", this).text(altTitle);
				expander.toggleClass("ui-status-collapsed", "ui-status-expanded");
				
			} else {
				panel.css("height: 0px; opacity: 0;");
				$("label", this).text(title);
				expander.toggleClass("ui-status-expanded", "ui-status-collapsed");
			}
		});
	}
});
$.extend(HTMLElement.prototype, {
	UICalculateNumberOfLines : function () {
		var lineHeight = parseInt(this.css("line-height"), 10);
		var height = parseInt(this.css("height"), 10);
		var lineNums = Math.floor(height / lineHeight);
		return lineNums;
	},
	UIParagraphEllipsis : function () {
		var lines = this.UICalculateNumberOfLines();
		this.css("-webkit-line-clamp:" + lines);
	}
});
$.extend(HTMLElement.prototype, {
	UIProgressBar : function ( opts ) {
		opts = opts || {};
		var className = opts.className || false;
		var width = opts.width || 100;
		var speed = opts.speed || 5;
		var position = opts.position || "after";
		var margin = opts.margin || "10px auto";
		var bar = "<progressbar";
		if (className) {
			bar += " class='" + className + "'";
		}
		bar += " style='width: " + width + "px;";
		bar += " -webkit-animation-duration: " + speed +"s;";
		bar += " margin: " + margin + ";'";
		bar += "></progressbar>";
		this.insert(bar);
	},
	UIHideNavBarHeader : function ( ) {
		this.css("visibility: hidden; position: absolute;");
	},
	UIShowNavBarHeader : function ( ) {
		this.css("visibility: visible; position: static;");
	}
});
$.extend($, {
	UIAdjustToolBarTitle : function() {
		$$("navbar h1").forEach(function(title) {
			var availableSpace = window.innerWidth;
			var siblingLeftWidth = 0;
			var siblingRightWidth = 0;
			var subtractableWidth = 0;
			siblingLeftWidth = title.previousElementSibling ? title.previousElementSibling.clientWidth : 0;
			siblingRightWidth = title.nextElementSibling ? title.nextElementSibling.clientWidth : 0;
			if (siblingLeftWidth > siblingRightWidth) {
				subtractableWidth = siblingLeftWidth * 2;
			} else {
				subtractableWidth = siblingRightWidth * 2;
			}
			if (subtractableWidth > 0) {
				if((availableSpace - subtractableWidth) < 40) {
					
					title.css("display: none;");
				} else {
					title.css("display: block; width: " + (availableSpace - subtractableWidth - 20) + "px;");
				}
			}
		});
	}
});
document.addEventListener("DOMContentLoaded", function() {
	if (!$("splitview")) {
		$.UIAdjustToolBarTitle();
	}
}, false);
document.addEventListener("orientationchange", function() {
	if (!$("splitview")) {
		$.UIAdjustToolBarTitle();
	}
}, false);
window.addEventListener("resize", function() {
	if (!$("splitview")) {
		$.UIAdjustToolBarTitle();
	}
}, false);

$.UIActivityIndicator = function() {};
$.extend($.UIActivityIndicator.prototype, {
	id : null,
	color : null,
	shadow : null,
	container : null,
	size : null,
	init : function(opts) {
		if (opts) {
			this.id = opts.id || "UIActivityIndicator";
			this.color = opts.color || "gray";
			if (!!opts.shadow) {
				this.shadow = opts.shadow;
			}
			this.container = opts.container;
			this.size = opts.size || "75%";
		}
		$(this.container).css("background-position: center 70%; background-repeat: no-repeat; background-image: -webkit-canvas(" + this.id + "); background-size: " + this.size + " " + this.size);
		this.context = document.getCSSCanvasContext("2d", this.id, 37, 37);
		this.context.lineWidth = 3;
		this.context.lineCap = "round";
		this.context.strokeStyle = this.color;
		if (this.shadow) {
			this.context.shadowOffsetX = 1;
			this.context.shadowOffsetY = 1;
			this.context.shadowBlur = 2;
			this.context.shadowColor = this.shadow;
		}
		this.step = 0;
		this.timer = null;
	},
	draw : function() {
		this.context.clearRect(0, 0, 137, 37);
		this.context.save();
		this.context.translate(18, 18);
		this.context.rotate(this.step * Math.PI / 180);
		for (var i = 0; i < 12; i++) {
			this.context.rotate(30 * Math.PI / 180);
			this.drawLine(i);
		}
		this.context.restore();
		this.step += 30;
		if (this.step === 360) {
			this.step = 0;
		}
	},
	drawLine : function(i) {
		this.context.beginPath();
		this.context.globalAlpha = i / 12;
		this.context.moveTo(0, 8 + 1);
		this.context.lineTo(0, 16 - 1);
		this.context.stroke();
	},
	stop : function() {
		if (this.timer) {
			this.context.clearRect(0, 0, 37, 37);
			window.clearInterval(this.timer);
			this.timer = null;
		}
	},
	animate : function() {
		if (this.timer) {
			return;
		}
		var that = this;
		this.timer = window.setInterval(function() {
			that.draw();
		}, 100);
	}
});

$.extend(HTMLElement.prototype, {
	UIInsertActivityIndicator : function ( opts ) {
		this.insert("<panel style='height: " + opts.size + "; width: " + opts.size + ";" + opts.style + "'></panel>");
		var ai = new $.UIActivityIndicator();
		ai.init(opts);
		ai.animate();
	}
});

$.extend($, {
	UICurX : null,
	UICurY : null,
	UISliderThumbWidth : null,
	UISliderValue : null,
	UISlider : function( selector, opts ) {
		var startValue = null;
		var callback = opts.callback || function() {};
		if (opts.startValue) {
			startValue = opts.startValue;
		}
		var sliderLength = $(selector).clientWidth;
		if (startValue) {
			$("thumb", selector).css("left: " + startValue + "px;");
			$(selector).css("background-size: " + (startValue + 2) + "px 9px, 100% 9px;");				
		}
		$(selector).setAttribute("ui-slider-length", sliderLength);
		if ("createTouch" in document) {
			 var thumb = $(selector + " > thumb");
			 thumb.bind("touchmove", function(thumb) {
				 this.UISliderTouch(event);
				 this.UIUpdateSliderTouch(callback);
			 }); 
		} else {
			$.UISliderForMouse(selector, opts);
		}
	}
});

$.extend(HTMLElement.prototype, {
	UISliderTouch : function( event ) {
		event.preventDefault();
		var sliderLength = this.parentNode.getAttribute("ui-slider-length");
		var touch = event.touches[0];
		$.UICurX = touch.pageX - this.parentNode.offsetLeft - $.UISliderThumbWidth;
		var sliderThumbWidth = this.css("width");
		sliderThumbWidth = parseInt(sliderThumbWidth, 10);
		$.UISliderValue = $.UICurX + sliderThumbWidth;
		if ($.UICurX <= 0 - (sliderThumbWidth/2)) { 
			$.UICurX = 0 - (sliderThumbWidth/2);
		}
		if ($.UICurX > sliderLength - 12) {
			$.UICurX = sliderLength -12;
		} 
	},
	
	UIUpdateSliderTouch : function( callback ) {
		callback = callback || function() {};
		this.style.left = $.UICurX - $.UISliderThumbWidth + 'px'; 
		callback();
		this.parentNode.css("-webkit-background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;");
		this.parentNode.css("background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;");
	}
});
	
$.UIDrag = {
	obj: null,
	init: function(elem, elemParent, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef) {
		elem.onmousedown = $.UIDrag.start;
		elem.hmode = bSwapHorzRef ? false : true ;
		elem.vmode = bSwapVertRef ? false : true ;
		elem.root = elemParent && elemParent !== null ? elemParent : elem ;
		if (elem.hmode && isNaN(parseInt(elem.root.style.left, 10))) {
		   elem.root.style.left = elem.root.css("left");
		}
		if (elem.vmode && isNaN(parseInt(elem.root.style.top, 10))) {
		   elem.root.style.top = elem.root.css("top");
		}
		if (!elem.hmode && isNaN(parseInt(elem.root.style.right, 10))) {
		   elem.root.style.right = elem.root.css("right");
		}
		if (!elem.vmode && isNaN(parseInt(elem.root.style.bottom, 10))) {
		   elem.root.style.bottom = elem.root.css("bottom");
		}
		elem.minX = typeof minX !== 'undefined' ? minX : null;
		elem.minY = typeof minY !== 'undefined' ? minY : null;
		elem.maxX = typeof maxX !== 'undefined' ? maxX : null;
		elem.maxY = typeof maxY !== 'undefined' ? maxY : null;
		elem.root.onDragStart = function() {};
		elem.root.onDragEnd	 = function() {};
		elem.root.onDrag = function() {};
	},
	start: function(e) {
		var elem = $.UIDrag.obj = this;
		e = $.UIDrag.fixE(e);
		$.UIDrag.y = parseInt(elem.vmode ? elem.root.style.top	: elem.root.style.bottom, 10);
		$.UIDrag.x = parseInt(elem.hmode ? elem.root.style.left : elem.root.style.right, 10);
		elem.root.onDragStart($.UIDrag.x, $.UIDrag.y);
		elem.lastMouseX = e.clientX;
		elem.lastMouseY = e.clientY;
		if (elem.hmode) {
			if (elem.minX !== null) elem.minMouseX	  = e.clientX - $.UIDrag.x + elem.minX;
			if (elem.maxX !== null) elem.maxMouseX	  = elem.minMouseX + elem.maxX - elem.minX;
		} else {
			if (elem.minX !== null) elem.maxMouseX = -elem.minX + e.clientX + $.UIDrag.x;
			if (elem.maxX !== null) elem.minMouseX = -elem.maxX + e.clientX + $.UIDrag.x;
		}
		if (elem.vmode) {
			if (elem.minY !== null) elem.minMouseY	  = e.clientY - $.UIDrag.y + elem.minY;
			if (elem.maxY !== null) elem.maxMouseY	  = elem.minMouseY + elem.maxY - elem.minY;
		} else {
			if (elem.minY !== null) elem.maxMouseY = -elem.minY + e.clientY + $.UIDrag.y;
			if (elem.maxY !== null) elem.minMouseY = -elem.maxY + e.clientY + $.UIDrag.y;
		}
		
		document.onmousemove = $.UIDrag.drag;
		document.onmouseup = $.UIDrag.end;
		return false;
	},
	drag: function(e) {
		e = $.UIDrag.fixE(e);
		var elem = $.UIDrag.obj;
		var ey = e.clientY;
		var ex = e.clientX;
		$.UIDrag.y = parseInt(elem.vmode ? elem.root.style.top	: elem.root.style.bottom, 10);
		$.UIDrag.x = parseInt(elem.hmode ? elem.root.style.left : elem.root.style.right, 10);
		var nx, ny;
		if (elem.minX !== null) ex = elem.hmode ? 
			Math.max(ex, elem.minMouseX) : Math.min(ex, elem.maxMouseX);
		if (elem.maxX !== null) ex = elem.hmode ? 
			Math.min(ex, elem.maxMouseX) : Math.max(ex, elem.minMouseX);
		if (elem.minY !== null) ey = elem.vmode ? 
			Math.max(ey, elem.minMouseY) : Math.min(ey, elem.maxMouseY);
		if (elem.maxY !== null) ey = elem.vmode ? 
			Math.min(ey, elem.maxMouseY) : Math.max(ey, elem.minMouseY);
		nx = $.UIDrag.x + ((ex - elem.lastMouseX) * (elem.hmode ? 1 : -1));
		ny = $.UIDrag.y + ((ey - elem.lastMouseY) * (elem.vmode ? 1 : -1));
		$.UICurX = nx;
		$.UISliderValue = nx + (Math.round($.UISliderThumbWidth));
		$.UICurY = ny;
		$.UIDrag.obj.root.style[elem.hmode ? "left" : "right"] = nx + "px";
		$.UIDrag.obj.root.style[elem.vmode ? "top" : "bottom"] = ny + "px";
		$.UIDrag.obj.lastMouseX = ex;
		$.UIDrag.obj.lastMouseY = ey;
		$.UIDrag.obj.root.onDrag(nx, ny);
		$.UIDrag.updateSliderProgressIndicator($.UICurX);
		return false;
	},
	
	end: function() {
		document.onmousemove = null;
		document.onmouseup = null;
		$.UIDrag.obj.root.onDragEnd( 
			parseInt($.UIDrag.obj.root.style[$.UIDrag.obj.hmode ? "left" : "right"], 10), 
			parseInt($.UIDrag.obj.root.style[$.UIDrag.obj.vmode ? "top" : "bottom"], 10));
		$.UIDrag.obj = null;
	},
	
	fixE: function(e) {
		if (typeof e.elemX === 'undefined') e.elemX = e.offsetX;
		if (typeof e.elemY === 'undefined') e.elemY = e.offsetY;
		return e;
	}, 
	updateSliderProgressIndicator : function() {
		$.UIDrag.obj.parentNode.css("-webkit-background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;");
		$.UIDrag.obj.parentNode.css("background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;");
	}
};	

$.extend($, {
	UISliderForMouse : function ( selector, opts ) {
		opts = opts || {};
		var thumb = $("thumb", selector);
		var slider = $(selector);
		var thumbWidth = parseInt(thumb.css("width"),10);
		var sliderWidth = parseInt(slider.css("width"),10);
		var sliderHeight = parseInt(slider.css("height"),10);
		var padding = parseInt(slider.css("padding-right"),10);
		var border = parseInt(slider.css("border-right-width"),10);
		sliderWidth -= padding;
		sliderWidth -= border;
		sliderWidth -= $.UISliderThumbWidth;
		
		
		var thumbDetuct = Math.round(thumbWidth/2);
		$.UISliderThumbWidth = thumbDetuct;
		var negLeft = (0 - $.UISliderThumbWidth);
		$.UIDrag.init(thumb, null, -$.UISliderThumbWidth, sliderWidth - (Math.round(thumbWidth/2)), opts.top, opts.top);
		thumb.onDrag = function() {
			if (opts.callback) {
				opts.callback();
				slider.UIUpdateSliderTouch();
			}
			// Temporary fix for horizontal slider thumb drag:
			this.style.top = -sliderHeight + "px";
		};
	}
});

$.extend(HTMLElement.prototype, {
	UISetTranstionType : function( transtion ) {
		this.setAttribute("ui-transition-type", transtion);
	},
	UIFlipSubview : function ( direction ) {
		var view = this.ancestor("view");
		view.UISetTranstionType("flip-" + direction);
		this.bind("click", function() {
			switch (direction) {
				case "right":
					$("subview:nth-of-type(1)", view).toggleClass("flip-right-front-in","flip-right-front-out");
					$("subview:nth-of-type(2)", view).toggleClass("flip-right-back-in","flip-right-back-out");
					break;
				case "left":
					$("subview:nth-of-type(1)", view).toggleClass("flip-left-front-in","flip-left-front-out");
					$("subview:nth-of-type(2)", view).toggleClass("flip-left-back-in","flip-left-back-out");
					break;
				case "top":
					$("subview:nth-of-type(2)", view).toggleClass("flip-top-front-in","flip-top-front-out");
					$("subview:nth-of-type(1)", view).toggleClass("flip-top-back-in","flip-top-back-out");
					break;
				case "bottom":
					$("subview:nth-of-type(2)", view).toggleClass("flip-bottom-front-in","flip-bottom-front-out");
					$("subview:nth-of-type(1)", view).toggleClass("flip-bottom-back-in","flip-bottom-back-out");
					break;
				default:
					$("subview:nth-of-type(1)", view).toggleClass("flip-right-front-in","flip-right-front-out");
					$("subview:nth-of-type(2)", view).toggleClass("flip-right-back-in","flip-right-back-out");
			}
		});
	},
	UIPopSubview : function ( ) {
		var view = this.ancestor("view");
		view.UISetTranstionType("pop");
		this.bind("click", function() {
			$("subview:nth-of-type(2)", view).toggleClass("pop-in","pop-out");	
		});
	},
	
	UIFadeSubview : function ( ) {
		var view = this.ancestor("view");
		view.UISetTranstionType("fade");
		view.setAttribute("ui-transition-type", "fade");
		this.bind("click", function() {
			$("subview:nth-of-type(2)", view).toggleClass("fade-in", "fade-out");
		});
	},
	UISpinSubview : function ( direction ) {
		var view = this.ancestor("view");
		view.UISetTranstionType("spin");
		if (!direction || direction === "left") {
			this.UISetTranstionType("left");
			this.bind("click", function() {
				$("subview:nth-of-type(2)", view).toggleClass("spin-left-in", "spin-left-out");
			});
		} else if (direction === "right") {
			this.UISetTranstionType("right");
			this.bind("click", function() {
				$("subview:nth-of-type(2)", view).toggleClass("spin-right-in", "spin-right-out");
			});
		} else {
			this.UISetTranstionType("left");
			this.bind("click", function() {
				$("subview:nth-of-type(2)", view).toggleClass("spin-left-in", "spin-left-out");
			});
		}
	}
});
$.ready(function() {
	$.extend($, {
		UISplitViewScroller1 : null,
		UISplitViewScroller2 : null,
		body : $("body"),
		rootview : $("rootview"),
		resizeEvt : ('onorientationchange' in window ? 'orientationchange' : 'resize'),
		UISplitView : function ( ) {	
			$.UISplitViewScroller1 = new $.UIScroll('#scroller1 > scrollpanel');
			$.UISplitViewScroller2 = new $.UIScroll('#scroller2 > scrollpanel');		
			var buttonLabel = $("rootview > panel > view[ui-navigation-status=current] > navbar").text();
			$("detailview > navbar").insert("<uibutton id ='showRootView'  class='navigation' ui-bar-align='left'>"+buttonLabel+"</uibutton>", "first");
			if (window.innerWidth > window.innerHeight) {
				$.body.className = "landscape";
				$.rootview.css("display: block; height: 100%; margin-bottom: 1px;");
				$("#scroller1").css("overflow: hidden; height: " + ($.rootview.innerHeight - 45) + "px;");
			} else {
				$.body.className = "portrait";
				$.rootview.css("display: none; height: " + (window.innerHeight - 100) + "px;");
				$("#scroller1").css("overflow: hidden; height: " + (window.innerHeight - 155) + "px;");
			}
		},
		
		UISetSplitviewOrientation : function() {
			if ($.resizeEvt) {
				if (window.innerWidth > window.innerHeight) {
					$.body.className = "landscape";
					$.rootview.css("{display: block; height: 100%; margin-bottom: 1px;}");
					$("#scroller1").css("overflow: hidden; height: 100%;");
				} else {
					$.body.className = "portrait";
					$.rootview.css("display: none; height: " + (window.innerHeight - 100) + "px;");
					$("#scroller1").css("overflow: hidden; height:" + (window.innerHeight - 155) + "px;");
				}
			}
		},
		
		UIToggleRootView : function() {
			if ($.rootview.style.display === "none") {
				$.rootview.css("display: block;");
				$.UISplitViewScroller1.destroy();
				$.UISplitViewScroller2.destroy();
				$.UISplitViewScroller1 = new $.UIScroll('#scroller1 > scrollpanel');
				$.UISplitViewScroller2 = new $.UIScroll('#scroller2 > scrollpanel');
			} else {
				$.rootview.style.display = "none";
				$.UISplitViewScroller1.destroy();
				$.UISplitViewScroller2.destroy();
				$.UISplitViewScroller1 = new $.UIScroll('#scroller1 > scrollpanel');
				$.UISplitViewScroller2 = new $.UIScroll('#scroller2 > scrollpanel');
			}
		},
		
		UICheckForSplitView : function ( ) {
			if ($("splitview")) {
				$.UISplitView();
				$("#showRootView").bind("click", function() {
					$.UIToggleRootView();
				});
				$.body.onorientationchange = function(){
					$.UISetSplitviewOrientation();
				};
				window.onresize = function() {
					$.UISetSplitviewOrientation();
				};
			}
		}
	});
	$.UICheckForSplitView();
});