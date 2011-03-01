/*
    pO\     
   6  /\
     /OO\
    /OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/   
 
ChocolateChip-UI
Thee yummy ingredients make this something to sink your teeth into:
ChococlateChip.js: It's tiny but delicious
ChUI.css: Good looks do impress
ChUI.js: The magic to make it happen
Also staring WAML--Web App Markup Language: no more masquerade as a Web page.
WAML makes coding a Web app logical and straightforward, the way it was meant to be.

Copyright 2011 Robert Biggs: www.chocolatechip-ui.com
License: BSD
Version: 0.5 beta
Dependencies: chocolatechip.1.1.2.js or later, chui.0.5.css

*/

/*

Available modules (Resered modules never need be invoked by the developer, 
they are used internally by the framework):
   
$.UIButton (reserved) #
$.UIBackNavigation (reserved) #
$.UINavigationList (reserved) #
$.UITableView (reserved) #
$.UIScrollControl #
$.UIScrollBar (reserved) #
$.UITableCellDeletion #
Element.UIScreenCover (reserved) #
$.UIPopUp #
$.UIShowPopUp #
$.UISelectionList #
$.UIToggleSwitchControl (reserved) #
$.UICreateSwitchControl #
Element.UICreateSegmentedControl #
$.UISegmentedControl #
Element.UICreatePicker 
$.UIActionSheet #
$.UIActionSheet.show #
$.UIActionSheet.hide #
$.UIActionSheet.adjustActionSheet (reserved) #
$.UIPositionActionSheet #
$.UIAdjustToolBarTitle (reserved) #
$.UIActivityIndicator #
$.UISlider #
   
=====================
For the next release:
=====================
$.UIPicker
$.UITabBar
$.UIToolBarPageControl
$.UIPageControl
$.UIPopover
$.UIViewTransition
$.UIExpando
$.UIAccordion
$.UISplitter
$.UIProgressBar
$.UITableCellMove
$.UIGallery

*/

$.ready(function() {
	
	const UIExpectedChocolateChipJSVersion = "1.1.2";
	
	UICheckChocolateChipJSVersion = function() {
		if ($.version !== UIExpectedChocolateChipJSVersion) {
			console.error("This version of ChocolateChip-UI requries ChococlateChip.js version " + UIExpectedChocolateChipJSVersion + "!");
		}
	};
	UICheckChocolateChipJSVersion();
	
	$.extend($, {
		UIVersion : "0.5beta",
		
		UITouchedButton : null,
		
		UIButton : function() {
			$.app.delegate("uibutton", "touchstart", function(button) {
				if (!$.UITouchedButton) {
					$.UITouchedButton = button;
					button.addClass("touched");
				} else {
					$.UITouchedButton.removeClass("touched");
					$.UITouchedButton = button;
					button.addClass("touched");
				}
			});
			
		}
	});
	$.UIButton();

	$.extend($, {
		UINavigationHistory : ["#main"],
		UIBackNavigation : function() {
			$.app.delegate("uibutton", "click", function(item) {
				if (item.getAttribute("ui-implements") === "back") {
					var parent = $.UINavigationHistory[$.UINavigationHistory.length-1];
					$.UINavigationHistory.pop();
					$($.UINavigationHistory[$.UINavigationHistory.length-1])
					.setAttribute("ui-navigation-status", "current");
					$(parent).setAttribute("ui-navigation-status", "upcoming");
					$.UIHideURLbar();
				}
			});
		}
	});
	$.UIBackNavigation();
	
	$.extend($, {
		UINavigationList : function() {
			$.app.delegate("tablecell", "click", function(item) {
				if (item.hasAttribute("href")) {
					$(item.getAttribute("href")).setAttribute("ui-navigation-status", "current");
					$($.UINavigationHistory[$.UINavigationHistory.length-1]).setAttribute("ui-navigation-status", "traversed");
					if (!$("#main").getAttribute("ui-navigation-status") === "traversed") {
						$("#main").setAttribute("ui-navigation-status", "traversed");
					}
					$.UINavigationHistory.push(item.getAttribute("href"));
					$.UIHideURLbar();	
				}
			});
		}
	});
	$.UINavigationList();
		
	$.extend($, {
		UITouchedTableCell : null,
		
		UITableview : function() {
			$.app.delegate("tablecell", "touchstart", function(item) {
				if (!$.UITouchedTableCell) {
					$.UITouchedTableCell = item;
					item.addClass("touched");
				} else {
					$.UITouchedTableCell.removeClass("touched");
					item.addClass("touched");
					$.UITouchedTableCell = item;
				}
			});
			
		}
	});
	$.UITableview();
	
});

// Based on iScroll by Matteo Spinelli: www.cubiq.com
$.extend($, {
	UIScrollControl : function (el, options) {
		var that = this, i;
		that.element = typeof el == 'object' ? el : $(el);
		that.wrapper = that.element.parentNode;
		that.element.style.webkitTransitionProperty = '-webkit-transform';
		that.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
		that.element.style.webkitTransitionDuration = '0';
		that.element.style.webkitTransform = $.UI_TranslateOpen + '0,0' + $.UI_TranslateClose;

		that.options = {
			bounce: $.UI_Supports3D,
			momentum: $.UI_Supports3D,
			checkDOMChanges: true,
			topOnDOMChanges: false,
			hScrollbar: $.UI_Supports3D,
			vScrollbar: $.UI_Supports3D,
			fadeScrollbar: $.iphone || $.ipad || !$.UI_TouchEnabled,
			shrinkScrollbar: $.iphone || $.ipad || !$.UI_TouchEnabled,
			desktopCompatibility: false,
			overflow: 'hidden',
			snap: false
		};
		if (typeof options == 'object') {
			for (i in options) {
				that.options[i] = options[i];
			}
		}
	
		if (that.options.desktopCompatibility) {
			that.options.overflow = 'hidden';
		}
		
		that.wrapper.style.overflow = that.options.overflow;
		that.refresh();
	
		window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);
	
		if ($.UI_TouchEnabled || that.options.desktopCompatibility) {
			that.element.addEventListener($.UI_START_EVENT, that, false);
			that.element.addEventListener($.UI_MOVE_EVENT, that, false);
			that.element.addEventListener($.UI_END_EVENT, that, false);
		}
		
		if (that.options.checkDOMChanges) {
			that.element.addEventListener('DOMSubtreeModified', that, false);
		}
	}
});
$.UIScrollControl.prototype = {
	x: 0,
	y: 0,
	enabled: true,

	handleEvent: function (e) {
		var that = this;

		switch (e.type) {
			case $.UI_START_EVENT:
				that.touchStart(e);
				break;
			case $.UI_MOVE_EVENT:
				that.touchMove(e);
				break;
			case $.UI_END_EVENT:
				that.touchEnd(e);
				break;
			case 'webkitTransitionEnd':
				that.transitionEnd();
				break;
			case 'orientationchange':
			case 'resize':
				that.refresh();
				break;
			case 'DOMSubtreeModified':
				that.onDOMModified(e);
				break;
		}
	},
	
	onDOMModified: function (e) {
		var that = this;
		if (e.target.parentNode != that.element) {
			return;
		}

		setTimeout(function () { that.refresh(); }, 0);

		if (that.options.topOnDOMChanges && (that.x!=0 || that.y!=0)) {
			that.scrollTo(0,0,'0');
		}
	},

	refresh: function () {
		var that = this,
			resetX = this.x, resetY = this.y,
			snap;
		that.scrollWidth = that.wrapper.clientWidth;
		that.scrollHeight = that.wrapper.clientHeight;
		that.scrollerWidth = that.element.offsetWidth;
		that.scrollerHeight = that.element.offsetHeight;
		that.maxScrollX = that.scrollWidth - that.scrollerWidth;
		that.maxScrollY = that.scrollHeight - that.scrollerHeight;
		that.directionX = 0;
		that.directionY = 0;

		if (that.scrollX) {
			if (that.maxScrollX >= 0) {
				resetX = 0;
			} else if (that.x < that.maxScrollX) {
				resetX = that.maxScrollX;
			}
		}
		if (that.scrollY) {
			if (that.maxScrollY >= 0) {
				resetY = 0;
			} else if (that.y < that.maxScrollY) {
				resetY = that.maxScrollY;
			}
		}
		if (that.options.snap) {
			that.maxPageX = -Math.floor(that.maxScrollX/that.scrollWidth);
			that.maxPageY = -Math.floor(that.maxScrollY/that.scrollHeight);
			snap = that.snap(resetX, resetY);
			resetX = snap.x;
			resetY = snap.y;
		}

		if (resetX!=that.x || resetY!=that.y) {
			that.setTransitionTime('0');
			that.setPosition(resetX, resetY, true);
		}
		
		that.scrollX = that.scrollerWidth > that.scrollWidth;
		that.scrollY = !that.scrollX || that.scrollerHeight > that.scrollHeight;
		if (that.options.hScrollbar && that.scrollX) {
			that.scrollBarX = that.scrollBarX || new $.UIScrollBar('horizontal', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar);
			that.scrollBarX.init(that.scrollWidth, that.scrollerWidth);
		} else if (that.scrollBarX) {
			that.scrollBarX = that.scrollBarX.remove();
		}
		if (that.options.vScrollbar && that.scrollY && that.scrollerHeight > that.scrollHeight) {
			that.scrollBarY = that.scrollBarY || new $.UIScrollBar('vertical', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar);
			that.scrollBarY.init(that.scrollHeight, that.scrollerHeight);
		} else if (that.scrollBarY) {
			that.scrollBarY = that.scrollBarY.remove();
		}
	},

	setPosition: function (x, y, hideScrollBars) {
		var that = this;
		
		that.x = x;
		that.y = y;

		that.element.style.webkitTransform = $.UI_TranslateOpen + that.x + 'px,' + that.y + 'px' + $.UI_TranslateClose;
		if (!hideScrollBars) {
			if (that.scrollBarX) {
				that.scrollBarX.setPosition(that.x);
			}
			if (that.scrollBarY) {
				that.scrollBarY.setPosition(that.y);
			}
		}
	},
	
	setTransitionTime: function(time) {
		var that = this;
		
		time = time || '0';
		that.element.style.webkitTransitionDuration = time;
		
		if (that.scrollBarX) {
			that.scrollBarX.bar.style.webkitTransitionDuration = time;
			that.scrollBarX.wrapper.style.webkitTransitionDuration = $.UI_Supports3D && that.options.fadeScrollbar ? '300ms' : '0';
		}
		if (that.scrollBarY) {
			that.scrollBarY.bar.style.webkitTransitionDuration = time;
			that.scrollBarY.wrapper.style.webkitTransitionDuration = $.UI_Supports3D && that.options.fadeScrollbar ? '300ms' : '0';
		}
	},
		
	touchStart: function(e) {
		var that = this,
			matrix;

		e.preventDefault();
		e.stopPropagation();
		
		if (!that.enabled) {
			return;
		}
		that.scrolling = true;
		that.moved = false;
		that.dist = 0;
		that.setTransitionTime('0');
		if (that.options.momentum || that.options.snap) {
			matrix = new WebKitCSSMatrix(window.getComputedStyle(that.element).webkitTransform);
			if (matrix.e != that.x || matrix.f != that.y) {
				document.removeEventListener('webkitTransitionEnd', that, false);
				that.setPosition(matrix.e, matrix.f);
				that.moved = true;
			}
		}
		that.touchStartX = $.UI_TouchEnabled ? e.changedTouches[0].pageX : e.pageX;
		that.scrollStartX = that.x;
		that.touchStartY = $.UI_TouchEnabled ? e.changedTouches[0].pageY : e.pageY;
		that.scrollStartY = that.y;
		that.scrollStartTime = e.timeStamp;
		that.directionX = 0;
		that.directionY = 0;
	},
	touchMove: function(e) {
		var that = this,
			pageX = $.UI_TouchEnabled ? e.changedTouches[0].pageX : e.pageX,
			pageY = $.UI_TouchEnabled ? e.changedTouches[0].pageY : e.pageY,
			leftDelta = that.scrollX ? pageX - that.touchStartX : 0,
			topDelta = that.scrollY ? pageY - that.touchStartY : 0,
			newX = that.x + leftDelta,
			newY = that.y + topDelta;

		if (!that.scrolling) {
			return;
		}
		e.stopPropagation();

		that.touchStartX = pageX;
		that.touchStartY = pageY;
		if (newX >= 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? Math.round(that.x + leftDelta / 3) : (newX >= 0 || that.maxScrollX>=0) ? 0 : that.maxScrollX;
		}
		if (newY >= 0 || newY < that.maxScrollY) { 
			newY = that.options.bounce ? Math.round(that.y + topDelta / 3) : (newY >= 0 || that.maxScrollY>=0) ? 0 : that.maxScrollY;
		}
		if (that.dist > 5) {			
			that.setPosition(newX, newY);
			that.moved = true;
			that.directionX = leftDelta > 0 ? -1 : 1;
			that.directionY = topDelta > 0 ? -1 : 1;
		} else {
			that.dist+= Math.abs(leftDelta) + Math.abs(topDelta);
		}
	},
	
	touchEnd: function(e) {
		var that = this,
			time = e.timeStamp - that.scrollStartTime,
			point = $.UI_TouchEnabled ? e.changedTouches[0] : e,
			target, ev,
			momentumX, momentumY,
			newDuration = 0,
			newPositionX = that.x, newPositionY = that.y,
			snap;

		if (!that.scrolling) {
			return;
		}
		that.scrolling = false;

		if (!that.moved) {
			that.resetPosition();

			if ($.UI_TouchEnabled) {
				target = point.target;
				while (target.nodeType != 1) {
					target = target.parentNode;
				}
				target.style.pointerEvents = 'auto';
				ev = document.createEvent('MouseEvents');
				ev.initMouseEvent('click', true, true, e.view, 1,
					point.screenX, point.screenY, point.clientX, point.clientY,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					0, null);
				ev._fake = true;
				target.dispatchEvent(ev);
			}

			return;
		}
		if (!that.options.snap && time > 250) {			
			that.resetPosition();
			return;
		}

		if (that.options.momentum) {
			momentumX = that.scrollX === true
				? that.momentum(that.x - that.scrollStartX,
								time,
								that.options.bounce ? -that.x + that.scrollWidth/5 : -that.x,
								that.options.bounce ? that.x + that.scrollerWidth - that.scrollWidth + that.scrollWidth/5 : that.x + that.scrollerWidth - that.scrollWidth)
				: { dist: 0, time: 0 };

			momentumY = that.scrollY === true
				? that.momentum(that.y - that.scrollStartY,
								time,
								that.options.bounce ? -that.y + that.scrollHeight/5 : -that.y,
								that.options.bounce ? (that.maxScrollY < 0 ? that.y + that.scrollerHeight - that.scrollHeight : 0) + that.scrollHeight/5 : that.y + that.scrollerHeight - that.scrollHeight)
				: { dist: 0, time: 0 };
			newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 1);		
			newPositionX = that.x + momentumX.dist;
			newPositionY = that.y + momentumY.dist;
		}

		if (that.options.snap) {
			snap = that.snap(newPositionX, newPositionY);
			newPositionX = snap.x;
			newPositionY = snap.y;
			newDuration = Math.max(snap.time, newDuration);
		}

		that.scrollTo(newPositionX, newPositionY, newDuration + 'ms');
	},

	transitionEnd: function () {
		var that = this;
		document.removeEventListener('webkitTransitionEnd', that, false);
		that.resetPosition();
	},

	resetPosition: function () {
		var that = this,
			resetX = that.x,
		 	resetY = that.y;

		if (that.x >= 0) {
			resetX = 0;
		} else if (that.x < that.maxScrollX) {
			resetX = that.maxScrollX;
		}

		if (that.y >= 0 || that.maxScrollY > 0) {
			resetY = 0;
		} else if (that.y < that.maxScrollY) {
			resetY = that.maxScrollY;
		}
		
		if (resetX != that.x || resetY != that.y) {
			that.scrollTo(resetX, resetY);
		} else {
			if (that.moved) {
				that.onScrollEnd();		
				that.moved = false;
			}
			if (that.scrollBarX) {
				that.scrollBarX.hide();
			}
			if (that.scrollBarY) {
				that.scrollBarY.hide();
			}
		}
	},
	
	snap: function (x, y) {
		var that = this, time;

		if (that.directionX > 0) {
			x = Math.floor(x/that.scrollWidth);
		} else if (that.directionX < 0) {
			x = Math.ceil(x/that.scrollWidth);
		} else {
			x = Math.round(x/that.scrollWidth);
		}
		that.pageX = -x;
		x = x * that.scrollWidth;
		if (x > 0) {
			x = that.pageX = 0;
		} else if (x < that.maxScrollX) {
			that.pageX = that.maxPageX;
			x = that.maxScrollX;
		}

		if (that.directionY > 0) {
			y = Math.floor(y/that.scrollHeight);
		} else if (that.directionY < 0) {
			y = Math.ceil(y/that.scrollHeight);
		} else {
			y = Math.round(y/that.scrollHeight);
		}
		that.pageY = -y;
		y = y * that.scrollHeight;
		if (y > 0) {
			y = that.pageY = 0;
		} else if (y < that.maxScrollY) {
			that.pageY = that.maxPageY;
			y = that.maxScrollY;
		}
		time = Math.round(Math.max(
				Math.abs(that.x - x) / that.scrollWidth * 500,
				Math.abs(that.y - y) / that.scrollHeight * 500
			));
			
		return { x: x, y: y, time: time };
	},

	scrollTo: function (destX, destY, runtime) {
		var that = this;

		if (that.x == destX && that.y == destY) {
			that.resetPosition();
			return;
		}

		that.moved = true;
		that.setTransitionTime(runtime || '350ms');
		that.setPosition(destX, destY);

		if (runtime==='0' || runtime=='0s' || runtime=='0ms') {
			that.resetPosition();
		} else {
			document.addEventListener('webkitTransitionEnd', that, false);	
		}
	},
	
	scrollToPage: function (pageX, pageY, runtime) {
		var that = this, snap;

		if (!that.options.snap) {
			that.pageX = -Math.round(that.x / that.scrollWidth);
			that.pageY = -Math.round(that.y / that.scrollHeight);
		}

		if (pageX == 'next') {
			pageX = ++that.pageX;
		} else if (pageX == 'prev') {
			pageX = --that.pageX;
		}

		if (pageY == 'next') {
			pageY = ++that.pageY;
		} else if (pageY == 'prev') {
			pageY = --that.pageY;
		}

		pageX = -pageX*that.scrollWidth;
		pageY = -pageY*that.scrollHeight;

		snap = that.snap(pageX, pageY);
		pageX = snap.x;
		pageY = snap.y;

		that.scrollTo(pageX, pageY, runtime || '500ms');
	},

	scrollToElement: function (el, runtime) {
		el = typeof el == 'object' ? el : this.element.querySelector(el);

		if (!el) {
			return;
		}

		var that = this,
			x = that.scrollX ? -el.offsetLeft : 0,
			y = that.scrollY ? -el.offsetTop : 0;

		if (x >= 0) {
			x = 0;
		} else if (x < that.maxScrollX) {
			x = that.maxScrollX;
		}

		if (y >= 0) {
			y = 0;
		} else if (y < that.maxScrollY) {
			y = that.maxScrollY;
		}

		that.scrollTo(x, y, runtime);
	},

	momentum: function (dist, time, maxDistUpper, maxDistLower) {
		var friction = 2.5,
			deceleration = 1.2,
			speed = Math.abs(dist) / time * 1000,
			newDist = speed * speed / friction / 1000,
			newTime = 0;

		// Proportinally reduce speed if we are outside of the boundaries 
		if (dist > 0 && newDist > maxDistUpper) {
			speed = speed * maxDistUpper / newDist / friction;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			speed = speed * maxDistLower / newDist / friction;
			newDist = maxDistLower;
		}
		
		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: Math.round(newDist), time: Math.round(newTime) };
	},
	
	onScrollEnd: function () {},
	
	destroy: function (full) {
		var that = this;

		window.removeEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);		
		that.element.removeEventListener($.UI_START_EVENT, that, false);
		that.element.removeEventListener($.UI_MOVE_EVENT, that, false);
		that.element.removeEventListener($.UI_END_EVENT, that, false);
		document.removeEventListener('webkitTransitionEnd', that, false);

		if (that.options.checkDOMChanges) {
			that.element.removeEventListener('DOMSubtreeModified', that, false);
		}

		if (that.scrollBarX) {
			that.scrollBarX = that.scrollBarX.remove();
		}

		if (that.scrollBarY) {
			that.scrollBarY = that.scrollBarY.remove();
		}
		
		if (full) {
			that.wrapper.parentNode.removeChild(that.wrapper);
		}
		
		return null;
	}
};

$.extend($, {
	UIScrollBar : function (dir, wrapper, fade, shrink) {
		 var that = this, style;
		 that.dir = dir;
		 that.fade = fade;
		 that.shrink = shrink;
		 that.UI_SCROLL_UID = ++$.UI_SCROLL_UID;
		 that.bar = document.createElement('div');
		 style = 'position:absolute;top:0;left:0;-webkit-transition-timing-function:cubic-bezier(0,0,0.25,1);pointer-events:none;-webkit-transition-duration:0;-webkit-transition-delay:0;-webkit-transition-property:-webkit-transform;z-index:10;background:rgba(0,0,0,0.5);' +
			 '-webkit-transform:' + $.UI_TranslateOpen + '0,0' + $.UI_TranslateClose + ';' +
			 (dir == 'horizontal' ? '-webkit-border-radius:3px 2px;min-width:6px;min-height:5px' : '-webkit-border-radius:2px 3px;min-width:5px;min-height:6px');
	 
		 that.bar.setAttribute('style', style);
		 that.wrapper = document.createElement('div');
		 style = '-webkit-mask:-webkit-canvas(scrollbar' + that.UI_SCROLL_UID + that.dir + ');position:absolute;z-index:10;pointer-events:none;overflow:hidden;opacity:0;-webkit-transition-duration:' + (fade ? '300ms' : '0') + ';-webkit-transition-delay:0;-webkit-transition-property:opacity;' +
			 (that.dir == 'horizontal' ? 'bottom:2px;left:2px;right:7px;height:5px' : 'top:2px;right:2px;bottom:7px;width:5px;');
		 that.wrapper.setAttribute('style', style);
		 that.wrapper.appendChild(that.bar);
		 wrapper.appendChild(that.wrapper);
	}
});

$.UIScrollBar.prototype = {
	init: function (scroll, size) {
		var that = this,
			ctx;
		if (that.dir == 'horizontal') {
			if (that.maxSize != that.wrapper.offsetWidth) {
				that.maxSize = that.wrapper.offsetWidth;
				ctx = document.getCSSCanvasContext("2d", "scrollbar" + that.UI_SCROLL_UID + that.dir, that.maxSize, 5);
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.beginPath();
				ctx.arc(2.5, 2.5, 2.5, Math.PI/2, -Math.PI/2, false);
				ctx.lineTo(that.maxSize-2.5, 0);
				ctx.arc(that.maxSize-2.5, 2.5, 2.5, -Math.PI/2, Math.PI/2, false);
				ctx.closePath();
				ctx.fill();
			}
		} else {
			if (that.maxSize != that.wrapper.offsetHeight) {
				that.maxSize = that.wrapper.offsetHeight;
				ctx = document.getCSSCanvasContext("2d", "scrollbar" + that.UI_SCROLL_UID + that.dir, 5, that.maxSize);
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.beginPath();
				ctx.arc(2.5, 2.5, 2.5, Math.PI, 0, false);
				ctx.lineTo(5, that.maxSize-2.5);
				ctx.arc(2.5, that.maxSize-2.5, 2.5, 0, Math.PI, false);
				ctx.closePath();
				ctx.fill();
			}
		}

		that.size = Math.max(Math.round(that.maxSize * that.maxSize / size), 6);
		that.maxScroll = that.maxSize - that.size;
		that.toWrapperProp = that.maxScroll / (scroll - size);
		that.bar.style[that.dir == 'horizontal' ? 'width' : 'height'] = that.size + 'px';
	},
	
	setPosition: function (pos) {
		var that = this;
		
		if (that.wrapper.style.opacity != '1') {
			that.show();
		}

		pos = Math.round(that.toWrapperProp * pos);

		if (pos < 0) {
			pos = that.shrink ? pos + pos*3 : 0;
			if (that.size + pos < 7) {
				pos = -that.size + 6;
			}
		} else if (pos > that.maxScroll) {
			pos = that.shrink ? pos + (pos-that.maxScroll)*3 : that.maxScroll;
			if (that.size + that.maxScroll - pos < 7) {
				pos = that.size + that.maxScroll - 6;
			}
		}

		pos = that.dir == 'horizontal'
			? $.UI_TranslateOpen + pos + 'px,0' + $.UI_TranslateClose
			: $.UI_TranslateOpen + '0,' + pos + 'px' + $.UI_TranslateClose;

		that.bar.style.webkitTransform = pos;
	},

	show: function () {
		if ($.UI_Supports3D) {
			this.wrapper.style.webkitTransitionDelay = '0';
		}
		this.wrapper.style.opacity = '1';
	},

	hide: function () {
		if ($.UI_Supports3D) {
			this.wrapper.style.webkitTransitionDelay = '350ms';
		}
		this.wrapper.style.opacity = '0';
	},
	
	remove: function () {
		this.wrapper.parentNode.removeChild(this.wrapper);
		return null;
	}
};

$.extend($, {
	UI_Supports3D : ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
	UI_TouchEnabled : $.iphone || $.ipad || $.android || $.webos || $.blackberry, 
	UI_START_EVENT : null,
	UI_MOVE_EVENT : null,
	UI_END_EVENT : null,
	UI_TranslateOpen : null,
	UI_TranslateClose : null,
	UI_SCROLL_UID : null
});

$.UI_START_EVENT = $.UI_TouchEnabled ? 'touchstart' : 'mousedown',
$.UI_MOVE_EVENT = $.UI_TouchEnabled ? 'touchmove' : 'mousemove',
$.UI_END_EVENT = $.UI_TouchEnabled ? 'touchend' : 'mouseup',
$.UI_TranslateOpen = 'translate' + ($.UI_Supports3D ? '3d(' : '('),
$.UI_TranslateClose = $.UI_Supports3D ? ',0)' : ')',
$.UI_SCROLL_UID = 0;  

$.extend($, {
	UIEnableScrolling : function(options) {
		$.ready(function() {
			try {
				var scrollpanels = $$("subview > scrollpanel");
				var count = 0;
				scrollpanels.forEach(function(item) {
					var scroller = new $.UIScrollControl(item, options);
				});
			} catch(e) { }
		});
	}
});
$.UIEnableScrolling({ desktopCompatibility: true });

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
			   if (this.lastElementChild.innerText === "Edit") {
				   this.lastElementChild.innerText  = "Done";
				   this.setAttribute("ui-implements", "done");
				   listEl.addClass("ui-show-delete-disclosures");
				   this.parentNode.firstElementChild.style.display = "-webkit-inline-box";
				   if (/uibutton/i.test(toolbarEl.children[1].nodeName)) {
					   toolbarEl.children[1].css("display", "none;");
				   }
				   $$("tablecell > img", listEl).forEach(function(img) {
				   	img.css("{-webkit-transform: translate3d(40px, 0, 0)}");
				   });
			   } else {
				   this.lastElementChild.innerText  = "Edit";
				   this.removeAttribute("ui-implements");
				   this.parentNode.firstElementChild.style.display = "none";
				   listEl.removeClass("ui-show-delete-disclosures");
				   $$("deletedisclosure").forEach(function(disclosure) {
					   disclosure.removeClass("checked");
					   disclosure.ancestorByTag("tablecell").removeClass("deletable");
				   });
				   if (/uibutton/i.test(toolbarEl.children[1].nodeName)) {
					   toolbarEl.children[1].css("display", "-webkit-inline-box;");
				   }
				   $("uibutton[ui-implements=delete]").addClass("disabled");
				   
				   $$("tablecell > img", listEl).forEach(function(img) {
				   	img.css("{-webkit-transform: translate3d(0, 0, 0)}");
				   });
			   }
		   });
		};
		var UIDeleteDisclosureSelection = function() {
			$$("deletedisclosure").forEach(function(disclosure) {
				disclosure.bind("click", function() {
					disclosure.toggleClass("checked");
					disclosure.ancestorByTag("tablecell").toggleClass("deletable");
					$("uibutton[ui-implements=delete]").removeClass("disabled");
					if (!disclosure.ancestorByTag("tablecell").hasClass("deletable")) {
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
				   return false;
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

});

$.extend($, {
	
	UIPopUpIsActive : null,
	UIPopUpIdentifier : null,
	
	UIPopUp : function( opts ) {
		if (opts.selector) {
			var selector = opts.selector;
		} else {
			return false;
		}
		var title = "Alert!";
		if (opts.title) {
			var title = opts.title;
		}
		var message = "";
		if (opts.message) {
			var message = opts.message;
		}
		var cancelUIButton = "Cancel";
		if (opts.cancelUIButton) {
			cancelUIButton = opts.cancelUIButton;
		}
		var continueUIButton = "Continue";
		if (opts.continueUIButton) {
			continueUIButton = opts.continueUIButton;
		}
		var popup = '<popup ui-visible-state="hidden"><panel>';
		popup += '<toolbar ui-placement="top"><h1>' + title + '</h1></toolbar>';
		popup += '<p>' + message +'</p><toolbar ui-placement="bottom">';
		popup += '<uibutton ui-kind="action" ui-implements="cancel"><label>' + cancelUIButton + '</label></uibutton>';
		popup += '<uibutton ui-kind="action" ui-implements="continue"><label>' + continueUIButton + '</label></uibutton></toolbar></panel></popup>';
		$(selector).UIScreenCover();
		$(selector).insertAdjacentHTML("beforeEnd", popup);
		var popupUIButtons = document.querySelectorAll(selector + " popup uibutton");
		for (var i = 0, len = popupUIButtons.length; i < len; i++) {
			popupUIButtons[i].addEventListener("click", function(e) {
				e.preventDefault();
				$(selector + " screencover").setAttribute("ui-visible-state", "hidden");
				$(selector + " popup").setAttribute("ui-visible-state", "hidden");
			}, false);
			$.UIPopUpIsActive = false;
			$.UIPopUpIdentifier = null;
			popupUIButtons[i].addEventListener("touchend", function(e) {
				e.preventDefault();
				$(selector + " screencover").setAttribute("ui-visible-state", "hidden");
				$(selector + " popup").setAttribute("ui-visible-state", "hidden");
			}, false);
			$.UIPopUpIsActive = false;
			$.UIPopUpIdentifier = null;
		};
		if (opts.callback) {
			var callbackSelector = selector + " popup uibutton[ui-implements=continue]";
			$(callbackSelector).addEventListener("click", function() {
				opts.callback.call(opts.callback, this);
			}, false);
		}
	}
});

$.extend($, {
	UIPopUpIsActive : false,
	UIPopUpIdentifier : null,
	UIScreenCoverIdentifier : null,
	UIShowPopUp : function( selector ) {
		$.UIPopUpIsActive = true;
		$.UIPopUpIdentifier = selector;
		var screenCover = $(selector + " screencover");
		$.UIScreenCoverIdentifier = screenCover;
		screenCover.addEventListener("touchmove", function(e) {
			e.preventDefault();
		}, false );
		$.UIPositionScreenCover(screenCover);
		$.UIPositionPopUp(selector);
		$(selector + " screencover").setAttribute("ui-visible-state", "visible");
		$(selector + " popup").setAttribute("ui-visible-state", "visible");
	},
	UIPositionScreenCover : function(screenCover) {
		screenCover.cssText = "height:" + (window.innerHeight + window.pageYOffset) + "px";
		var popup = $($.UIPopUpIdentifier + " popup");
	},
	UIPositionPopUp : function(selector) {
		$.UIPopUpIsActive = true;
		$.UIPopUpIdentifier = selector;
		var popup = $(selector + " popup");
		
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
		var customClass, status, value, callback;
		var id = opts.id;
		if(!opts.customClass) {
			customClass = "";
		} else {
			customClass = ' ' + opts.customClass;
		}
		if (!!opts.status) {
			status = opts.status;
		} else {
			status = "off";
		}
		if (!!opts.value) {
			value = opts.value;
		} else {
			value = "";
		}
		if (!!opts.callback) {
			callback = opts.callback;
		} else {
			callback = function() { return false; };
		}
		var uiswitch = '<switchcontrol class="' + status + customClass + '" id="' + id + '"' + '" ui-value="' + value + '">\
        	<label ui-implements="on">ON</label>\
            <thumb><thumbprop></thumbprop></thumb>\
            <label ui-implements="off">OFF</label>\
        </switchcontrol>';
        if (this.css("position")  !== "absolute") {
        	this.css("{position: relative;}");
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
		if (!callback) {
			var callback = function() { return false; };
		}
		if (this.nodeName.toLowerCase()==="switchcontrol") {
			callback.call(callback, this);
			if (this.hasClass("off")) {
				this.toggleClass("on", "off");
				this.checked = true;
			} else {
				this.toggleClass("on", "off");
				this.checked = false;
			}
		} else {
			return false;
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
		
		var position = position || null;
		var segmentedControl = "<segmentedcontrol";
		if (opts.id) {
			segmentedControl += " id='" + opts.id + "'";
		}
		if (opts.placement) {
			segmentedControl += " ui-bar-align='" + opts.placement + "'";
		}
		if (opts.selectedSegment) {
			segmentedControl += " ui-selected-index='" + opts.selectedSegment + "'";
		}
		segmentedControl += "'>";
		if (opts.numberOfSegments) {
			segments = opts.numberOfSegments;
			var count = 1;
			for (var i = 0; i < segments; i++) {
				segmentedControl += "<uibutton";
				if (opts.selectedSegment) {
					if (opts.selectedSegment-1 === i) {
						segmentedControl += " class='selected'";
					}
				}
				if (opts.disabledSegment) {
					if (opts.disabledSegment-1 === i) {
						segmentedControl += " class='disabled'";
					}
				}
				
				segmentedControl += " ui-kind='segmented'";
				if (opts.placementOfIcons) {
					segmentedControl += " ui-icon-alignment='" + opts.placementOfIcons[count-1] + "'";
				}
				segmentedControl += ">";
				if (opts.iconsOfSegments) {
					if (!!opts.iconsOfSegments[i]) {
					segmentedControl += "<icon ui-implements='icon-mask' style='-webkit-mask-box-image: url(icons/" + opts.iconsOfSegments[count-1] +".png)'  ui-implements='icon-mask'></icon>";
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
		}
	}
});

$.extend(HTMLElement.prototype, {
	UISegmentedControl : function() {
		var that = this;
		var buttons = $.collectionToArray(this.children);
		buttons.forEach(function(button) {
			button.bind("click", function() {
				var selectedIndex = that.getAttribute("ui-selected-index");
				if (!!selectedIndex) {
					if (!this.hasClass("disabled")) {
						that.children[selectedIndex-1].removeClass("selected");
						this.addClass("selected");
						var childCount = that.childElementCount;
						for (var i = 0; i < childCount; i++) {
							if (this.isEqualNode(that.children[i])) {
								that.setAttribute("ui-selected-index", i + 1);
							}
						}
					}
				}
			});
		});
	},
});

$.ready(function() {
	
	$$("segmentedcontrol").forEach(function(segmentedcontrol) {
		segmentedcontrol.UISegmentedControl();
	});
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
			for (var i = 0, len = opts.uiButtons.length; i < len; i++) {
				uiButtonObj = opts.uiButtons[i];
				uiButtons += "<uibutton ui-kind='action' ";
				uiButtonTitle = uiButtonObj["title"];
				uiButtonImplements = uiButtonObj["uiButtonImplements"] || "";
				uiButtonCallback = uiButtonObj["callback"];
				actionSheetID.trim();
				actionSheetID.capitalize();
				uiButtons += ' ui-implements="' + uiButtonImplements + '" class="stretch" onclick="' + uiButtonCallback + '(\'#' + actionSheetID + '\')">\
				<label>';
				uiButtons += uiButtonTitle;
				uiButtons += 	"</label>\
			 </uibutton>"	;			
			}
			actionSheetStr += uiButtons + "<uibutton ui-kind='action' ui-implements='cancel' class='stretch' \
			onclick='$.UIHideActionSheet(\"#" + actionSheetID + "\")'>\
			<label>Cancel</label>\
		</uibutton>\
		</scrollpanel>\
		</actionsheet>";
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
		var myScroll = new $.UIScrollControl($("#" + actionSheetID + " > scrollpanel"), { desktopCompatibility: true });
	}
});
$.extend($, {
	
	UIShowActionSheet : function(actionSheetID) {
		$.app.data("ui-action-sheet-id", actionSheetID);
		window.scrollTo(0,1);
		var screenCover = $("body > screencover")
		screenCover.css("{ width: '" + window.innerWidth + "px; height: " + window.innerHeight + "px; }");
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
				$(actionSheetID).css("{ right: 0; bottom: -60px; left: 0;}");
			} else {
				$(actionSheetID).css("{ right: 0; bottom: -10px; left: 0;}");
			}
		}
	}
});
document.addEventListener("orientationchange", function() {
	$.UIReadjustActionSheet();
}, false);

$.extend($, {
	UIAdjustToolBarTitle : function() {
		$$("h1").forEach(function(title) {
			var availableSpace = window.innerWidth;
			var siblingLeftWidth = 0;
			var siblingRightWidth = 0;
			var subtractableWidth = 0;
			title.previousElementSibling ? siblingLeftWidth = title.previousElementSibling.clientWidth : siblingLeftWidth = 0;
			title.nextElementSibling ? siblingRightWidth = title.nextElementSibling.clientWidth : siblingRightWidth = 0;
			if (siblingLeftWidth > siblingRightWidth) {
				subtractableWidth = siblingLeftWidth * 2;
			} else {
				subtractableWidth = siblingRightWidth * 2;
			}
			if (subtractableWidth > 0) {
				if((availableSpace - subtractableWidth) < 40) {
					
					title.style.cssText =  "display: none;";
				} else {
					title.style.cssText =  "display: block; width: " + (availableSpace - subtractableWidth - 20) + "px;";
				}
			}
		});
	}
});
document.addEventListener("DOMContentLoaded", function() {
	$.UIAdjustToolBarTitle();
}, false);
document.addEventListener("orientationchange", function() {
	$.UIAdjustToolBarTitle();
}, false);
window.addEventListener("resize", function() {
	$.UIAdjustToolBarTitle();
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
		$(this.container).css("{ background-position: center 70%; background-repeat: no-repeat; background-image: -webkit-canvas(" + this.id + "); background-size: " + this.size + " " + this.size + "}");
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
		if (this.step == 360) {
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
		if (!opts){
			var callback = function() {};
		} else {
			var callback = opts.callback;
		}
		if (opts.startValue) {
			startValue = opts.startValue;
		}
		var sliderLength = $(selector).clientWidth;
		if (startValue) {
			$("thumb", selector).css("{left: " + startValue + "px;}");
			$(selector).css("{background-size: " + (startValue + 2) + "px 9px, 100% 9px;}");				
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
		sliderThumbWidth = parseInt(sliderThumbWidth);
		$.UISliderValue = $.UICurX + sliderThumbWidth;
		if ($.UICurX <= 0 - (sliderThumbWidth/2)) { 
		 	$.UICurX = 0 - (sliderThumbWidth/2);
		}
		if ($.UICurX > sliderLength - 12) {
			$.UICurX = sliderLength -12;
		} 
	},
	
	UIUpdateSliderTouch : function( callback ) {
		if (!callback){
			var callback = function() {};
		}
		this.style.left = $.UICurX - $.UISliderThumbWidth + 'px'; 
		callback();
		this.parentNode.css("{-webkit-background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;}");
		this.parentNode.css("{background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;}");
	}
});
	
$.UIDrag = {
	obj: null,
	init: function(elem, elemParent, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef) {
		elem.onmousedown = $.UIDrag.start;
		elem.hmode = bSwapHorzRef ? false : true ;
		elem.vmode = bSwapVertRef ? false : true ;
		elem.root = elemParent && elemParent != null ? elemParent : elem ;
		if (elem.hmode && isNaN(parseInt(elem.root.style.left ))) {
		   elem.root.style.left = elem.root.css("left");
		}
		if (elem.vmode && isNaN(parseInt(elem.root.style.top ))) {
		   elem.root.style.top = elem.root.css("top")
		}
		if (!elem.hmode && isNaN(parseInt(elem.root.style.right ))) {
		   elem.root.style.right = elem.root.css("right")
		}
		if (!elem.vmode && isNaN(parseInt(elem.root.style.bottom))) {
		   elem.root.style.bottom = elem.root.css("bottom")
		}
		elem.minX = typeof minX != 'undefined' ? minX : null;
		elem.minY = typeof minY != 'undefined' ? minY : null;
		elem.maxX = typeof maxX != 'undefined' ? maxX : null;
		elem.maxY = typeof maxY != 'undefined' ? maxY : null;
		elem.root.onDragStart = new Function();
		elem.root.onDragEnd  = new Function();
		elem.root.onDrag = new Function();
	},
	start: function(e) {
		var elem = $.UIDrag.obj = this;
		e = $.UIDrag.fixE(e);
		$.UIDrag.y = parseInt(elem.vmode ? elem.root.style.top  : elem.root.style.bottom);
		$.UIDrag.x = parseInt(elem.hmode ? elem.root.style.left : elem.root.style.right );
		elem.root.onDragStart($.UIDrag.x, $.UIDrag.y);
		elem.lastMouseX = e.clientX;
		elem.lastMouseY = e.clientY;
		if (elem.hmode) {
			if (elem.minX != null) elem.minMouseX    = e.clientX - $.UIDrag.x + elem.minX;
			if (elem.maxX != null) elem.maxMouseX    = elem.minMouseX + elem.maxX - elem.minX;
		} else {
			if (elem.minX != null) elem.maxMouseX = -elem.minX + e.clientX + $.UIDrag.x;
			if (elem.maxX != null) elem.minMouseX = -elem.maxX + e.clientX + $.UIDrag.x;
		}
		if (elem.vmode) {
			if (elem.minY != null) elem.minMouseY    = e.clientY - $.UIDrag.y + elem.minY;
			if (elem.maxY != null) elem.maxMouseY    = elem.minMouseY + elem.maxY - elem.minY;
		} else {
			if (elem.minY != null) elem.maxMouseY = -elem.minY + e.clientY + $.UIDrag.y;
			if (elem.maxY != null) elem.minMouseY = -elem.maxY + e.clientY + $.UIDrag.y;
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
		$.UIDrag.y = parseInt(elem.vmode ? elem.root.style.top  : elem.root.style.bottom);
		$.UIDrag.x = parseInt(elem.hmode ? elem.root.style.left : elem.root.style.right );
		var nx, ny;
		if (elem.minX != null) ex = elem.hmode ? 
			Math.max(ex, elem.minMouseX) : Math.min(ex, elem.maxMouseX);
		if (elem.maxX != null) ex = elem.hmode ? 
			Math.min(ex, elem.maxMouseX) : Math.max(ex, elem.minMouseX);
		if (elem.minY != null) ey = elem.vmode ? 
			Math.max(ey, elem.minMouseY) : Math.min(ey, elem.maxMouseY);
		if (elem.maxY != null) ey = elem.vmode ? 
			Math.min(ey, elem.maxMouseY) : Math.max(ey, elem.minMouseY);
		nx = $.UIDrag.x + ((ex - elem.lastMouseX) * (elem.hmode ? 1 : -1));
		ny = $.UIDrag.y + ((ey - elem.lastMouseY) * (elem.vmode ? 1 : -1));
		$.UICurX = nx;
		$.UISliderValue = nx + (Math.round($.UISliderThumbWidth));
		console.log("$.UISliderValue: " + (nx + $.UISliderThumbWidth));
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
			parseInt($.UIDrag.obj.root.style[$.UIDrag.obj.hmode ? "left" : "right"]), 
			parseInt($.UIDrag.obj.root.style[$.UIDrag.obj.vmode ? "top" : "bottom"]));
		$.UIDrag.obj = null;
	},
	
	fixE: function(e) {
		if (typeof e.elemX == 'undefined') e.elemX = e.offsetX;
		if (typeof e.elemY == 'undefined') e.elemY = e.offsetY;
		return e;
	}, 
	updateSliderProgressIndicator : function() {
		$.UIDrag.obj.parentNode.css("{-webkit-background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;}");
		$.UIDrag.obj.parentNode.css("{background-size:" + ($.UICurX + 1) + "px 9px, 100% 9px;}");
	}
};	

$.extend($, {
	UISliderForMouse : function ( selector, opts ) {
		if (!opts) {
			var opts = {};
		}
		var thumb = $("thumb", selector);
		var slider = $(selector);
		var thumbWidth = parseInt(thumb.css("width"));
		var sliderWidth = parseInt(slider.css("width"));
		var sliderHeight = parseInt(slider.css("height"));
		var padding = parseInt(slider.css("padding-right"));
		var border = parseInt(slider.css("border-right-width"));
		sliderWidth -= padding;
		sliderWidth -= border;
		sliderWidth -= $.UISliderThumbWidth;
		
		
		var thumbDetuct = Math.round(thumbWidth/2);
		$.UISliderThumbWidth = thumbDetuct;
		var negLeft = (0 - $.UISliderThumbWidth);
		$.UIDrag.init(thumb, null, -$.UISliderThumbWidth, sliderWidth - (Math.round(thumbWidth/2)), opts["top"], opts["top"]);
		thumb.onDrag = function() {
			if (opts.callback) {
				opts.callback();
				slider.UIUpdateSliderTouch();
			}
			// Temporary fix for horizontal slider thumb drag:
			this.style.top = -sliderHeight + "px";
		}
	}
});