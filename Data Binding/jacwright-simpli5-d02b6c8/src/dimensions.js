
extend(HTMLElement.prototype, {
	width: function(value) {
		if (value === undefined) {
			var padding = parseInt(this.css('paddingLeft')) + parseInt(this.css('paddingRight'));
			var border = parseInt(this.css('borderLeftWidth')) + parseInt(this.css('borderRightWidth'));
			return this.offsetWidth - padding - border;
		} else {
			if (value == null) this.css('width', '');
			else this.css('width', Math.max(value, 0));
			return this;
		}
	},
	height: function(value) {
		if (value === undefined) {
			var padding = parseInt(this.css('paddingTop')) + parseInt(this.css('paddingBottom'));
			var border = parseInt(this.css('borderTopWidth')) + parseInt(this.css('borderBottomWidth'));
			return this.offsetHeight - padding - border;
		} else {
			if (value == null) this.css('height', '');
			else this.css('height', Math.max(value, 0));
			return this;
		}
	},
	outerWidth: function(value) {
		if (value === undefined) {
			return this.offsetWidth;
		} else {
			var padding = parseInt(this.css('paddingLeft')) + parseInt(this.css('paddingRight'));
			var border = parseInt(this.css('borderLeftWidth')) + parseInt(this.css('borderRightWidth'));
			this.css('width', Math.max(value - padding - border, 0));
			return this;
		}
	},
	outerHeight: function(value) {
		if (value === undefined) {
			return this.offsetHeight;
		} else {
			var padding = parseInt(this.css('paddingTop')) + parseInt(this.css('paddingBottom'));
			var border = parseInt(this.css('borderTopWidth')) + parseInt(this.css('borderBottomWidth'));
			this.css('height', Math.max(value - padding - border, 0));
			return this;
		}
	},
	rect: function(value, includeMargins) {
		var rect;
		if (value === undefined) {
			rect = this.getBoundingClientRect();
			// allowing returned object to be modified
			return {left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom};
		} else {
			// figure out the top/left offset
			rect = this.getBoundingClientRect();
			var leftOffset = this.offsetLeft - rect.left;
			var topOffset = this.offsetTop - rect.top;
			if ('left' in value) this.css('left', value.left += leftOffset);
			if ('top' in value) this.css('top', value.top += topOffset);
			if (includeMargins && ('top' in value || 'left' in value)) {
				// fix for margins
				rect = this.getBoundingClientRect();
				if ('left' in value) this.css('left', value.left - (rect.left + leftOffset - value.left));
				if ('top' in value) this.css('top', value.top - (rect.top + topOffset - value.top));
			}
			if ('right' in value) {
				if ('left' in value) this.css('width', value.right - value.left + leftOffset);
				else this.css('left', value.right - rect.width + leftOffset);
			}
			if ('bottom' in value) {
				if ('top' in value) this.css('height', value.bottom - value.top + topOffset);
				else this.css('top', value.bottom - rect.height + topOffset);
			}
			if ('width' in value) this.outerWidth(value.width);
			if ('height' in value) this.outerHeight(value.height);
			return this;
		}
	}
});

ElementArray.map({
	width: 'getterSetter',
	height: 'getterSetter',
	outerWidth: 'getterSetter',
	outerHeight: 'getterSetter',
	rect: 'getterSetter'
});
