/*
ChocolateChip-UI
Version 2.0.0
This version works with ChocolateChip.js, jQuery or Zepto. 
For jQuery, ChocolateChip-UI requires as a minimum version 1.7.1
When using Zepto, make sure you have the following modules included in your build: zepto, event, detect, fx, fx_methods, ajax, form, data, selector, stack. 
*/
(function() {
	if (window.$chocolatechip) {
		var $ = window.$chocolatechip;
		var $$ = window.$$chocolatechip;
		var _cc = true;
		
		$.fn = HTMLElement.prototype;
	}
	if (window.jQuery) {
		var $ = window.jQuery;
		var _jq = true;
	}
	if (window.Zepto) {
		var $ = window.Zepto;
		var _zo = true;
	}
	if (_jq || _zo) {
		$.extend($, {
			concat : function (args ) {
         		return args instanceof Array ? args.join('') : Array.prototype.slice.apply(arguments).join('');
         	}
		});
		$.fn.childElements = function() {
			return this.children();
		}
	}
	$(function() {			
		/* 
		Function to iterate over node collections. This gets used by ChocolateChip.js.
		jQuery and Zepto already provide this method. It will always return the a plain DOM node so you can wrap it in $() or use $(this) to use node methods such as css(), etc.
		*/
		if (_cc) {
			$._each = function ( elements, callback ) {
				var i, key;
				if (typeof elements.length === 'number') {
					for (i = 0; i < elements.length; i++) {
						if (callback.call(elements[i], i, elements[i]) === false) {
							return elements;
						}
					}
				} else {
					for (key in elements) {
						if (callback.call(elements[key], key, elements[key]) === false) {
							return elements;
						}
					}
				}
		  	}  
		} else {
			$._each = $.each;
		}
		
		// Normalize the way to get a single node for jQuery, Zepto and ChocolateChip.
		$.el = function ( selector ) {
			if (typeof selector === 'string') {
				return document.querySelector(selector);
			}
			if (selector instanceof Object) {
				return selector[0];
			}
			if (selector.nodeType === 1) {
				return selector;
			}
		};
		
		// Normalize get node collections for jQuery, Zepto and Chocolatechip.
		$.els = function ( selector ) {
			if (_cc) {
				return $$(selector);
			} else {
				return $(selector);
			}
		};
		
		if (!$.show) { 
			$.extend(HTMLElement.prototype, {
				show : function ( ) {
					var originalDisplay = this.attr('ui-display') || this.css('display');
					this.style.display = originalDisplay;
				},
				
				hide : function ( ) {
					var originalDisplay = this.css('display');
					this.attr('ui-display', originalDisplay);
					this.style.display = 'none';
				}
			});
		}
		$.body = $("body");
		$.app = $("app");
		$.main = $("#main");
		$.views = _cc ? $$("view") : $('view');
		$.touchEnabled = ('ontouchstart' in window);
		$.userAction = 'touchend';
		if (!$.touchEnabled) {
			var stylesheet = $('head').find('link[rel=stylesheet]').attr('href');
			var stylesheet1 = stylesheet.replace(/chui\.css/, 'chui.desktop.css');
			$('head').append(['<link rel="stylesheet" href="',stylesheet1,'">'].join(''));
			$.userAction = 'click';
		}
		if ( _jq || _zo) {
			$.fn.hasAttr = function(property) {
				return $(this).attr(property);
			};
			$.slice = Array.prototype.slice;
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
				return $.concat($.AlphaSeed(), $.UIUuidSeed(20), $.UIUuidSeed(), '-', $.UIUuidSeed(), '-', $.UIUuidSeed(), '-', $.UIUuidSeed(), '-', $.UIUuidSeed(), $.UIUuidSeed(), $.UIUuidSeed());
			},
			
			ctx : function(node) {
				try {
					return (node.nodeType !== 1 && typeof node === 'object' && !node.length) ? node[0] : node
				} catch(err) {}
			},

			UIEnableScrolling : function ( options ) {
				options = options || {};
				$._each($.els("scrollpanel"), function(idx, ctx) {
					var scroller = new iScroll(ctx, options);
					$(ctx).data("ui-scroller", scroller);
				});
			},
			
			UINavigationHistory : ['#main'],
			
			UINavigateBack : function() {
				var parent = $.UINavigationHistory[$.UINavigationHistory.length-1];
				$.UINavigationHistory.pop();
				$($.UINavigationHistory[$.UINavigationHistory.length-1])
				.attr('ui-navigation-status', 'current');
				$(parent).attr('ui-navigation-status', 'upcoming');
				 if ($.app.attr('ui-kind')==='navigation-with-one-navbar' && $.UINavigationHistory[$.UINavigationHistory.length-1] === '#main') {
 					$('navbar > uibutton[ui-implements=back]', $.app).css('display','none');
 				}
			}
		});
		$.extend(HTMLElement.prototype, {
			UIToggleButtonLabel : function ( label1, label2 ) {
				if ($('label', this).text() === label1) {
					$('label', this).text(label2);
				} else {
					$('label', this).text(label1);
				}
			}
		});
		
		$.extend($, {
			UINavigationListExits : false,

		   UINavigationEvent : false,
			
			UINavigationList : function() {
				var navigateList = function(node) {
					var currentNavigatingView = '#main';
					var node = $(node);
					try {
						if ($.app.attr('ui-kind')==='navigation-with-one-navbar') {
							$('navbar > uibutton[ui-implements=back]', $.app).css('display: block;');
						}
						$(node.attr('href')).attr('ui-navigation-status', 'current');
						$($.UINavigationHistory[$.UINavigationHistory.length-1]).attr('ui-navigation-status', 'traversed');
						if ($('#main').attr('ui-navigation-status') !== 'traversed') {
							$('#main').attr('ui-navigation-status', 'traversed');
						}
						$.UINavigationHistory.push(node.attr('href'));
						currentNavigatingView = node.closest('view');
						
						currentNavigatingView.bind('webkitTransitionEnd', function(event) {
							if (event.propertyName === '-webkit-transform') {
								node.removeClass('disabled');
							}
						});
					} catch(err) {} 
				};
				
				if ($.userAction === 'touchend') {
					$.app.delegate('tablecell', 'touchstart', function(ctx) {
						var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
						$(node).addClass('touched');
					});
					$.app.delegate('tablecell', 'touchcancel', function(ctx) {
						var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
						$(node).removeClass('touched');
					});
					$.app.delegate('tablecell', 'touchend', function(ctx) {
						var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
						$(node).removeClass('touched');
						try {
							if ($(node).hasAttr('href')) {
								$.UINavigationListExits = true;			
								if ($(node).hasClass('disabled')) {
									return
								} else {
									$(node).addClass('disabled');
									navigateList($(node));
								}
							}
						} catch(err) {}
					});
				} else {
					$.app.delegate('tablecell', 'click', function(ctx) {
						var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
						if ($(node).hasAttr('href')) {
							$.UINavigationListExits = true;				
							if ($(node).hasClass('disabled')) {
								return;
							} else {
								$(node).addClass('disabled');
								navigateList(node);
							}
						}
					});
				}
			},
			
			UINavigateToView : function(viewID) {
				$.UINavigationListExits = true;
				$($.UINavigationHistory[$.UINavigationHistory.length-1])
					.attr('ui-navigation-status','traversed');
				$(viewID).attr('ui-navigation-status','current');
				$.UINavigationHistory.push(viewID);
				if ($.app.attr('ui-kind') === 'navigation-with-one-navbar') {
					$('navbar uibutton[ui-implements=back]').css({'display':'block'});
				}
			},
			
			UINavigateToNextView : function ( viewID ) {
				return $.UINavigateToView(viewID);
			},
	
			UITouchedTableCell : null			
		});
		$.app.delegate('view','webkitTransitionEnd', function() {
			if (!$('view[ui-navigation-status=current]')) {
				$($.UINavigationHistory[$.UINavigationHistory.length-2])	 
					.attr('ui-navigation-status', 'current');
				$.UINavigationHistory.pop(); 
			}	
			$.UINavigationEvent = false;
		});
		$.UINavigationList();
		if ($.userAction === 'touchend') {
			$.app.delegate('uibutton', 'touchstart', function(ctx) {
				var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
				$(node).addClass('touched');
			});
			$.app.delegate('uibutton', 'touchend', function(ctx) {
				var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
				$(node).removeClass('touched');
				if ($(node).attr('ui-implements') === 'back') {
					if ($.UINavigationListExits) {
						$.UINavigateBack();
						$.UINavigationEvent = false;
					}
				}
			});
			$.app.delegate('uibutton', 'touchcancel', function(ctx) {
				var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
				$(node).removeClass('touched');
			});
		} else {
			$.app.delegate('uibutton', $.userAction, function(ctx) {
				var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
				if ($(node).attr('ui-implements') === 'back') {
					if ($.UINavigationListExits) {
						$.UINavigateBack();
						$.UINavigationEvent = false;
					}
				}
			});	
		}		
		$.UIEnableScrolling();
		
		$.fn.UISelectionList = function ( callback ) {
			var $this = this;
			var listitems = this.childElements();
			if (_jq || _zo) {
				listitems = $(listitems);
				console.dir(listitems);
			} 
			$._each(listitems, function(idx, node) {
				console.dir(node);
				if (node.nodeName.toLowerCase() === 'tablecell') {
					var checkmark = '<checkmark>&#x2713</checkmark>';
					$(node).append(checkmark);
					$(node).on($.userAction, function() {
						if ($.userAction === 'touchend') {
							$(node).removeClass('touched');
						}
						var $this = this;
						setTimeout(function() {
							if ($.UIScrollingActive) return;
							$._each(listitems, function(idx, check) {
								$(check).removeClass('selected');
								$(check).removeClass('touched');
							});
							$($this).addClass('selected');
							$($this).find('input').checked = true; 
							if (callback) {
								callback.call(callback, $($this).find('input'));
							}
						},100);
					});
					$(node).on('touchstart', function() {
						$(this).addClass('touched');
					});
					$(node).on('touchcancel', function() {
						$(this).removeClass('touched');
					});
				}
			});
		};
	});
})();