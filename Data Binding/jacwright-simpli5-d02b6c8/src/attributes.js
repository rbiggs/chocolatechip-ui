
(function() {
	
var spaceExpr = /\s+/, dashExpr = /([A-Z])/g, htmlExpr = /^[^<]*(<(.|\s)+>)[^>]*$/, numCSSExpr = /z-?index|font-?weight|opacity|zoom|line-?height/i;

extend(HTMLElement.prototype, {
	addClass: function(className) {
		var classes = this.className.split(spaceExpr);
		if (classes[0] == '') classes.pop();
		if (classes.indexOf(className) == -1) {
			classes.push(className);
			this.className = classes.join(' ');
		}
		return this;
	},
	removeClass: function(className) {
		var classes = this.className.split(spaceExpr);
		var index = classes.indexOf(className);
		if (index != -1) classes.splice(index, 1);
		if (classes.length == 0) this.removeAttr('class');
		else this.className = classes.join(' ');
		return this;
	},
	hasClass: function(className) {
		return this.className.split(spaceExpr).indexOf(className) != -1;
	},
	toggleClass: function(className) {
		if (this.hasClass(className)) this.removeClass(className);
		else this.addClass(className);
		return this;
	},
	attr: function(name, value) {
		if (typeof name == 'object') {
			for (var i in name) {
				this.setAttribute(i, name[i]);
			}
		} else if (value !== undefined) {
			this.setAttribute(name, value);
			return this;
		} else {
			return this.getAttribute(name);
		}
	},
	css: function(name, value) {
		if (typeof name == 'object') {
			for (var i in name) {
				this.css(i, name[i]);
			}
		} else if (value !== undefined) {
			if (typeof value == 'number' && !numCSSExpr.test(name)) {
				value += 'px';
			}
			this.style[name] = value;
			if (this.getAttribute('style') == '') this.removeAttr('style');
		} else {
			value = this.style[name];
			if (!value) {
				name = name.replace(dashExpr, "-$1").toLowerCase();
				var computedStyle = window.getComputedStyle(this, null);
				value = computedStyle.getPropertyValue(name);
			}
			return value;
		}
		return this;
	},
	removeAttr: function(name) {
		this.removeAttribute(name);
		return this;
	},
	html: function(value) {
		if (value === undefined) {
			return this.innerHTML;
		} else if (typeof value == 'string') {
			this.innerHTML = value;
		} else {
			var element = this;
			this.innerHTML = '';
			value = toArray(value);
			forEach(value, function(node) {
				element.append(node);
			});
		}
		return this;
	},
	text: function(value) {
		if (value === undefined) {
			return 'textContent' in this ? this.textContent : this.innerText;
		} else {
			'textContent' in this ? this.textContent = value : this.innerText = value;
		}
		return this;
	},
	val: function(value) {
		var i, l, option;
		if (value === undefined) {
			if (this.nodeName == 'SELECT' && this.type == 'select-multiple') {
				i = this.selectedIndex, values = [], options = this.options;
				if (i == -1) return values;
				
				// Loop through all the selected options
				for (l = options.length; i < l; i++) {
					option = options[i];
					if (option.selected) {
						values.push(option.value);
					}
				}
				
				return values;				
			}
			return (this.value || '').replace(/\r/g, '');
		}
		
		if (typeof value === "number") value += '';
		
		if (typeof value == 'boolean' && (this.type == 'radio' || this.type == 'checkbox')) {
			this.checked = value;
		} else if (value instanceof Array && (this.type == 'radio' || this.type == 'checkbox')) {
			this.checked = value.indexOf(this.value) != -1;
		} else if (this.nodeName == 'SELECT') {
			if (value) {
				var values = value instanceof Array ? value : [value], options = this.options;
				
				for (i = 0, l = options.length; i < l; i++) {
					option = options[i];
					if (values.indexOf(option.value) != -1) {
						option.selected = true;
					}
				}
			} else {
				this.selectedIndex = -1;
			}
		} else {
			this.value = value;
		}
		return this;
	},
	show: function(animate, callback) {
		if (animate && this.css('-webkit-transition-property').indexOf('opacity') != -1) {
			var me = this, onDone;
			this.css('opacity', 0).css('display', '');
			setTimeout(function() {me.css('opacity', 1);}, 0);
			this.on('webkitTransitionEnd,transitionend', onDone = function() {
				me.un('webkitTransitionEnd,transitionend', onDone);
				me.css('opacity', '');
				if (callback) callback();
			});
			return this;
		} else {
			return this.css('display', '');
		}
	},
	hide: function(animate, callback) {
		if (animate && this.css('-webkit-transition-property').indexOf('opacity') != -1) {
			var me = this, onDone;
			this.css('opacity', 0);
			this.on('webkitTransitionEnd,transitionend', onDone = function() {
				me.un('webkitTransitionEnd,transitionend', onDone);
				me.css('opacity', '').css('display', 'none');
				if (callback) callback();
			});
			return this;
		} else {
			return this.css('display', 'none');
		}
	},
	visible: function(value, animate, callback) {
		if (value !== undefined) {
			return value ? this.show(animate, callback) : this.hide(animate, callback);
			return this;
		}
		return this.rect().width != 0;
	}
});


ElementArray.map({
	addClass: 'forEach',
	removeClass: 'forEach',
	hasClass: 'some',
	toggleClass: 'forEach',
	attr: 'getterSetter',
	removeAttr: 'forEach',
	css: 'getterSetter',
	html: 'getterSetter',
	text: 'getterSetter',
	val: 'getterSetter',
	show: 'forEach',
	hide: 'forEach',
	visible: 'some'
});

})();
