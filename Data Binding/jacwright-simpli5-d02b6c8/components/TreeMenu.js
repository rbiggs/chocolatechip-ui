
var TreeMenu = new Component({
	extend: Component,
	template: new Template('<tree-menu><menu></menu></tree-menu>'),
	register: 'tree-menu',
	properties: ['data', 'double-click-to-open'],
	events: ['select', 'deselect', 'open', 'close', 'itemover', 'itemout', 'itemclick', 'itemdblclick'],
	
	constructor: function() {
		this.menu = this;
		this.submenu = this.find('menu') || this.append('<menu></menu>').pop();
		this.items = this.findAll('menu-item');
		this.submenu.append(this.items);
		this.flattenedData = this.items.map(function(item) {
			return item.data;
		});
		
		Bind.setter(this, 'data', this.onDataChange.boundTo(this));
		this.on('DOMNodeInserted,DOMNodeRemoved', this.onChild);
		this.on('select', this.onSelect);
		this.on('deselect', this.onDeselect);
		this.on('open,close', this.sizeUp);
		this.on('scroll', this.onScroll);
		this.on('click', this.onClick);
		this.on('mousedown', Event.stop);
		
		this.sizeUp();
	},
	
	get selected() {
		return this._selected;
	},
	
	set selected(value) {
		if (this._selected == value) return;
		if (this._selected) {
			this._selected.deselect();
		}
		
		if (value && !value.tagName) { // lookup node
			var index;
			if ((index = this.flattenedData.indexOf(value)) != -1) {
				value = this.find('menu-item:nth-child(' + (index+1) + ')');
			} else {
				value = null;
			}
		}
		
		this._selected = value;
		
		if (value) value.select();
	},
	
	get doubleClickToOpen() {
		return this._dblOpen;
	},
	
	set doubleClickToOpen(value) {
		if (value == this._dblOpen) return;
		this._dblOpen = value;
		value ? this.on('itemdblclick', this.onDblClick.boundTo(this)) : this.un('itemdblclick', this.onDblClick.boundTo(this));
	},
	
	openAll: function() {
		this.findAll('menu-item').call('open');
	},
	
	closeAll: function() {
		this.findAll('menu-item').call('close');
	},
	
	get iconFunction() {
		return this._iconFunction;
	},
	
	set iconFunction(value) {
		if (this._iconFunction == value) return;
		this._iconFunction = value;
	},
	
	getOpen: function(prop) {
		var nodes = [];
		this.items.forEach(function(item) {
			if (item.isOpen) {
				nodes.push(item.data[prop]);
			}
		});
		return nodes;
	},
	
	setOpen: function(prop, value) {
		if (!value || !(value instanceof Array) || !value.length) return;
		this.un('open,close', this.sizeUp.boundTo(this));
		var props = {}, items = this.items;
		this.flattenedData.forEach(function(data, index) {
			props[data[prop]] = items[index];
		});
		value.forEach(function(prop) {
			props[prop].open();
		});
		this.on('open,close', this.sizeUp.boundTo(this));
		this.sizeUp();
	},
	
	sizeUp: function() {
		this.addClass('sizing'); // float left to size, then no float so click area can extend the full length
		var width = this.outerWidth();
		this.submenu.width(10000);
		this.submenu.getChildren().forEach(function(child) {
			width = Math.max(width, child.rect().width);
		});
		this.submenu.width(width);
		this.removeClass('sizing');
	},
	
	onDblClick: function(event) {
		var item = event.target;
		item.toggleOpen();
	},
	
	onDataChange: function(prop, old, value) {
		if (old && old instanceof BindableArray) old.un('change', this.onDataUpdate.boundTo(this));
		if (value && value instanceof Array) {
			if ( !(value instanceof BindableArray)) Class.makeClass(value, BindableArray);
			value.on('change', this.onDataUpdate.boundTo(this));
			this.onDataUpdate();
		}
	},
	
	onDataUpdate: function(event) {
		var action = event ? event.action : 'reset';
		var list = this;
		
		switch(action) {
			case 'add':
				var nextSib = this.children[event.startIndex];
				event.items.forEach(function(data) {
					var item = template.createBound();
					item.data = data;
					list.insertBefore(item, nextSib);
				});
				break;
			case 'remove':
				for (var i = event.startIndex; i <= event.endIndex; i++) {
					this.removeChild(this.children[event.startIndex]);
				}
				break;
			case 'reset':
				var items = [];
				this.data.forEach(function(data) {
					var item = new TreeMenuItem();
					item.menu = list.menu;
					item.data = data;
					items.push(item);
				});
				this.submenu.append(items);
				break;
		}
	},
	
	onChild: function(event) {
		var index, child = event.target;
		if ( !(child instanceof TreeMenuItem) ) return;
		var all = child.findAll('menu-item');
		all.unshift(child);
		
		if (event.type == 'DOMNodeInserted') {
			var prev = child.previousSibling || child.parent('menu-item');
			index = this.items.indexOf(prev);
			this.items.splice.apply(this.items, [index, 0].concat(all));
			this.flattenedData.splice.apply(this.flattenedData, [index, 0].concat(all.map(function(item) { return item.data; })));
		} else {
			index = this.items.indexOf(child);
			this.items.splice(index, all.length);
			this.flattenedData.splice(index, all.length);
		}
	},
	
	onSelect: function(event) {
		if (this.selected != event.target) {
			this.selected = event.target;
		}
	},
	
	onDeselect: function(event) {
		if (this.selected == event.target) {
			this.selected == null;
		}
	},
	
	onClick: function(event) {
		if (event.target == this && this.selected) {
			this.selected.deselect();
		}
	},
	
	onScroll: function() {
		var item = this.find('menu-item.poppingout');
		if (item) {
			item.onOut();
		}
	}
});

var TreeMenuItem = new Component({
	extend: Component,
	template: new Template('<menu-item>',
		'<opener></opener>',
		'<content>',
			'<icon-space><icon class="{data.icon}"></icon></icon-space>',
			'<text>{data.label}</text>',
		'</content>',
		'<menu></menu>',
	'</menu-item>'),
	register: 'tree-menu menu-item',
	events: ['select', 'deselect', 'open', 'close', 'itemover', 'itemout', 'itemclick', 'itemdblclick'],
	
	constructor: function() {
		this.opener = this.find('opener');
		this.content = this.find('content');
		this.icon = this.find('icon');
		this.submenu = this.find('menu');
		if (this.submenu) {
			this.submenu.on('click', Event.stop);
			this.submenu.on('dblclick', Event.stop);
		}
		this.opener.on('click', this.toggleOpen.boundTo(this));
		this.content.on('click', this.select.boundTo(this));
		this.content.on('rollover', this.onOver.boundTo(this));
		this.content.on('rollout', this.onOut.boundTo(this));
		
		// set up item events
		this.content.on('rollover', this.onItemEvent.boundTo(this));
		this.content.on('rollout', this.onItemEvent.boundTo(this));
		this.content.on('click', this.onItemEvent.boundTo(this));
		this.content.on('dblclick', this.onItemEvent.boundTo(this));
		
		Bind.setter(this, 'data', this.onDataChange.boundTo(this));
		
		// default is closed
		this.close();
	},
	
	get hasChildren() {
		return (this.submenu && this.submenu.children.length);
	},
	
	get isOpen() {
		return (this.hasClass('open'));
	},
	
	open: function() {
		if (this.hasChildren) {
			this.addClass('open').removeClass('closed');
			if (this.popout) this.popout.firstChild.className = this.className;
			this.dispatchEvent(new TreeEvent('open', this, true));
		} else {
			if (this.popout) this.popout.firstChild.className = this.className;
			this.removeClass('closed').removeClass('open');
		}
	},
	
	close: function() {
		if (this.hasChildren) {
			this.addClass('closed').removeClass('open');
			if (this.popout) this.popout.firstChild.className = this.className;
			this.dispatchEvent(new TreeEvent('close', this, true));
		} else {
			this.removeClass('closed').removeClass('open');
			if (this.popout) this.popout.firstChild.className = this.className;
		}
	},
	
	toggleOpen: function() {
		if (this.hasClass('open')) this.close();
		else if (this.hasClass('closed')) this.open();
	},
	
	select: function() {
		if (this.hasClass('selected')) return;
		this.addClass('selected');
		if (this.popout) this.popout.firstChild.firstChild.className = this.className;
		this.dispatchEvent(new TreeEvent('select', this, true));
	},
	
	deselect: function() {
		if (!this.hasClass('selected')) return;
		this.removeClass('selected');
		if (this.popout) this.popout.firstChild.className = this.className;
		this.dispatchEvent(new TreeEvent('deselect', this, true));
	},
	
	toggleSelected: function() {
		if (this.hasClass('selected')) this.deselect();
		else this.select();
	},
	
	onOver: function() {
		var rect = this.find('text').rect();
		var menuRect = this.menu.rect();
		var overflow = menuRect.right - rect.left;
		if (rect.width - overflow <= 0) return;
		
		// if the text is overflowing the boundary popout the hidden part
		this.popout = document.body.append('<tree-menu class="popout"><menu><menu-item><content><text>' + this.find('text').html() + '</text></content></menu-item></menu></tree-menu>').pop();
		var item = this.popout.firstChild.firstChild;
		item.className = this.className;
		var overlap = 4; // add 4px overlap
		item.css('margin-left', -overflow + overlap);
		this.popout.rect({left: menuRect.right - overlap, top: rect.top});
		this.addClass('poppingout');
	},
	
	onOut: function() {
		if (!this.popout) return;
		this.popout.remove();
		delete this.popout;
		this.removeClass('poppingout');
	},
	
	onItemEvent: function(event) {
		this.dispatchEvent(new TreeEvent('item' + event.type.replace('roll', ''), this, true));
	},
	
	/**
	 * @private
	 */
	onDataChange: function(prop, old, value) {
		if (old && old.children instanceof BindableArray) old.children.un('change', this.onDataUpdate.boundTo(this));
		if (value && this.menu && this.menu.iconFunction) {
			this.icon.css('background-image', 'url(' + this.menu.iconFunction.call(this, value) + ')');
		}
		if (value && value.children instanceof Array) {
			if ( !(value.children instanceof BindableArray)) Class.makeClass(value.children, BindableArray);
			value.children.on('change', this.onDataUpdate.boundTo(this));
			this.onDataUpdate();
		}
	},
	
	/**
	 * @private
	 */
	onDataUpdate: function(event) {
		var action = event ? event.action : 'reset';
		var list = this;
		
		switch(action) {
			case 'add':
				var nextSib = this.children[event.startIndex];
				event.items.forEach(function(data) {
					var item = template.createBound();
					item.data = data;
					list.insertBefore(item, nextSib);
				});
				break;
			case 'remove':
				for (var i = event.startIndex; i <= event.endIndex; i++) {
					this.removeChild(this.children[event.startIndex]);
				}
				break;
			case 'reset':
				var items = [];
				this.data.children.forEach(function(data) {
					var item = new TreeMenuItem();
					item.menu = list.menu;
					item.data = data;
					items.push(item);
				});
				this.submenu.append(items);
				this.close();
				break;
		}
	}
});


var TreeEvent = new Class({
	extend: Event,
	constructor: function(type, menuItem, bubbles, cancelable) {
		var event = document.createEvent('Events');
		event.initEvent(type, bubbles, cancelable);
		Class.makeClass(event, this.constructor, true);
		event.menuItem = menuItem;
		event.data = menuItem.data;
		return event;
	}
});

