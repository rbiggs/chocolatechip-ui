/**
 * An alternative to right-click context menus. Provides a button that when hovered over displays a menu. The HoverMenu
 * is great for context specific options. It can be configured to only open on click and to automatically close after
 * moving the mouse off the menu. Care has been taken to make the menu as usable as possible, so mousing off of a
 * submenu does not close it immediately to correct for inaccurate mouse movements. The Escape key will close the menu.
 * And clicking anywhere outside the menu will close it whether autoClose is used or not. In addition, the menu is added
 * to the body of the document when opened to avoid being cut off by any element clipping in the document.
 * 
 * The onselect attribute will add a listener to any select events dispatched by the menu's children.
 * 
 * The HoverMenu is a button which contains a HoverSubmenu. HoverSubmenu can hold any element, but mostly HoverMenuItems
 * which dispatch a select event and close the menu when clicked. The HTML tags for the styled items are:
 * 
 * <hover-menu>
 *     <menu>
 *         <menu-item onselect="alert('selected')">Selectable Item</menu-item>
 *         <menu-item>A submenu
 *             <menu>
 *                 <menu-item disabled="true" onselect="alert('selected')">Selectable Item</menu-item>
 *                 <menu-item onselect="alert('selected')">Selectable Item</menu-item>
 *             </menu>
 *         </menu-item>
 *         <menu-separator></menu-separator>
 *         <menu-item>A submenu
 *             <menu>
 *                 <menu-content>
 *                     Content that won't close the menu on click. Can put components in here, forms, calendars, etc.
 *                     this should be by itself instead of menu-items it in a menu.
 *                 </menu-content>
 *             </menu>
 *         </menu-item>
 *     </menu>
 * </hover-menu>
 */
var HoverMenu = new Component({
	extend: Component,
	template: new Template('<hover-menu></hover-menu>'),
	properties: ['click-only', 'auto-close', 'menu-delay', 'open-below'],
	register: 'hover-menu',
	
	constructor: function() {
		this.submenu = this.find(simpli5.selector('menu')) || this.append(new HoverMenuSubmenu());
		this._openBelow = false;
		this.submenu.hide();
		this.submenu.addClass('hover-menu-root');
		this.submenu.menu = this.menu = this;
		this.on('click', this.onClick.boundTo(this));
		this.on('mousedown', Event.prevent);
		var menu = this;
		setTimeout(function() {
			menu.submenu.remove();
		}, 1);
		this.clickOnly = false;
		this.menuDelay = true;
	},
	
	/**
	 * Sets whether the menu can be opened by hovering. If clickOnly is set to true then a user must click on the button
	 * to open the hover menu. Default is false.
	 * 
	 * This may be set via the click-only attribute with click-only="true|false"
	 */
	get clickOnly() {
		return this._clickOnly;
	},
	set clickOnly(value) {
		if (this._clickOnly == value) return;
		this._clickOnly = value;
		if (this.submenu) {
			value ? this.un('rollover', this.open.boundTo(this)) : this.on('rollover', this.open.boundTo(this));
			this.updateAutoClose();
		}
	},
	
	/**
	 * Sets whether the menu will close automatically when the mouse moves off of it. The default is the opposite of
	 * clickOnly and will change when clickOnly is changed unless explicitly set. If clickOnly is false, meaning you can
	 * open the menu by hovering over the button, then autoClose will be true and the menu will close when mousing off
	 * (after a few milliseconds). And if clickOnly is true, a user will have to click elsewhere on the document or
	 * press Esc to close the menu without chosing an item.
	 * 
	 * This may be set via the auto-close attribute with auto-close="true|false"
	 */
	get autoClose() {
		return this.hasOwnProperty('_autoClose') ? this._autoClose : !this.clickOnly;
	},
	set autoClose(value) {
		this._autoClose = value;
		this.updateAutoClose();
	},
	
	/**
	 * 
	 */
	get openBelow() {
		return this._openBelow;
	},
	set openBelow(value) {
		if (this._openBelow == value ) return;
		this._openBelow = value;
		value ? this.addClass('below') : this.removeClass('below');
		value ? this.submenu.addClass('below') : this.submenu.removeClass('below');
	},

	/**
	 * Whether the HoverMenu is currently open. Read-only.
	 */
	get opened() {
		return this.submenu && this.submenu.visible();
	},

	/**
	 * Opens the hover menu.
	 */
	open: function() {
		clearTimeout(this.rolloutTimeout);
		
		if (HoverMenu.openMenu && HoverMenu.openMenu != this) {
			HoverMenu.openMenu.close();
		}
		HoverMenu.openMenu = this;
		this.openSubmenu();
		document.on('keydown', this.onKeyDown.boundTo(this));
		document.on('click', this.close.boundTo(this));
		window.on('resize', this.close.boundTo(this));
	},

	/**
	 * Closes the hover menu and all submenus.
	 */
	close: function() {
		this.submenu.close();
		document.un('keydown', this.onKeyDown.boundTo(this));
		document.un('click', this.close.boundTo(this));
		HoverMenu.openMenu = null;
	},
	
	/**
	 * @private
	 */
	openSubmenu: function() {
		if (this == this.menu) {
			document.body.append(this.submenu);
		}
		var rect = this.rect();
		this.submenu.show(true);
		var menuRect = this.submenu.rect();
		var left = rect.right;
		var top = rect.top;
		
		if (this.openBelow) {
			left = rect.left;
			top = rect.bottom;
		}
		
		if (left + menuRect.width >= window.innerWidth) {
			left = rect.left - menuRect.width;
			this.submenu.addClass('left');
		} else {
			this.submenu.removeClass('left');
		}
		if (top + menuRect.height >= window.innerHeight) {
			top = rect.bottom - menuRect.height;
			this.submenu.addClass('up');
		} else {
			this.submenu.removeClass('up');
		}
		this.addClass('open');
		this.submenu.rect({left: left, top: top});
		this.parentNode.hoveredItem = this;
	},
	
	/**
	 * @private
	 */
	onKeyDown: function(event) {
		if (event.keyCode == 27) this.close(); //esc
	},
	
	/**
	 * @private
	 */
	onClick: function(event) {
		event.stopPropagation();
		if (!this.opened) this.open();
	},
	
	/**
	 * @private
	 */
	onRollout: function() {
		var menu = this;
		this.rolloutTimeout = setTimeout(function() {
			menu.close();
		}, 600);
	},
	
	/**
	 * @private
	 */
	onRollover: function() {
		clearTimeout(this.rolloutTimeout);
	},
	
	/**
	 * @private
	 */
	updateAutoClose: function() {
		if (this.autoClose) {
			this.on('rollout', this.onRollout.boundTo(this));
			this.submenu.on('rollout', this.onRollout.boundTo(this));
			this.on('rollover', this.onRollover.boundTo(this));
			this.submenu.on('rollover', this.onRollover.boundTo(this));
		} else {
			this.un('rollout', this.onRollout.boundTo(this));
			this.submenu.un('rollout', this.onRollout.boundTo(this));
			this.un('rollover', this.onRollover.boundTo(this));
			this.submenu.un('rollover', this.onRollover.boundTo(this));
		}
	}
});

/**
 * A submenu of the HoverMenu. Just a basic container which holds menu items or other content. The tag for this
 * component is <menu></menu>.
 * 
 * The onselect attribute will add a listener to any select events dispatched by the submenu's children.
 */
var HoverMenuSubmenu = new Component({
	extend: window.HTMLMenuElement || Component,
	template: new Template('<menu></menu>'),
	register: 'hover-menu menu',
	events: ['select'],

	/**
	 * Closes the submenu and all submenus below it.
	 */
	close: function() {
		if (this.parentNode == document.body) {
			this.remove();
		}
		this.getChildren(simpli5.selector('menu-item')).forEach(function(item) {
			item.close();
		});
		this.hide();
	}
});

/**
 * A clickable, actionable item in the menu. It will dispatch a select event when clicked. If a submenu is within a menu
 * item then it does not dispatch the select event and instead opens the submenu when hovered over. It will also have a
 * 'submenu' class that can be used for styling it differently. When the submenu is open an 'open' class is added as
 * well. If the menu item is disabled then it will not dispatch a select even or open a submenu.
 * 
 * The HTML tag for a menu item is <menu-item></menu-item>.
 */
var HoverMenuItem = new Component({
	extend: Component,
	template: new Template('<menu-item></menu-item>'),
	register: 'hover-menu menu-item',
	events: ['select'],
	properties: ['disabled'],
	
	constructor: function() {
		this._disabled = false;
		this.on('click', this.select.boundTo(this));
		this.on('rollover', this.hovered.boundTo(this));
		this.on('rollout', this.unhovered.boundTo(this));
		this.submenu = this.find('menu');
		if (this.submenu) {
			this.submenu.hide();
			this.addClass('submenu');
		}
		Bind.property(this.menu, 'data', this, 'data');
	},
	
	/**
	 * Deactivates the menu item from being selected or opened.
	 * Can be set as an attribute in the HTML: disabled="true|false"
	 */
	get disabled() {
		return this._disabled;
	},
	set disabled(value) {
		if (this._disabled == value) return;
		this._disabled = value;
		value ? this.addClass('disabled') : this.removeClass('disabled');
	},
	
	/**
	 * The hover-menu instance this item belongs to. Read-only.
	 */
	get menu() {
		if (!this.hasOwnProperty('_menu')) {
			var parent = this.parentNode;
			while (parent && !('menu' in parent)) {
				parent = parent.parentNode;
			}
			this._menu = parent ? parent.menu : null;
		}
		return this._menu;
	},
	
	/**
	 * Selects the menu item if it has no submenu. Triggers the select event and closes the entire hover menu.
	 * @param event not required
	 */
	select: function(event) {
		if (event) event.stopPropagation();
		if (this.disabled || this.submenu) return;
		this.dispatchEvent(new CustomEvent('select', true));
		this.menu.close();
	},
	
	/**
	 * Closes the submenu and any descendants if they exist.
	 */
	close: function() {
		clearTimeout(this.hoverTimeout);
		
		if (this.submenu) {
			this.submenu.close();
			this.removeClass('open');
			this.parentNode.hoveredItem = null;
		}
	},
	
	/**
	 * @private
	 */
	hovered: function() {
		if (this.disabled) return;
		if (this.menu.menuDelay) {
			this.hoverTimeout = setTimeout(this.hovering.boundTo(this), 150);
		} else {
			this.hovering();
		}
	},
	
	/**
	 * @private
	 */
	unhovered: function() {
		clearTimeout(this.hoverTimeout);
	},
	
	/**
	 * @private
	 */
	hovering: function() {
		if (this.parentNode.hoveredItem && this.parentNode.hoveredItem != this) {
			this.parentNode.hoveredItem.close();
		}
		
		if (this.submenu) {
			this.openSubmenu();
		}
	},
	
	/**
	 * @private
	 */
	openSubmenu: HoverMenu.prototype.openSubmenu
});
