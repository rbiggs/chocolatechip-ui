/*
    pO\		
   6  /\
     /OO\
    /OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/    
 
ChocolateChip-UI
Chui.win.js
Copyright 2013 Sourcebits www.sourcebits.com
License: BSD
Version: 2.1.6
*/
(function() {
	var _$ = null;
	if (window.$chocolatechip) {
		_$ = window.$chocolatechip;
		var $$ = window.$$chocolatechip;
		var _cc = true;
	}
	if (window.jQuery) {
		_$ = window.jQuery;
		var _jq = true;
	}
	if (window.Zepto) {
		_$ = window.Zepto;
		var _zo = true;
	}
	var $ = _$;

	$.msPointerEnabled = null;
	if (navigator.msPointerEnabled) {
	    $.msPointerEnabled = true;
	}
	var iScroll = function() { return false; };
    
	UIConvertElementMethods = function(elementMethods) {
		for (var method in elementMethods) {
			if (_jq || _zo) {
				$.fn[method] = elementMethods[method];
			} else {
				if (elementMethods.hasOwnProperty(method)) {
					var obj = {};
					obj[method] = elementMethods[method];
					$.extend(HTMLElement.prototype, obj);
				}
			}
		}
	};	

	if (_jq || _zo) {
		$.extend($, {
			concat : function ( args ) {
				if (args instanceof Array) {
					return args.join('');
				} else {
					args = $.slice.apply(arguments);
					return String.prototype.concat.apply(args.join(''));
				}
			},
         capitalize : function ( str ) {
				return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
			}
		});
		$.fn.findAll = function ( selector ) {
			return $(this).find(selector);
		};
		$.fn.childElements = function() {
			return this.children();
		};
		$.fn.toggleClassName = function( firstClassName, secondClassName ) {
			if (!$(this).hasClass(firstClassName)) {
				$(this).addClass(firstClassName);
				$(this).removeClass(secondClassName);
			} else {
				$(this).removeClass(firstClassName);
				$(this).addClass(secondClassName);
			}
		};
	}
	
	$.defaultCheckboxColor = '#ffffff';
	$.checkboxHeight = 20;
	// Define methods to extend HTML elements:
	var elementMethods = {
	
		reduceToNode : function ( ) {
			var self = this.nodeName ? this : this[0];
			return self;
		},
		
		UIIdentifyChildNodes : function ( ) {
			var ctx = this.nodeType === 1 ? this : this[0];
			var kids = ctx.childElementCount;
			for (var i = 0; i < kids; i++) {
			    if (i < 1) {
			        ctx.children[0].setAttribute('ui-child-position', '0');
			    } else {
			        ctx.children[i].setAttribute('ui-child-position', i);
			    }
			}
		},
		
		_first : function ( ) {
			if (_cc) {
				return this.first();
			} else {
				return $(this).children().first();
			}
		},
		
		_last : function ( ) {
			if (_cc) {
				return this.last();
			} else {
				return $(this).children().last();
			}
		},
		
		UIBlock : function ( opacity ) {
			opacity = opacity ? " style='opacity:" + opacity + "'" : "";
			$(this).before("<mask" + opacity + "></mask>");
			return this;
		},
		
		UIUnblock : function ( ) {
			$._each($.els('mask'), function(idx, ctx) {
				$(ctx).remove();
			});
			$('view[ui-navigation-status=current]').removeAttr('aria-hidden');
			return this;
		},
		
		ariaHide : function ( ) {
			var $this = $(this);
			$this.attr('aria-hidden','true');
			var elems = $.els('*', $this);
			$._each(elems, function(idx, ctx) {
				$(ctx).data('savedAriaHidden', $(ctx).attr('aria-hidden'));
				if ($(ctx).attr('aria-hidden')) {
					$(ctx).data('savedAriaHidden', $(ctx).attr('aria-hidden'));
				}
				$(ctx).attr('aria-hidden','true');
			});
			$this.addClass('ariaHidden');
		},
		
		ariaShow : function ( ) {
			var $this = $(this);
			$this.attr({'aria-hidden':'false'});
			var elems = $.els('*', $this);
			$._each(elems, function(idx, ctx) {
				var saved;
				try {
					saved = $(ctx).data('savedAriaHidden');
				} catch(err) {}
				if (!saved) {
					$(ctx).removeAttr('aria-hidden');
				} else {
					$(ctx).attr('aria-hidden', saved);
				}
			});
			$this.removeClass('ariaHidden');
		},
		
		ariaFocus : function ( ) {
			var self = this.reduceToNode();
			if (self) {
				if (self.tagName !== "A" && self.tagName !== "TEXTAREA"){
				  $(self).attr('tabindex', -1);
				}
				$(self).focus();
			}
			return this;
		},
		
		ariaFocusChild : function ( selector ) {
			selector = selector || 'h1';
			var self = this;
			$(self).find(selector).ariaFocus();
    		return this;
		},
		
		UIRemovePopupBtnEvents : function(eventType, eventName) {
			$(this).off(eventType, eventName, false);
		},
		
		UIToggleButtonLabel : function ( label1, label2 ) {
			if ($('label', this).text() === label1) {
				$('label', this).text(label2);
			} else {
				$('label', this).text(label1);
			}
		},
		
		UISelectionList : function ( callback ) {
			var $this = this;
			var listitems = this.childElements();
			if (_jq || _zo) {
				listitems = $(listitems);
			} 
			$._each(listitems, function(idx, node) {
				if (node.nodeName.toLowerCase() === 'tablecell') {
					var checkmark = '<checkmark></checkmark>';
					$(node).attr('role','radio');
					$(node).attr('aria-checked','false');
					$(node).append(checkmark);
					$(node).on($.eventStart, function() {
						if ('createTouch' in document) {
							$(node).removeClass('touched');
							$(node).attr('aria-checked','false');
						}
						var $this = this;
						setTimeout(function() {
							if ($.UIScrollingActive) return;
							$._each(listitems, function(idx, check) {
								$(check).removeClass('selected');
								$(check).removeClass('touched');
								$(check).attr('aria-checked','false');		
							});
							$($this).addClass('selected');
							$($this).attr('aria-checked','true');
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
		},
		
		UISwitchControl : function (callback) {
			callback = callback || function() { return false; };
			var item = this.reduceToNode();
			if (item.nodeName.toLowerCase()==="switchcontrol") {
				$(item).attr('role','radio');
				callback.call(callback, this);
				var checkbox = $(this).find('input');
				checkbox = checkbox.reduceToNode();
				if ($(this).hasClass("off")) {
					$(this).toggleClassName("on", "off");
					$(this).attr('aria-checked','true');
					checkbox.checked = true;
					$(this).find("thumb").focus();
				} else {
					$(this).attr('aria-checked','false');
					$(this).toggleClassName("on", "off");
					checkbox.checked = false;
				}
			} else {
				return;
			}
		},
		
		UICreateSwitchControl : function( opts ) {
			/*
				{
					id : "anID",
					namePrefix : "customer",
					customClass : "specials",
					status : "on",
					kind : "traditional",
					uiImplements: 'attention',
					labelValue : ["on","off"],
					value : "$1000",
					callback : function() {console.log('This is great!');},	
				}
			*/
			var id = opts.id;
			var namePrefix = '';
			if (opts.namePrefix) {
				namePrefix = "name='" + opts.namePrefix + "." + opts.id + "'";
			} else {
				namePrefix = "name='" + id + "'";
			}
			var customClass = " ";
			customClass += opts.customClass ? opts.customClass : "";
			var status = opts.status || "off";
			var kind = opts.kind ? " ui-kind='" + opts.kind + "'" : "";
			var uiImplements = '';
			if (opts.uiImplements) {
				uiImplements = " ui-implements='" + opts.uiImplements + "'";
			}
			var label1 = "ON";
			var label2 = "OFF";
			if (opts.kind === "traditional") {
				if (!!opts.labelValue) {
					label1 = opts.labelValue[0];
					label2 = opts.labelValue[1];
				}
			}
			var value = opts.value || "";
			var callback = opts.callback || function() { return false; };
			var label = (opts.kind === "traditional") ? $.concat('<label ui-implements="on">', label1, '</label><thumb></thumb><label ui-implements="off">', label2, '</label>') : "<thumb></thumb>";
			var uiswitch = $.concat('<switchcontrol ', kind, ' class="', status, " ", customClass, '" ', uiImplements, 'id="', id, '"', '>', label, '<input type="checkbox" ', namePrefix, ' style="display: none;" value="', value, '"></switchcontrol>');
			if ($(this).css("position")  !== "absolute") {
				this.css("position: relative;");
			}
			$(this).append(uiswitch);
			var newSwitchID = "#" + id;
			if (_zo) {
				$(newSwitchID).find("input").attr("checked", (status === "on" ? true : false));
			} else {
				$(newSwitchID).find("input").prop("checked", (status === "on" ? true : false));
			}
			$(newSwitchID).on($.eventStart, function() {
				$(this).UISwitchControl(callback);
			});
		},
		
		UIInitSwitchToggling : function() {
			var switches = $.els('switchcontrol', $.app);
			var $this = this;
			$._each(switches, function(idx, ctx) {
				var item = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
				var checkbox = $(item).find('input[type="checkbox"]');
				checkbox = checkbox.reduceToNode();
				if ($(item).hasClass('on')) {
					$(item).checked = true;
					checkbox.checked = true;
				} else {
					$(item).checked = false;
					checkbox.checked = false;
				}
				$(item).on($.eventStart, function(e) {
					e.preventDefault();
					this.parentNode.style.backgroundImage = 'none';
					$(item).UISwitchControl();
				});
				$(item).on('touchstart', function() {
					$(this).addClass('touched');
				});
				$(item).on('touchend', function() {
					$(this).removeClass('touched');
				});
			});
		},
		
		UICreateSegmentedControl : function(opts) {
			position = opts.position || null;
			var segmentedControl = "<segmentedcontrol";
			if (opts.id) {
				segmentedControl += " id='" + opts.id + "'";
			}
			if (opts.placement) {
				segmentedControl += " ui-bar-align='" + opts.placement + "'";
			}
			if (opts.selectedSegment || opts.selectedSegment === 0) {
				segmentedControl += " ui-selected-index='" + opts.selectedSegment + "'";
			} else {
				segmentedControl += " ui-selected-index=''";
			}
			if (opts.container) {
				segmentedControl += " ui-segmented-container='#" + opts.container + "'";
			}
			var segClass = opts.cssClass || "";
			segmentedControl += ">";
			if (opts.numberOfSegments) {
				segments = opts.numberOfSegments;
				var count = 1;
				for (var i = 0; i < segments; i++) {
					segmentedControl += "<uibutton";
					segmentedControl += " id='" + $.UIUuid() + "'";
					segmentedControl += " class='" + segClass[count-1];
					if (opts.selectedSegment || opts.selectedSegment === 0) {
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
				$(this).append(segmentedControl);
			}
		},
		
		UISegmentedControl : function( container, callback ) {
			var that = $(this);
			var val = null;
			callback = callback || $.noop;
			if (!$(this).attr('ui-selected-segment')) {
				$(this).attr('ui-selected-segment', '');
			}
			if ($(this).attr('ui-selected-index')) {
				val = $(this).attr('ui-selected-index');
				try {
					var kids = $(this).childElements();
					var seg = kids.eq(val);
					seg = $(seg).attr('id');
					$(this).attr('ui-selected-segment', seg);
					kids.eq(val).addClass('selected');
				} catch(e) {}
			} else {
				$._each($(this).childElements(), function(idx, ctx) {
					if ($(ctx).hasClass('selected')) {
						if (idx === 0) {
							$(ctx).attr('ui-selected-index', '0');
						} else {
							$(ctx).attr('ui-selected-index', idx);
						}
					} 
				});
			}
			if (container) {
				$(this).attr('ui-segmented-container', container);
				container = $(container);
				if (val || val == 0) { 
					container.attr('ui-selected-index', val);
				}
				var containerChildren = _cc ? [].slice.apply(container.children) : $(container).children();
				$._each(containerChildren, function(idx, child) {
					$(child).css('display','none');
				});
				containerChildren.eq(val).css('display','block');
				that.attr('ui-segmented-container', ('#' + container.attr('id')));
				var selectedIndex = $(this).attr('ui-selected-index');
				
			}
			$._each($(this).childElements(), function(idx, button) {
				if (!$(button).attr('id')) {
					$(button).attr('id', $.UIUuid());
				}
				if (!that.attr('ui-selected-segment')) {
					if ($(button).hasClass('selected')) {
						that.attr('ui-selected-segment', $(button).attr('id'));
					}
				}
				$(button).on($.eventStart, function() {
					var selectedSegment = that.attr('ui-selected-segment');
					selectedSegment = $('#'+selectedSegment);
					var selectedIndex = that.attr('ui-selected-index');
					var childPosition = null;
					var container = null;
					var ancestor = $(this).closest('segmentedcontrol');
					if (ancestor.attr('ui-segmented-container')) {
						container = ancestor.attr('ui-segmented-container');
					}
					var containerChildren = $(container).childElements();
					var oldSelection = null;
					if (ancestor.attr('ui-selected-index')) {
						oldSelection = ancestor.attr('ui-selected-index');
					}
					var uisi = null;
					if (!selectedSegment) {
						uisi = $(this).attr('ui-child-position');
						that.attr('ui-selected-index', uisi);
						that.attr('ui-selected-segment', $(this).attr('id'));
						$(this).addClass('selected');
						childPosition = $(this).attr('ui-child-position');
						containerChildren.eq(val).css('display','none');
						containerChildren.eq(childPosition).css('display','none');
					} 
					if (selectedSegment) {
						uisi = $(this).attr('ui-child-position');
						that.attr('ui-selected-index', uisi);
						selectedSegment.removeClass('selected');
						that.attr('ui-selected-segment', $(this).attr('id'));
						$(this).addClass('selected');
						childPosition = $(this).attr('ui-child-position');
						if (that.attr('ui-segmented-container')) {
							container = $(that.attr('ui-segmented-container'));
							containerChildren.eq(oldSelection).css('display','none');
							containerChildren.eq(uisi).css('display','block');
							containerChildren.eq(selectedSegment.attr('ui-child-position')).css('display','none');
						}
					}
					$(this).addClass('selected');
						callback.call(callback, button);
				});
			});
			$(this).UIIdentifyChildNodes();
		},
		
		UICreateTabBar : function ( opts ) {
		/*
			id: 'mySpecialTabBar',
			imagePath: '/images/icons/',
			numberOfTabs: 4,
			tabLabels: ["Refresh", "Add", "Info", "Downloads", "Favorite"],
			iconsOfTabs: ["refresh", "add", "info", "downloads", "top_rated"],
			selectedTab: 0,
			disabledTab: 3
		*/
		var id = opts.id || $.UIUuid();
		var imagePath = opts.imagePath || 'icons\/';
		var numberOfTabs = opts.numberOfTabs || 1;
		var tabLabels = opts.tabLabels;
		var iconsOfTabs = opts.iconsOfTabs;
		var selectedTab = opts.selectedTab || 0;
		var disabledTab = opts.disabledTab || null;
		var tabbar = ["<tabbar ui-selected-tab='", selectedTab, "'>"];
		$(this).attr("ui-tabbar-id", id);
			for (var i = 0; i < numberOfTabs; i++) {
				tabbar.push("<uibutton ui-implements='tab' ");
				if (i === selectedTab || i === disabledTab) {
					tabbar.push("class='");
					if (i === selectedTab) {
						tabbar.push("selected");
					}
					if (i === disabledTab) {
						tabbar.push("disabled");
					}
					tabbar.push("'");
				}
				tabbar.push("><label>");
				tabbar.push(tabLabels[i]);
				tabbar.push("</label></uibutton>");
			}
			tabbar.push("</tabbar>");
			$(this).append(tabbar.join(''));
			var subviews = $.els("subview", this);
			subviews.eq(selectedTab).addClass("selected");
			this.UITabBar();
		},
	
		UITabBar : function ( ) {
			var tabs = $.els('tabbar > uibutton[ui-implements=tab]', this);
			var tabbar = $('tabbar', this);
			tabbar.UIIdentifyChildNodes();
			var subviews = $.els('subview', this);
			$._each(subviews, function(idx, ctx) {
				$(ctx).addClass('unselected');
				$(ctx).attr('ui-navigation-status','upcoming');
			});
			var selectedTab = tabbar.attr('ui-selected-tab') || 0;
			subviews.eq(selectedTab).toggleClassName('unselected','selected');
			subviews.eq(selectedTab).attr('ui-navigation-status', 'current');
			tabs.eq(selectedTab).addClass('selected');
			$._each(tabs, function(idx, tab) {
				$(tab).on($.eventStart, function() {
					if ($(tab).hasClass('disabled') || $(tab).hasClass('selected')) {
						return;
					}
					var whichTab = $(tab).closest('tabbar').attr('ui-selected-tab');
					tabs.eq(whichTab).removeClass('selected');
					$(tab).addClass('selected');
					subviews.eq(whichTab).removeClass('selected');
					subviews.eq(whichTab).addClass('unselected');
					subviews.eq($(tab).attr('ui-child-position')).addClass('selected');
					subviews.eq($(tab).attr('ui-child-position')).attr('ui-navigation-status', 'current');
					subviews.eq(tab.getAttribute('ui-child-position')).removeClass('unselected');
					tabbar.attr('ui-selected-tab', $(tab).attr('ui-child-position'));
				});
			});
		},
		
		UITabBarForViews : function ( ) {
			var tabs = $.els('tabbar > uibutton[ui-implements=tab]', this);
			$('tabbar', this).UIIdentifyChildNodes();
			var tabbar = $('tabbar', this);
			var views = $.els('view', this);
			$._each(views, function(idx, view) {
				$(view).attr('ui-navigation-status','upcoming');
			});
			var selectedTab = tabbar.attr('ui-selected-tab') || 0;
			views.eq(selectedTab).attr('ui-navigation-status','current');
			tabs.eq(selectedTab).addClass('selected');
			$._each(tabs, function(idx, tab) {
				$(tab).on($.eventStart, function() {
					if ($(tab).hasClass('disabled') || $(tab).hasClass('selected')) {
						return;
					}
					var whichTab = $(tab).closest('tabbar').attr('ui-selected-tab');
					tabs.eq(whichTab).removeClass('selected');
					$(tab).addClass('selected');
					views.eq(whichTab).attr('ui-navigation-status', 'upcoming');
					views.eq($(tab).attr('ui-child-position')).attr('ui-navigation-status', 'current');
					tabbar.attr('ui-selected-tab', $(tab).attr('ui-child-position'));
				});
			});
		},
		
		UISegmentedPagingControl : function ( ) {
			var segmentedPager = $('segmentedcontrol[ui-implements="segmented-paging"]', this);
			var pagingOrientation = segmentedPager.attr('ui-paging');
			segmentedPager.attr('ui-paged-subview', '0');
			segmentedPager._first().addClass('disabled');
			var subviews = $.els('subview', this);
			segmentedPager.attr('ui-pagable-subviews', subviews.length);
			var childPosition = 0;
			$._each(subviews, function(idx, ctx) {
				$(ctx).css('display','none');
				$(ctx).attr('ui-navigation-status', 'upcoming');
				$(ctx).attr('ui-child-position', childPosition);
				childPosition++;
				$(ctx).attr('ui-paging-orient', pagingOrientation);
				setTimeout(function() {
					$(ctx).css('display','block');
				}, 0);
			});
			var prevButton = $(segmentedPager._first());
			var nextButton = $(segmentedPager._last());
			subviews.eq(0).attr('ui-navigation-status', 'current');
			segmentedPager.delegate('uibutton', $.eventStart, function(ctx) {
				var button = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
				if ($(button).hasClass('disabled')) return;
				var pager = segmentedPager;
				// Previous Button:
				if (button.isSameNode(button.parentNode.firstElementChild)) {
					if (pager.attr('ui-paged-subview') == 1) {
						$(button).addClass('disabled');
						pager.attr('ui-paged-subview', '0');
						subviews.eq(0).attr('ui-navigation-status', 'current');
						subviews.eq(1).attr('ui-navigation-status', 'upcoming');
					} else {
						$(subviews[pager.attr('ui-paged-subview') - 1 ]).attr( 'ui-navigation-status', 'current');
						$(subviews[pager.attr('ui-paged-subview')]).attr('ui-navigation-status', 'upcoming');
						pager.attr('ui-paged-subview', pager.attr('ui-paged-subview')-1);
						$(button).next().removeClass('disabled');
						if (pager.attr('ui-paged-subview') <= 0) {
							$(button).addClass('disabled');
						}
					}
				} else {
					prevButton.removeClass('disabled');
					var pagedSubview = Number(pager.attr('ui-paged-subview'));
					if (pagedSubview === Number(segmentedPager.attr('ui-pagable-subviews'))-2){
						$(button).addClass('disabled');
					}
					$(subviews[pagedSubview]).attr('ui-navigation-status', 'traversed');
					$(subviews[pagedSubview+1]).attr('ui-navigation-status', 'current');
					pager.attr('ui-paged-subview', pagedSubview + 1);
				}
			});
		},
		
		UIExpander : function ( opts ) {
			opts = opts || {};
			var status = opts.status || 'expanded';
			var title = opts.title || 'Open';
			var altTitle = opts.altTitle || 'Close';
			var expander = $(this);
			var panel = $('panel', this);
			var header = '<header><label></label></header>';
			panel.attr('ui-height', parseInt(panel.css('height'), 10));
			$(this).prepend(header);
			if (status === 'expanded') {
				expander.toggleClassName('ui-status-expanded', 'ui-status-collapsed');
				$('label', this).text(altTitle);
				panel.style.height = panel.getAttribute('ui-height') + 'px';
				panel.css('opacity: 1;');
			} else {
				$('label', this).text(title);
				panel.css({'height': '0px', 'opacity': 0});
				expander.toggleClass('ui-status-collapsed', 'ui-status-expanded');
			}
			$('header', expander).on('click', function() {
				var $this = $(this);
				if (panel.css('height') == '10px' || panel.css('height') == '0px') {
					panel.css('height', panel.attr('ui-height') + 'px');
					panel.css('opacity', 1);
					$('label', $this).text(altTitle);
					expander.toggleClassName('ui-status-collapsed', 'ui-status-expanded');
			
				} else {
					panel.css({'height': '0px', 'opacity': 0});
					$('label', $this).text(title);
					expander.toggleClassName('ui-status-expanded', 'ui-status-collapsed');
				}
			});
		},
		
		UICalculateNumberOfLines : function () {
			var lineHeight = parseInt($(this).css('line-height'), 10);
			var height = parseInt($(this).css('height'), 10);
			var lineNums = Math.floor(height / lineHeight);
			return lineNums;
		},
		
		UIParagraphEllipsis : function () {
			return this;
		},
		
		UIProgressBar : function ( opts ) {
			opts = opts || {};
			var className = opts.className || false;
			var width = opts.width || 100;
			var position = opts.position || 'after';
			var margin = opts.margin || '10px auto';
			var class_name = className ? ' class="'+className+'"': '';
			var bar = $.concat('<progress', class_name, " style='width: ", width, "px;", " margin: ", margin, ";'", "></progress>");
			return $(this).append(bar);
		},
		
		UIHideNavBarHeader : function ( ) {
			$(this).css({'visibility': 'hidden', 'position': 'absolute'});
		},
		
		UIShowNavBarHeader : function ( ) {
			$(this).css({'visibility': 'visible', 'position': 'static'});
		},
		
		UIActionSheet : function(opts) {
			var that = this;
			var actionSheetID = opts.id;
			var actionSheetColor = opts.color || 'undefined';
			var title = $.concat('<h3>', opts.title, '</h3>');
			var uiButtons = "", uiButtonObj, uiButtonImplements, uiButtonTitle, uiButtonCallback;
			if (!!opts.uiButtons) {
				$._each(opts.uiButtons, function(idx, button) {
					uiButtonTitle = button.title;
					uiButtonImplements = button.uiButtonImplements || "";
					uiButtonCallback = button.callback;
					actionSheetID.trim();
					uiButtons += $.concat("<uibutton ui-kind='action' ", ' ui-implements="', uiButtonImplements, '" class="stretch" onclick="', uiButtonCallback, '(\'#', actionSheetID, '\')"><label>', uiButtonTitle, "</label></uibutton>");
				});
			}
			var createActionSheet = function() {
				var color = '';
				if (actionSheetColor) color = $.concat(" ui-action-sheet-color='", actionSheetColor, "'");
				var actionSheetStr = $.concat("<actionsheet id='", actionSheetID, "' class='hidden' aria-hidden='true' role='dialog' style='display:none' ui-contains='action-buttons'", color, "><scrollpanel ui-scroller='", $.UIUuid(), "'><panel>", title, uiButtons, "<uibutton ui-kind='action' ui-implements='cancel' class='stretch' onclick='$.UIHideActionSheet(\"#", actionSheetID, "\")'><label>Cancel</label></uibutton></panel></scrollpanel></actionsheet>");
				$(that).append(actionSheetStr);
			};
			createActionSheet();
			var actionsheet = $("#" + actionSheetID);
			actionsheet.attr('aria-hidden','true');
			var scrollpanel = actionsheet.find('scrollpanel');
			var scroller =  scrollpanel.reduceToNode();
			var actionSheetUIButtons = $.concat("#", actionSheetID, " uibutton");
			$._each($.els(actionSheetUIButtons), function(idx, button) {
				$(button).on("click", function() {
					$.UIHideActionSheet();
				});
			});
		},
		
		UICenterElementToParent : function ( ) {
			var $this = $(this);
			if (!$this.reduceToNode()) return;
			var parent = $this.parent();
			var position;
			var parentTopPadding = 0;
			var parentLeftPadding = 0;
			if ($this.css('position') !== 'absolute') position = 'relative';
			else position = 'absolute';
			
			var height, width, parentHeight, parentWidth;
			if (position === 'absolute') {
				height = $this.clientHeight;
				width = $this.clientWidth;
				parentHeight = parent.clientHeight;
				parentWidth = parent.clientWidth;
			} else {
				height = parseInt($this.css('height'),10);
				width = parseInt($this.css('width'),10);
				parentHeight = parseInt(parent.css('height'),10);
				parentWidth = parseInt(parent.css('width'),10);
			}
			parentNodeName = parent.reduceToNode();
			if (_jq) {
				parentHeight += parseInt(parent.css('padding-top'),10);
				parentHeight += parseInt(parent.css('padding-bottom'),10);
				parentWidth += parseInt(parent.css('padding-left'),10);
				parentWidth += parseInt(parent.css('padding-right'),10);
			}
			var tmpTop, tmpLeft;
			if (parentNodeName.nodeName == 'app') {
				tmpTop = ((window.innerHeight /2) + window.pageYOffset) - height /2 + 'px';
				tmpLeft = (((window.innerWidth / 2) - width) / 2 + 'px');
			} else {
				parentTopPadding = parseInt(parent.css('padding-top'),10);
				parentLeftPadding = parseInt(parent.css('padding-left'),10);
				tmpTop = (parentHeight /2) - (height /2) - parentTopPadding + 'px';
				tmpLeft = (parentWidth / 2) - (width / 2) - parentLeftPadding + 'px';
			}
			$this.css({position: position, left: tmpLeft, top: tmpTop});
		},
		
		UIActivityIndicator : function ( opts ) {
			opts = opts || {};
			var panel;
			var color = '#000';
			var size = opts.size || '80px';
			var position = opts.position || null;
			var modal = opts.modal || false;
			var modalMessage = opts.modalMessage ? $.concat('<h5 role="dialog">',opts.modalMessage,'</h5>') : '';
			var modalPanelID = $.UIUuid();
			var style = $.concat('height:', size, ';  width:',size);
			var spinner;
			if (modal) {
				panel = document.createElement('panel');
				$(panel).attr('ui-implements','modal-activity-indicator');
				$(panel).attr('aria-visiblity','visible');
				$(panel).attr('role','dialog');
				$(panel).attr('id', modalPanelID);
				$(panel).css({'display':'-ms-flexbox','ms-flex-direction': 'column','-ms-flex-align':'center','-ms-flex-pack':'center', 'background-color':'#282828', 'height': '120px', 'width':'200px', 'z-index': 11111});
				spinner = document.createElement('progress');
				$(spinner).attr('role','progressbar');
				$(spinner).addClass('win-ring');
				$(panel).append(spinner);
				if (modalMessage) {
					$(panel).append(modalMessage);
				}
				$(this).append(panel);
				$('view[ui-navigation-status=current]').css('display','none');
				$(panel).ariaFocusChild('h5');
				$('view[ui-navigation-status=current]').css('display','-ms-flexbox');
				$(panel).find('h5').focus();
				$('#'+modalPanelID).UIBlock('0.5');
				var mp = $('#'+modalPanelID);
				mp.UICenterElementToParent();
				window.onresize = function(event) {
					try {
						mp.UICenterElementToParent();
					} catch(err) {}
				};
				$(document.body).on('orientationchange', function() {
					$('#'+modalPanelID).UICenterElementToParent();
				}, false);
			} else {
				spinner = document.createElement('progress');
				$(spinner).css({'width': size});
				$(spinner).attr('role','progressbar');
				if (position) $(spinner).attr('ui-bar-align', position);
				return $(this).append(spinner);
			}
			return this;
		},
		
		RemoveUIAcitivityIndicator : function ( ) {
			$(this).UIUnblock();
			try {
				var panel = $(this).find('panel[ui-implements=modal-activity-indicator]');
				panel.remove();
			} catch(error) {}
			var ai = $(this).find('progress');
			if (ai) ai.remove();
		},
		
		UISetTranstionType : function( transition ) {
			$(this).attr('ui-transition-type', transition);
		},
		
		UIFlipSubview : function ( direction ) {
			var view = $(this).closest("view");
			direction = direction || "left";
			view.UISetTranstionType("flip-" + direction);
			var subviews = $.els('subview', view);
			$(this).on("click", function() {
				switch (direction) {
					case "right":
						$(subviews[0]).toggleClassName("flip-right-front-in", "flip-right-front-out");
						$(subviews[1]).toggleClassName("flip-right-back-in", "flip-right-back-out");
						break;
					case "left":
						view.find("subview:nth-of-type(1)").toggleClassName("flip-left-front-in","flip-left-front-out");
						view.find("subview:nth-of-type(2)").toggleClassName("flip-left-back-in","flip-left-back-out");
						break;
					case "top":
					    $(subviews[0]).toggleClassName("flip-top-front-in", "flip-top-front-out");
					    $(subviews[1]).toggleClassName("flip-top-back-in", "flip-top-back-out");
						break;
					case "bottom":
						view.find("subview:nth-of-type(2)").toggleClassName("flip-bottom-front-in","flip-bottom-front-out");
						view.find("subview:nth-of-type(1)").toggleClassName("flip-bottom-back-in","flip-bottom-back-out");
						break;
					default:
						view.find("subview:nth-of-type(1)").toggleClassName("flip-right-front-in","flip-right-front-out");
						view.find("subview:nth-of-type(2)").toggleClassName("flip-right-back-in","flip-right-back-out");
				}
			});
		},
		
		UIPopSubview : function ( ) {
			var view = $(this).closest("view");
			view.UISetTranstionType("pop");
			$(this).on("click", function() {
				$("subview:nth-of-type(2)", view).toggleClassName("pop-in","pop-out");	
			});
		},
		
		UIFadeSubview : function ( ) {
			var view = $(this).closest("view");
			view.UISetTranstionType("fade");
			view.attr("ui-transition-type", "fade");
			$(this).on("click", function() {
				$("subview:nth-of-type(2)", view).toggleClassName("fade-in", "fade-out");
			});
		},
		
		UISpinSubview : function ( direction ) {
			var view = $(this).closest("view");
			view.UISetTranstionType("spin");
			if (!direction || direction === "left") {
				$(this).UISetTranstionType("left");
				$(this).on("click", function() {
					$("subview:nth-of-type(2)", view).toggleClassName("spin-left-in", "spin-left-out");
				});
			} else if (direction === "right") {
				$(this).UISetTranstionType("right");
				$(this).on("click", function() {
					$("subview:nth-of-type(2)", view).toggleClassName("spin-right-in", "spin-right-out");
				});
			} else {
				$(this).UISetTranstionType("left");
				$(this).on("click", function() {
					$("subview:nth-of-type(2)", view).toggleClassName("spin-left-in", "spin-left-out");
				});
			}
		},
		
		UIRepositionPopover : function() {
			var triggerElement = $(this).attr("data-popover-trigger"); 
			var popoverOrientation = $(this).attr("data-popover-orientation");
			var pointerOrientation = $(this).attr("data-popover-pointer-orientation");
			var popoverPos = $.determinePopoverPosition(triggerElement, popoverOrientation, pointerOrientation);
			$(this).css(popoverPos);
			
		},
		
		UIAdjustPopoverPosition : function() {
			var screenHeight = window.innerHeight;
			var screenWidth = window.innerWidth;
			var popoverHeight = _cc ? this.offsetHeight : $(this).height();
			var popoverWidth = _cc ? this.offsetWidth : $(this).width();
			var offset = $.absoluteOffset($(this));
			var popoverTop = offset.top;
			var popoverLeft = offset.left;
			var bottomLimit = popoverTop + popoverHeight;
			var rightLimit = popoverLeft + popoverWidth;
			if (bottomLimit > screenHeight) {
				this.style.top	= screenHeight - popoverHeight - 10 + "px";
			}
			if (rightLimit > screenWidth) {
				var leftDiff = (rightLimit) - screenWidth;
				var newLeft = Math.floor((popoverLeft - leftDiff) / 2);
				if (newLeft < 0) {
					newLeft = 2;
				}
				$(this).css({left: newLeft + "px"});
			}
		}
	};
	
	// Convert methods into appropriate forms for Element extension in libraries (ChocolateChp, jQuery, Zepto).
	UIConvertElementMethods(elementMethods);
	
	$(function() {			
		/* 
		Function to iterate over node collections. This gets used by ChocolateChip.js.
		jQuery and Zepto already provide this method. It will always return a plain DOM node so you can wrap it in $() or use $(this) to use node methods such as css(), etc.
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
				return this;
		  	};
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
		$.els = function ( selector, context ) {
			if (_cc) {
				if(context) {
					return $$(selector, context);
				} else {
					return $$(selector);
				}
			} else {
				if(context) {
					return $(selector, context);
				} else {
					return $(selector);
				}
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
		$.views = $.els('view');
		$.touchEnabled = (window.navigator.msPointerEnabled);
		$.userAction = 'MSPointerUp';
		$.eventStart = 'MSPointerDown';
		$.eventEnd = 'MSPointerUp';
		if (window.navigator.msPointerEnabled) {
		    $.userAction = 'MSPointerUp';
		    $.eventStart = 'MSPointerDown';
		    $.eventEnd = 'MSPointerUp';
		} else {
			$.userAction = 'click';
			$.eventStart = 'mousedown';
			$.eventEnd = 'click';
			var stylesheet = $('head').find('link[rel=stylesheet]').attr('href');
			var stylesheet1 = '';
			if (/min/.test(stylesheet)) {
				stylesheet1 = stylesheet.replace(/chui\.android\.min\.css/, 'chui.android.desktop.css');
			} else {
				stylesheet1 = stylesheet.replace(/chui\.android\.css/, 'chui.android.desktop.css');
			}
			$('head').append(['<link rel="stylesheet" href="',stylesheet1,'">'].join(''));
		}
			
		if ( _jq || _zo) {
			$.fn.hasAttr = function(property) {
				return $(this).attr(property);
			};
			$.slice = Array.prototype.slice;
		}
		
		var navigationListItems = $.els('tablecell');
		$._each(navigationListItems, function(idx, ctx) {
			if ($(ctx).hasAttr('href')) {
				$(ctx).attr('role', 'button');
				$(ctx).closest('tableview').attr('role','list');
			} else {
				$(ctx).attr('role', 'listitem');
			}
		});
		
		$.extend($, {
			
			UIUuidSeed : 0,
			
			UIUuid : function() {
				$.UIUuidSeed++;
				var date = Date.now() + $.UIUuidSeed;
				return date.toString(36);
			},
			
			
			ctx : function(node) {
				try {
					return (node.nodeType !== 1 && typeof node === 'object') ? node[0] : node;
				} catch(err) {};
				return this;
			},
	
			UIEnableScrolling : function ( options ) {
				options = options || {};
				$._each($.els("scrollpanel"), function(idx, ctx) {
					var scroller = new iScroll(ctx, options);
					//$(ctx).data("ui-scroller", scroller);
				});
			},
			
			UINavigationHistory : ['#main'],
			
			UINavigateBack : function() {
				var histLen = $.UINavigationHistory.length;
				var currentView = "#" + $('view[ui-navigation-status=current]')
					.attr('id');
				$($.UINavigationHistory[histLen -1])
					.css({'visibility':'visible'})
					.attr('ui-navigation-status', 'current');
				$($.UINavigationHistory[histLen-1]).removeAttr('aria-hidden');
				$(currentView).attr('ui-navigation-status', 'upcoming');
				$(currentView).attr('aria-hidden', 'true');
				$(currentView).css('visibility', 'hidden');
				 if ($.app.attr('ui-kind')==='navigation-with-one-navbar' && $.UINavigationHistory[histLen-1] === '#main') {
 					$('navbar > uibutton[ui-implements=back]', $.app).css({'display':'none'});
 				}
 				$.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1]);
 				if ($.UINavigationHistory[$.UINavigationHistory.length-1] !== '#main') {
 					$.UINavigationHistory.pop();
 				}
			},
			
			UINavigateBackToView : function ( viewID ) {
				var historyIndex = $.UINavigationHistory.indexOf(viewID);
				$.UINavigationHistory = $.UINavigationHistory.splice(historyIndex);
				var views = $('app').findAll('views');
				$._each(views, function(idx, ctx) {
					if ($(ctx).attr('ui-navigation-status' == 'current')) {
						$(ctx).attr('ui-navigation-status','traversed');
						$(ctx).css("visibility", "hidden");
					}
				});
				$.resetApp();
				$.UINavigateToView(viewID);
			},
			
			UINavigationListExits : false,

		   UINavigationEvent : false,
						
			UIOutputHashToUrl : null,
			
			UITrackHashNavigation : function ( url, delimeter ) {
				url = url || true;
				$.UIOutputHashToUrl = url;
				$.UISetHashOnUrl($.UINavigationHistory[$.UINavigationHistory.length-1], delimeter);
			},
			
			UINavigationList : function() {
				var navigateList = function(node) {
					var currentNavigatingView = $(node).closest('view');
					var currentViewID = '#' + $(currentNavigatingView).attr('id');
					node = $(node);
					node.attr('role','link');
					var href = node.attr('href');
					if (/^#/.test(href) == false) return;
					try {
						if ($.UIOutputHashToUrl) {
							if ($(href).hasAttr('ui-uri')) {
								$.UISetHashOnUrl($(href).attr('ui-uri'), '#');
							} else {
								$.UISetHashOnUrl(href);
							}
						}
						$(node.attr('href')).attr('ui-navigation-status', 'current');
						$(node.attr('href')).removeAttr('aria-hidden');
						$(node.attr('href')).css('visibility', 'visible');
						$(currentViewID).attr('ui-navigation-status', 'traversed');
						$(currentViewID).attr('aria-hidden', 'true');
						$(currentViewID).css('visibility', 'hidden');
						if ($('#main').attr('ui-navigation-status') !== 'traversed') {
							$('#main').attr('ui-navigation-status', 'traversed');
							$('#main').attr('aria-hidden', 'true');
							$('#main').css('visibility', 'hidden');
						}
						
						if (currentViewID != '#main') {
							$.UINavigationHistory.push(currentViewID);
						}
						currentNavigatingView.on('MSTransitionEnd', function(event) {
							if (_jq) {
								if (event.type === 'MSTransitionEnd') {
									node.removeClass('disabled');
								}
							} else {
								if (event.propertyName === 'transform') {
									node.removeClass('disabled');
								}
							}
						});
					} catch(err) {} 
				};
				
				$.app.on('MSPointerDown', 'tablecell', function(ctx) {
					var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
					$(node).addClass('touched');
					setTimeout(function() {
						$(node).removeClass('touched')
					}, 250);
				});
				$.app.on('MSPointerUp', 'tablecell', function (ctx) {
					var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
					$(node).addClass('touched');
					setTimeout(function () {
						 $(node).removeClass('touched')
					}, 4000);
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
			},
			
			UINavigateToView : function(viewID) {
				var currentView = $('view[ui-navigation-status=current]').attr('id');
				if (currentView !== 'main') {
					$.UINavigationHistory.push("#" + currentView);
				}
				$.UINavigationListExits = true;
				var histLen = $.UINavigationHistory.length;
				$($.UINavigationHistory[histLen-1]).attr('ui-navigation-status','traversed');
				$($.UINavigationHistory[histLen-1]).attr('aria-hidden', 'true');
				$($.UINavigationHistory[histLen-1]).css('visibility', 'hidden');
				$(viewID).attr('ui-navigation-status','current');
				$(viewID).removeAttr('aria-hidden');
				$(viewID).css('visibility', 'visible');
				if ($.app.attr('ui-kind') === 'navigation-with-one-navbar') {
					try {
						$('navbar uibutton[ui-implements=back]').css({'display':'block'});
						$('navbar uibutton[ui-implements=backTo]').css({'display':'block'});
					} catch(err) {}
				}
				if ($(viewID).hasAttr('ui-uri')) {
					$.UISetHashOnUrl($(viewID).attr('ui-uri'));
				} else {
				   $.UISetHashOnUrl(viewID);
				}
			},
			
			UINavigateToNextView : function ( viewID ) {
				return $.UINavigateToView(viewID);
			},
			
			UISetHashOnUrl : function ( url, delimiter ) {
				delimiter = delimiter || '#/';
				if ($.UIOutputHashToUrl) {
					var hash;
					if (/^#/.test(url)) {
						hash = delimiter + (url.split('#')[1]);
					} else {
						hash = delimiter + url;
					}
					window.history.replaceState('Object', 'Title', hash);
				}
			},
		
			resetApp : function ( hard ) {
				if (hard === "hard") {
					window.location.reload(true);
				} else {
					$._each($.views, function(idx, ctx) {
						$(ctx).attr("ui-navigation-status", "upcoming");
						$(ctx).css("visibility", "hidden");
					});
					$.main.attr("ui-navigation-status", "current");
					$.main.css("visibility", "visible");
					$.UINavigationHistory = ["#main"];
				}
			},
			
			UITouchedTableCell : null,
			
			setupAriaForViews : function() {
				var views = $.els('view');
				$._each(views, function(idx, ctx) {
					if ($(ctx).attr('ui-navigation-status') !=='current') {
						$(ctx).attr('aria-hidden', 'true');
						$(ctx).css('visibility', 'hidden');
					} else {
						$(ctx).attr('aria-hidden', 'false');
						$(ctx).css('visibility', 'visible');
					}
				});
			},
			
			absoluteOffset : function(element) {
				element = $(element).reduceToNode();
    			var top = 0, left = 0;
				 do {
					  top += element.offsetTop  || 0;
					  left += element.offsetLeft || 0;
					  element = element.offsetParent;
				 } while(element);

				 return {
					  top: top,
					  left: left
				 };
			},
			
			UIStepper : function (opts) {
				var stepper = $(opts.selector);
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
				var stepperTemp = decreaseButton + "<label ui-kind='stepper-label'></label><input type='text'/>" + increaseButton;
				stepper.append(stepperTemp);
				if (opts.range.values) {
					stepper.data('range-value', opts.range.values.join(','));
				}
				if (!opts.defaultValue) {
					if (!!opts.range.start || opts.range.start === 0) {
						defaultValue = opts.range.start === 0 ? '0': opts.range.start;
					} else if (opts.range.values instanceof Array) {
						defaultValue = opts.range.values[0];
						$('uibutton:first-of-type', opts.selector).addClass('disabled');
					}
				} else {
					defaultValue = opts.defaultValue;
				}
				if (range) {
					stepper.data('range-value', range.join(','));
				}
				$('label[ui-kind=stepper-label]', stepper).text(defaultValue);
				$('input', stepper).value = defaultValue;
				if (opts.namePrefix) {
					var namePrefix = opts.namePrefix + '.' + stepper.id;
					$('input', stepper).attr('name', namePrefix);
				} else {
					$('input', stepper).attr('name', stepper.id);
				}
				if (defaultValue === opts.range.start) {
					$('uibutton:first-of-type', stepper).addClass('disabled');
				}
				if (defaultValue == opts.range.end) {
					$('uibutton:last-of-type', stepper).addClass('disabled');
				}
				$('uibutton:first-of-type', opts.selector).on($.eventStart, function(button) {
					$.decreaseStepperValue.call(this, opts.selector);
				});
				$('uibutton:last-of-type', opts.selector).on($.eventStart, function(button) {
					$.increaseStepperValue.call(this, opts.selector);
				});
			},
			
			decreaseStepperValue : function(selector) {
				var values = $(selector).data('range-value');
				values = values.split(',');
				var defaultValue = $('label', selector).text().trim();
				var idx = values.indexOf(defaultValue);
				if (idx !== -1) {
					$('uibutton:last-of-type', selector).removeClass('disabled');
					$('[ui-kind=stepper-label]', selector).text(values[idx-1]);
					$('input', selector).val(values[idx-1]);
					if (idx === 1) {
						$(this).addClass('disabled');
					} 
				}	
			},	
			
			increaseStepperValue : function(selector) {
				var values = $(selector).data('range-value');
				values = values.split(',');
				var defaultValue = $('label', selector).text().trim();
				var idx = values.indexOf(defaultValue);
				if (idx !== -1) {
					$('uibutton:first-of-type', selector).removeClass('disabled');
					$('label[ui-kind=stepper-label]', selector).text(values[idx+1]);
					$('input', selector).val(values[idx+1]);
					if (idx === values.length-2) {
						$(this).addClass('disabled');
					}
				}
			},
			
			resetStepper : function(selector) {
				var value = $(selector).data('range-value');
				value = value.split(',')[0];
				$(selector).find('label').text(value);
				$(selector).find('uibutton:first-of-type').addClass('disabled');
				$(selector).find('uibutton:last-of-type').removeClass('disabled');
			},
		});
	
		
		$.app.delegate('view','MSTransitionEnd', function() {
			if (!$('view[ui-navigation-status=current]')) {
				$($.UINavigationHistory[$.UINavigationHistory.length-2])	 
					.attr('ui-navigation-status', 'current');
				$.UINavigationHistory.pop(); 
			}	
			$.UINavigationEvent = false;
		});
		
		$.UINavigationList();
		
		$.app.on('MSPointerDown', 'uibutton', function(ctx) {
			var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
			$(node).addClass('touched');
			setTimeout(function() {
				$(node).removeClass('touched');
			}, 1000);
		});
		$.app.on('MSPointerUp', 'uibutton', function(ctx) {
			var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
			$(node).removeClass('touched');
			if ($(node).attr('ui-implements') === 'back') {
				if ($.UINavigationListExits) {
					$.UINavigateBack();
					$.UINavigationEvent = false;
				}
			}
		});
		$.app.on('MSPointerCancel', 'uibutton', function(ctx) {
			var node = ctx.nodeType === 1 ? $.ctx(ctx) : $.ctx(this);
			$(node).removeClass('touched');
		});
		
		$.app.UIInitSwitchToggling();

		$.extend($, {
		    UIScrollTo : function (element, to, duration, orientation) {
		        var el = $.ctx(element);
		        var start = orientation == 'vertical' ? el.scrollTop : el.scrollLeft;
              var change = to - start;
              var currentTime = 0;
              var increment = 20;
				  
		        //t = current time
		        //b = start value
		        //c = change in value
		        //d = duration
		        var easeOutQuintic = function (t, b, c, d) {
		            return c * ((t = t / d - 1) * (Math.pow(t, 4)) + 1) + b;
		        };
		        var animateScroll = function () {
		            currentTime += increment;
		            var val = easeOutQuintic(currentTime, start, change, duration);
		            if (orientation == 'vertical') {
		            	el.scrollTop = val;
		            } else {
		            	el.scrollLeft = val;
		            }
		            if (currentTime < duration) {
		                setTimeout(animateScroll, increment);
		            }
		        };
		        animateScroll();
		    },
		    UIPaging: function (selector) {

			   var myPager = $(selector);
				var stack = null;
				stack = $('stack', selector);
				var scrollerPanels = _cc ? stack.childElements() : stack.children();
				var width = 0;
				$._each(scrollerPanels, function (idx, ctx) {
				    width += parseInt($(ctx).css('width'));
				    $(ctx).attr('ui-child-position', idx);
				});
				myPager._first().css({ 'width': width + 'px' });
				var indicatorsWidth = $(selector).css('width');
				var guid = $.UIUuid();
				var indicators = '<stack id="' + guid + '" ui-implements="indicators"  role="radiogroup" style="width:' + indicatorsWidth + '">';
				scrollerPanels.eq(0).addClass('active');
				var panels = stack.childElements();
				$._each([].slice.apply(panels), function(idx, ctx) {
					if (idx === 0) {
						indicators += '<indicator class="active" title="page 1 of'+panels.length+'"><input type="radio" name="group'+guid+'"></indicator>';
					} else {
						$(ctx).attr('aria-hidden','true');
						indicators += "<indicator title='"+ (idx+1) +" of "+panels.length+"'><input type='radio' name='group"+guid+"'></indicator>";
					}
				});
				indicators += "</stack>";
				// The maximum number of indicators in portrait view is 17.
				$(selector).parent().append(indicators);
				var indicatorBase = $('#'+guid);
				indicatorBase.UIIdentifyChildNodes();
				var indics = indicatorBase.childElements();

				$(indicatorBase).on('click', 'indicator', function (indicator) {
				    var item = indicator.nodeType === 1 ? $.ctx(indicator) : $.ctx(this);
				    var whichPanel = $(item).attr('ui-child-position');
				    var scrollPos = whichPanel * parseInt(indicatorsWidth, 10);
				    $._each(indics, function (idx, ctx) {

				        $(ctx).removeClass('active');
				    });
				    $(item).addClass('active');
				    $.UIScrollTo($.ctx(myPager), scrollPos, 1000);
					var activePanel = scrollerPanels.eq($(item).attr('ui-child-position'));
					activePanel.addClass("active");
					activePanel.removeAttr('aria-hidden');
					var focusableChild = activePanel._first();
					focusableChild.attr('tabindex', '-1');
				});
				myPager.on('scroll', function () {
				    var scrollLeft = this.scrollLeft;
				    var panelWidth = parseInt($(this).css('width'));
				    var width = parseInt($(this).css('width'));
				    var pos = 0;
				    if (scrollLeft < panelWidth) {
				        pos = 0;
				    } else {
				        pos = Math.round(scrollLeft / panelWidth);
				    }

				    var indicators = _cc ? $(indicatorBase).childElements() : $(indicatorBase).children();
				    $._each(indicators, function (idx, ctx) {
				        $(ctx).removeClass('active');
				    });

				    indicators.eq(pos).addClass('active');
				});
				
			},
			
			UISetupPaging : function() {
				if ($("stack[ui-implements=paging]")) {
					var pagingStacks = $.els("stack[ui-implements=paging]");
					$._each(pagingStacks, function(idx, stack) {
						$.UIPaging(stack);
					});
				}
			}
		});
		
		$(function() {
			$.UISetupPaging();
		});
		
		$.extend($, {
			
			UIDeleteTableCell : function( options ) {
				/* options = {
					selector: selector,
					editButton: [label1, label2],
					deleteButton: label3,
					toolbar: toolbar,
					callback: callback
				} */
			    var defaultCheckboxColor = '#0099e3';
				var checkboxHeight = 30;
				var label1;
				if (options.editButton) {
					label1 = options.editButton[0];
				} else {
					label1 = 'Edit';
				}
				var label2;
				if (options.editButton) {
					label2 = options.editButton[1];
				} else {
					label2 = 'Done';
				}
				var label3;
				if (options.deleteButton) {
					label3 = options.deleteButton;
				} else {
					label3 = 'Delete';
				}
				var callback = options.callback || function() {};
				this.deletionList = [];
				var listEl = $(options.selector);
				var toolbarEl = $(options.toolbar);
				var button = toolbarEl._first();
				button = button.reduceToNode();
				try {
					if (button && button.nodeName === 'UIBUTTON') {
						button.attr('ui-contains','uibutton');
					}
				} catch(err) {}
				var deleteButtonTmpl = $.concat('<uibutton role="button" ui-kind="deletionListDeleteButton" ui-bar-align="left" ui-implements="delete" class="disabled" style="display: none;"><label>', label3, '</label></uibutton>');
				var editButtonTmpl = $.concat('<uibutton role="button" ui-kind="deletionListEditButton" ui-bar-align="right"  ui-implements="edit"',' ui-button-labels="',label1,' ',label2,'"><label>', label1, '</label></uibutton>');
				$(toolbarEl).prepend(deleteButtonTmpl);
				$(toolbarEl).append(editButtonTmpl);
				var deleteDisclosure = '<deletedisclosure><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><g id="svg3804" xmlns:svg="http://www.w3.org/2000/svg"><g id="layer1" transform="matrix(2.8817229,0,0,2.9517892,5.3723918,5.2474312)"><path id="path3908" fill="#FFFFFF" d="M10.68,0.878l2.11,1.471l-7.485,9.318L0.081,6.493l1.758-1.839l3.215,3.188L10.68,0.878z"/></g></g></svg></span></deletedisclosure>';
				$._each($.els(options.selector + " > tablecell"), function(idx, ctx) {
					$(ctx).prepend(deleteDisclosure);
				});
				listEl.attr('data-deletable-items', '0');
				var UIEditExecution = function() {
					$(options.toolbar + ' > uibutton[ui-implements=edit]').on($.eventStart, 
						function() {
							if ($('label', this).text() === label1) {
								$(this).UIToggleButtonLabel(label1, label2);
								$(this).attr('ui-implements', 'done');
								listEl.addClass('ui-show-delete-disclosures');
								$(this).parent()._first().css({'display': '-ms-inline-flexbox'});
								var toolbarButtons = toolbarEl.childElements();
								var toolbarButton = toolbarButtons.eq(0).reduceToNode();
								toolbarButton = toolbarButton.nodeName;
								if (/uibutton/i.test(toolbarButton)) {
								   toolbarEl.childElements().eq(1).css('display', 'none');
								   $.hiddenButtonByDeletion = toolbarEl.childElements().eq(1);
								}
								$._each($.els("tablecell > img", listEl), function(idx, ctx) {
									$(ctx).css('transform','translate3d(40px, 0, 0)');
								});
							} else {
								$(this).UIToggleButtonLabel(label1, label2);
								$(this).removeAttr('ui-implements');
								$(this).parent()._first().css('display', 'none');
								$(this).parent().childElements().eq(1).css('display', 'block');
								listEl.removeClass('ui-show-delete-disclosures');
								$._each($.els('deletedisclosure'), function(idx, ctx) {
									$(ctx).removeClass('checked');
									$(ctx).closest('tablecell').removeClass('deletable');
								});
								if (/uibutton/i.test(toolbarButton)) {
								   toolbarButtons.eq(1).css('display', '-ms-inline-flexbox');
								}
								$('uibutton[ui-implements=delete]').addClass('disabled');
								$._each($.els('tablecell > img', listEl), function(idx, ctx) {
									$(ctx).css('transform','translate3d(0, 0, 0)');
								});
							}
						}
					);
				};
				var UIDeleteDisclosureSelection = function() {
					$._each($.els('deletedisclosure'), function(idx, disclosure) {					
						$(disclosure).on($.eventStart, function() {
							$(disclosure).toggleClass('checked');
							$(disclosure).closest('tablecell').toggleClass('deletable');
							$('uibutton[ui-implements=delete]', toolbarEl).removeClass('disabled');
							if (!$(disclosure).closest('tablecell').hasClass('deletable')) {
								if (Number(listEl.attr("data-deletable-items")) < 2) {
									listEl.attr("data-deletable-items", '0');
									toolbarEl.find("uibutton[ui-implements=delete]").addClass("disabled");
								} else {
									listEl.attr("data-deletable-items", Number(listEl.attr("data-deletable-items")) - 1);
								}
							} else {
								listEl.attr('data-deletable-items', Number(listEl.attr("data-deletable-items")) + 1);
							}
						});
					});
				};
				var UIDeletionExecution = function() {
					$._each($.els('uibutton[ui-implements=delete]'), function(idx, ctx) {
						$(ctx).on('click', function() {
							if ($(this).hasClass('disabled')) {
								return;
							}
							$._each($.els('.deletable'), function(index, context) {
								listEl.attr('data-deletable-items', parseInt(listEl.attr('data-deletable-items'), 10) - 1);
								if (!!callback) {
								    callback.call(this, context);
								}
								if (_cc) {
								    context.remove();
								} else {
								    $(context).remove();
								}
								listEl.attr('data-deletable-items', '0');
							});
							$(this).addClass('disabled');
						});
					});
				};
				
				UIEditExecution();
				UIDeleteDisclosureSelection();
				UIDeletionExecution();
			},
			
			UIResetDeletionList : function(node, toolbar) {
				node = $(node);
				toolbar = $(toolbar);
				if (node.hasClass("ui-show-delete-disclosures")) {
					node.attr("data-deletable-items", 0);
					$._each(node.childElements(), function(idx, ctx) {
						try {
							$(ctx)._first().removeClass('checked');
						} catch(err) {}
					});
					node.find("deletedisclosure").removeClass("checked");
					node.removeClass("ui-show-delete-disclosures");
					var resetLabel = toolbar.find("uibutton[ui-kind=deletionListEditButton]").attr("ui-button-labels");
					resetLabel = resetLabel.split(" ");
					resetLabel = resetLabel[0];
					toolbar.find("uibutton[ui-kind=deletionListEditButton] > label").text(resetLabel);
					toolbar.find("uibutton[ui-kind=deletionListEditButton]").attr("ui-implements", "edit");
					toolbar.find("uibutton[ui-kind=deletionListDeleteButton]").css("display", "none");
					toolbar.find("uibutton[ui-kind=deletionListDeleteButton]").toggleClass('disabled');
					$._each($.els("tablecell > img", node), function(idx, ctx) {
						$(ctx).css('transform','translate3d(0, 0, 0)');
					});					
				}
				$._each($.els('tablecell', node), function(idx, ctx) {
					$(ctx).removeClass('deletable');
				});
				if ( $.hiddenButtonByDeletion) {
					 $($.hiddenButtonByDeletion).css('display','block');
					 $.hiddenButtonByDeletion = null;
				}				
			},
			
			UIPopUpIsActive : false,
			UIPopUpIdentifier : null,
			UIPopUp : function( opts ) {
				/*
				opts {
					id: 'alertID',
					title: 'Alert',
					message: 'This is a message from me to you.',
					cancelUIButton: 'Cancel',
					continueUIButton: 'Go Ahead',
					callback: function() { // do nothing }
				}
				*/
				var id = opts.id || $.UIUuid();
				var title = opts.title || 'Alert!';
				var message = opts.message || '';
				var cancelUIButton = opts.cancelUIButton || 'Cancel';
				var continueUIButton = opts.continueUIButton || 'Continue';
				var callback = opts.callback || function() {};
				var popup = $.concat('<popup role="alertdialog" id=', id, ' ui-visible-state="hidden" aria-hidden="true"><panel><h1>', title, '</h1><p role="note">', message, '</p><toolbar ui-placement="bottom"><uibutton role="button" ui-kind="action" ui-implements="cancel"><label>', cancelUIButton, '</label></uibutton><uibutton role="button" ui-kind="action" ui-implements="continue"><label>', continueUIButton, '</label></uibutton></toolbar></panel></popup>');
				$('app').append(popup);
				var popupID = '#' + id;
				$(popupID).UIBlock('0.5');
				var popupBtn = '#' + id + ' uibutton';
				$._each($.els(popupBtn), function(idx, ctx) {
					$(ctx).on($.eventEnd, cancelClickPopup = function(e) {
						$("#openPopup").css({'pointer-events':'visible'});
						if ($(ctx).attr('ui-implements')==='continue') {
							callback.call(callback, this);
						}
						$.UIClosePopup('#' + id);
					});
					$.UIPopUpIsActive = false;
					$.UIPopUpIdentifier = null;
					$.UIPopUpIsActive = false;
					$.UIPopUpIdentifier = null;
				});
			},
			
			UIShowPopUp : function( options ) {
				$.UIPopUp(options);
				$.UIPopUpIsActive = true;
				$.UIPopUpIdentifier = '#' + options.id;
				$($.UIPopUpIdentifier).attr('aria-hidden', 'false');
				var screenCover = $('mask');
				screenCover.on('touchmove', function(e) {
					e.preventDefault();
				});
				var thePopup = $('#' + options.id);
				screenCover.attr('ui-visible-state', 'visible');
				setTimeout(function () {
				    thePopup.attr('ui-visible-state', 'visible');
				    thePopup.ariaFocusChild('h1');
				}, 50);
				$('view[ui-navigation-status=current]').attr('aria-hidden', 'true');
				$('view[ui-navigation-status=current]').ariaHide();
				$('view[ui-navigation-status=current]').css('display','none');
				$('view[ui-navigation-status=current]').css('display','block');
			},
			
			UIClosePopup : function ( selector ) {
				$(selector + ' uibutton[ui-implements=cancel]').UIRemovePopupBtnEvents('click', 'cancelClickPopup');
					$(selector + ' uibutton[ui-implements=continue]').UIRemovePopupBtnEvents('click', 'cancelTouchPopup');
			   var popupSelector = $(selector);
				var parentNode = popupSelector.nodeType === 1 ? popupSelector.parentNode : popupSelector[0].parentNode;
				var popupMask = parentNode.querySelector('mask');
				parentNode.removeChild(popupMask);
				$('view[ui-navigation-status=current]').removeAttr('aria-hidden');
				$('view[ui-navigation-status=current]').ariaFocusChild('h1');
				$(selector).attr('ui-visible-state', 'hidden');
				setTimeout(function () {
				    $(selector).remove();
				}, 200);
				$.UIPopUpIdentifier = null;
				$.UIPopUpIsActive = false;
			},
			
			UIShowActionSheet : function(actionSheetID) {
				$.app.data('ui-action-sheet-id', actionSheetID);
				var actionsheet = $(actionSheetID);
				actionsheet.css('display','block');
				actionsheet.UIBlock();
				actionsheet.attr('aria-hidden','false');
				$('view[ui-navigation-status=current]').css('display','none');
				setTimeout(function () {
				    if ($.msPointerEnabled) {
				        $('view[ui-navigation-status=current]').css('display', 'block');
				    } else {
				        $('view[ui-navigation-status=current]').css('display', '-ms-flexbox');
				    }
				},100);
				setTimeout(function() {
					actionsheet.ariaFocusChild('h3');
				},1000);
				$('view[ui-navigation-status=current]').attr('aria-hidden','true');
				var screenCover = $('mask');
				screenCover.css({'opacity': '.5'});
				screenCover.attr('ui-visible-state', 'visible');
				setTimeout(function() {
					$(actionSheetID).removeClass('hidden');
				}, 1);
				screenCover.on('touchmove', function(e) {
					e.preventDefault();
				});
			},
			
			UIHideActionSheet : function() {
				var actionSheetID = $.app.data('ui-action-sheet-id');
				actionSheet = $(actionSheetID);
				try { 
					actionSheet.addClass('hidden');
					var parentNode = $('body');
					var popupMask = parentNode.querySelector('mask');
					parentNode.removeChild(popupMask);
					actionSheet.attr('aria-hidden','true');
					$('view[ui-navigation-status=current]').removeAttr('aria-hidden');
					setTimeout(function (actionsheet) {
					    if (actionsheet) {
					        actionSheet.css('display', 'none');
					    }
					},500);
					$('view[ui-navigation-status=current]').ariaFocusChild('h1');
				 } catch(e) {}
				$.app.removeData('ui-action-sheet-id');
			},
			
			UIReadjustActionSheet : function() {
				var actionSheetID = '';
				if ($.app.data('ui-action-sheet-id')) {
					actionSheetID = $.app.data('ui-action-sheet-id');
					$(actionSheetID).css({'right': '0px', 'bottom': '0px', 'left': '0px'});
					if ($.touchEnabled) {
						if ($.standalone) {
							$(actionSheetID).css({'right': '0px', 'bottom': '0px', 'left': '0px'});
						} else {
						    if ($.msPointerEnabled) {
						        $(actionSheetID).css({ 'right': '0px', 'bottom': '0px', 'left': '0px', 'transform': 'translate3d(0,0,0)' });
						    } else {
						        $(actionSheetID).css({ 'right': '0px', 'bottom': '0px', 'left': '0px', 'transform': 'translate3d(0,0,0)' });
						    }
						}
					}
				}
				$.UIPositionMask();
			},
			
			UIAlphabeticalList : function() {
				var alphaTable = _cc ? $("tableview[ui-kind='titled-list alphabetical']") : $("tableview[ui-kind='titled-list alphabetical']")[0];
				if (alphaTable) {
					var titles = [];
					var uuidSeed = $.UIUuid();
					var counter = 0;
					var alphabeticalList = '<stack ui-kind="alphabetical-list">';
					var alphabeticalListItems = "";
					var tableheaders = $(alphaTable).findAll("tableheader");
					$._each(tableheaders, function(idx, title) {
						var titleText = title.innerHTML;
						title = $(title);
						counter++;
						title.attr("id", $.concat("alpha_", titleText, uuidSeed, counter));
						alphabeticalListItems += $.concat('<span href="#alpha_', titleText, uuidSeed, counter, ' ">', titleText, '</span>');
					});
					alphabeticalList += alphabeticalListItems + '</stack>';
					$(alphaTable).closest("scrollpanel").after(alphabeticalList);
				} else {
					return;
				}
				var scroller = $("tableview[ui-kind='titled-list alphabetical']").closest("scrollpanel");
				var sc = scroller.reduceToNode();
				$.app.on("click","stack[ui-kind='alphabetical-list'] > span",  function(ctx) { 
					var alpha = $.ctx(ctx) || $(this);
					var absolutePos = $.absoluteOffset(alpha.attr("href"));
					console.dir(absolutePos.top);
					var pos = absolutePos.top;
					$.UIScrollTo($.ctx(scroller).parentNode, pos, 1000, 'vertical');
				});
			},
			
			UIPositionMask : function() {
				if ($.els("mask").length > 0) {
					$("mask").css({"height": + (window.innerHeight + window.pageYOffset), width : + window.innerWidth});
				}
			},
			
			UICancelSplitViewToggle : function () {
				$.body.addClass('SplitViewFixed');
			},
			
			rootview : $('rootview'),
			resizeEvt : ('onorientationchange' in window ? 'orientationchange' : 'resize'),
			
			UISplitView : function ( ) {
				if ($.body.hasClass('SplitViewFixed')) {
					return;
				}
				var buttonLabel = $("rootview > panel > view[ui-navigation-status=current] > navbar").text();
				$("detailview > navbar").append("<uibutton id ='showRootView'  class='navigation' ui-bar-align='left'>"
			+ buttonLabel + "</uibutton>");
				if (window.innerWidth > window.innerHeight) {
					$.body.addClass("landscape");
					$.body.removeClass("portrait");
					$.rootview.css({display: "block", height: "100%", "margin-bottom": "1px"});
				} else {
					$.body.addClass("portrait");
					$.body.removeClass("landscape");
					$.rootview.css({display: 'none','height': (window.innerHeight - 100) + "px"});
				}
				$("detailview navbar h1").text($.els("tableview[ui-implements=detail-menu] > tablecell").eq(0).text());
			},
			
			UISetSplitviewOrientation : function() {
				if ($.body.hasClass("SplitViewFixed")) {
					return;
				}
				if ($.resizeEvt) {
					if (window.innerWidth > window.innerHeight) {
						$.body.addClass("landscape");
						$.body.removeClass("portrait");
						$.rootview.css({display: "block", height: "100%", "margin-bottom": "1px"});
						$.app.UIUnblock();
					} else {
						$.app.UIUnblock();
						$.body.addClass("portrait");
						$.body.removeClass("landscape");
						$.rootview.css({display: "none", height: (window.innerHeight - 100)+'px'});
					}
					$.UIEnableScrolling();
				}
			},
			
			UIToggleRootView : function() {
				if ($.body.hasClass("SplitViewFixed")) {
					return;
				}
				if ($.rootview.css("display") === "none") {
					$.rootview.css("display", "block");
					$.app.UIBlock(".01");
				} else {
					$.rootview.css("display","none");
					$.app.UIUnblock();
				}
			},			
			UICheckForSplitView : function ( ) {
				if ($.body.hasClass("SplitViewFixed")) {
					return;
				}
				var splitview = $("splitview");
				if (splitview) splitview = splitview.reduceToNode();
				if (splitview) {
					$.UISplitView();
					$("#showRootView").on("click", function() {
						$.UIToggleRootView();
					});
					$.body.on("orientationchange", function(){
						$.UISetSplitviewOrientation();
					});
					window.onresize = function() {
						$.UISetSplitviewOrientation();
					};
				}
			},
			
			UICurrentSplitViewDetail : null,
			
			determineMaxPopoverHeight : function() {
				var screenHeight = window.innerHeight;
				var toolbarHeight;
				try {
					if ($('navbar')) {
						toolbarHeight = $('navbar').clientHeight;
					}
					var toolbar = $('toolbar').reduceToNode();
					if (toolbar) {
						if (!$('toolbar').attr('ui-placement')) {
							toolbarHeight = toolbar.clientHeight;
						}
					}
				} catch(err) {}
				screenHeight = screenHeight - toolbarHeight;
				return screenHeight; 			
			},
			
			determinePopoverWidth : function() {
				var screenWidth = window.innerWidth;
			},
			
			adjustPopoverHeight : function( popover ) {
				var availableVerticalSpace = $.determineMaxPopoverHeight();
				$(popover).find("section").css({"max-height":(availableVerticalSpace - 100) + "px"});
				var popoverID = popover.split("#");
				popoverID = popoverID[1];
			},
			
			determinePopoverPosition : function( triggerElement, popoverOrientation, pointerOrientation ) {
				pointerOrientation = pointerOrientation.toLowerCase();
				var trigEl = $(triggerElement).reduceToNode();
				var popoverPos = {};
				var offset = $.absoluteOffset(trigEl);
				if (pointerOrientation === 'left') {
					popoverPos.left = offset.left + 'px';
				} else if (pointerOrientation === 'center') {
					popoverPos.left = (offset.left + (trigEl.offsetWidth/2) - 160) + 'px';
				} else {
					popoverPos.left = ((offset.left + trigEl.offsetWidth) - 280) +'px';
				}
				popoverPos.top = (offset.top + trigEl.offsetHeight + 20) +'px';
				return popoverPos;	
			},
			
			UIPopover : function( opts ) {
				var title = '';
				var popoverID = '';
				var triggerElement = opts.triggerElement;
				var popoverOrientation = opts.popoverOrientation;
				var pointerOrientation = opts.pointerOrientation;
				if (opts) { 
					popoverID = opts.id ? opts.id : $.UIUuid();
					title = opts.title ? $.concat('<header><h3>', opts.title, '</h3></header>') : "";
				}
				var trigEl = $(triggerElement);
				var pos = $.determinePopoverPosition(triggerElement, popoverOrientation, pointerOrientation);	
				var popoverShell = $.concat('<popover ', 'id="', popoverID, '" ui-popover-position="', pointerOrientation, '"', ' data-popover-trigger="#', trigEl.attr("id"), '" data-popover-orientation="', popoverOrientation, '" data-popover-pointer-orientation="', pointerOrientation, '">', title, '<section><scrollpanel class="popover-content"></scrollpanel></section></popover>');
				popoverShell;
				$.app.append(popoverShell);
				
				// Apply positioning to popover:
				$('#'+popoverID).css(pos);
				
				// Adjust the left or bottom position of the popover if it is beyond the viewport:
				if (!!opts.id) {
					$.adjustPopoverHeight("#" + opts.id);
					$("#" + opts.id).UIAdjustPopoverPosition();
				}
			},
			
			UICancelPopover : function (popover) {
				$.UIHidePopover(popover);
			},
			
			UIHidePopover : function (popover) {
				$.UIPopover.activePopover = null;
				$(popover).css({"opacity": 0, "transform": "scale(0)"});
				popover.UIUnblock();
			},
			
			form2JSON : function(rootNode, delimiter) {
				rootNode = $.el(rootNode);
				delimiter = delimiter || '.';
				var formValues = getFormValues(rootNode);
				var result = {};
				var arrays = {};
				
				function getFormValues(rootNode) {
					var result = [];
					var currentNode = rootNode.firstChild;
					while (currentNode) {
						if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i)) {
							result.push({ name: currentNode.name, value: getFieldValue(currentNode)});
						} else {
							var subresult = getFormValues(currentNode);
							result = result.concat(subresult);
						}
						currentNode = currentNode.nextSibling;
					}
					return result;
				}
				function getFieldValue(fieldNode) {
					if (fieldNode.nodeName === 'INPUT') {
						if (fieldNode.type.toLowerCase() === 'radio' || fieldNode.type.toLowerCase() === 'checkbox') {
							if (fieldNode.checked) {
								return fieldNode.value;
							}
						} else {
							if (!fieldNode.type.toLowerCase().match(/button|reset|submit|image/i)) {
								return fieldNode.value;
							}
						}
					} else {
						if (fieldNode.nodeName === 'TEXTAREA') {
							return fieldNode.value;
						} else {
							if (fieldNode.nodeName === 'SELECT') {
								return getSelectedOptionValue(fieldNode);
							}
						}
					}
					return '';
				}
				function getSelectedOptionValue(selectNode) {
					var multiple = selectNode.multiple;
					if (!multiple) {
						return selectNode.value;
					}
					if (selectNode.selectedIndex > -1) {
						var result = [];
						var options = $.els('option', selectNode);
						$._each(function(idx, ctx) {
							if (ctx.selected) {
								result.push(ctx.value);
							}
						});
						return result;
					}
				}    
				$._each(formValues, function(idx, item) {
					var value = item.value;
					if (value !== '') {
						var name = item.name;
						var nameParts = name.split(delimiter);
						var currResult = result;
						for (var j = 0; j < nameParts.length; j++) {
							var namePart = nameParts[j];
							var arrName;
							if (namePart.indexOf('[]') > -1 && j == nameParts.length - 1) {
								arrName = namePart.substr(0, namePart.indexOf('['));
								if (!currResult[arrName]) currResult[arrName] = [];
								currResult[arrName].push(value);
							} else {
								if (namePart.indexOf('[') > -1) {
									arrName = namePart.substr(0, namePart.indexOf('['));
									var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');
									if (!arrays[arrName]) {
										arrays[arrName] = {};
									}
									if (!currResult[arrName]) {
										currResult[arrName] = [];
									}
									if (j == nameParts.length - 1) {
										currResult[arrName].push(value);
									} else {
										if (!arrays[arrName][arrIdx]) {
											currResult[arrName].push({});
											arrays[arrName][arrIdx] = 
											currResult[arrName][currResult[arrName].length - 1];
										}
									}
									currResult = arrays[arrName][arrIdx];
								} else {
									if (j < nameParts.length - 1) { 
										if (!currResult[namePart]) {
											currResult[namePart] = {};
										}
										currResult = currResult[namePart];
									} else {
										currResult[namePart] = value;
									}
								}
							}
						}
					}
				});
				return result;
			}
		});
		
		$.UISpinner = $.UIPopover;
		
		$.extend($.UIPopover, {
			activePopover : null,
			
			show: function (popover) {
			    var width = 0;
			    var section = null;
				if ($.UIPopover.activePopover === null) {
					popover.UIBlock(".01");
					popover.UIRepositionPopover();
					var offset = $(popover).offset();
					var popoverLeft = offset.left;
					var popoverWidth = $(popover).offsetWidth;
					var rightLimit = popoverLeft + popoverWidth;
					var setPopoverCSS = function () {
					    popover.css({ "opacity": 1, "transform": "scaleY(1)" });
					    var height = popover.find('scrollpanel').clientHeight;
					    //alert(popover.find('scrollpanel').clientHeight);
					    popover.css({ 'height': height + 'px'});
					};
					setTimeout(function() {
						setPopoverCSS();
						setTimeout(function() {
						    popover.UIAdjustPopoverPosition();
						},70);
					},0);
					$.UIPopover.activePopover = popover.id || popover[0].id;
			
				} else {
					return;
				}
			},
			
			hide : function ( popover ) {
				if ($.UIPopover.activePopover) {
					popover.css({"opacity": 0, "transform": "scaleY(0)"});
					$.UIPopover.activePopover = null;
				}				
			}
		});
		// Reposition any visible popovers when window resizes.
		window.onresize = function() {
			var availableVerticalSpace = $.determineMaxPopoverHeight();
			$._each($.els("popover"), function(idx, popover) {
				$(popover).find("section").css({"max-height": (availableVerticalSpace - 100)+'px'});
				$(popover).UIRepositionPopover();
			});
		};
		$.app.on("click", "mask", function(mask) {

			var $this = mask || $(this);
			if ($.UIPopover.activePopover) {
				$.UIPopover.hide($("#"+$.UIPopover.activePopover));
				$.app.UIUnblock();
			}
			if ($.rooview && $.rootview.css("position") === "absolute") {
				$.rootview.style.display = "none";
				$.rootview.UIUnblock();
			}
		});
	});
	
	document.addEventListener('orientationchange', function() {
		$.UIReadjustActionSheet();
	}, false);
	
	$(function() {
		$.UICheckForSplitView();
		if (!typeof $.rootview === 'object') {
			$('body').on('click', 'mask', function() {
				try {
					$.rootview.css('display', 'none');
					$.rootview.UIUnblock();
				} catch(err) {}
			});
		}
		if ("stack[ui-kind='titled-list alphabetical']") {
			$.UIAlphabeticalList(); 
		}
		$._each($.els('uibutton'), function(idx, ctx) {
			$(ctx).attr('role','button');
		});
	});
})();
