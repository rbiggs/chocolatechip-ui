
extend(HTMLElement.prototype, {
	makeClass: function(type) {
		if ( !(this instanceof type) ) {
			Class.makeClass(this, type);
		}
		return this;
	},
	call: function(name) {
		if (name in this) this[name].apply(this, arguments);
		return this;
	},
	cleanWhitespace: function() {
		var node = this.firstChild;
		while (node) {
			var curNode = node;
			node = node.nextSibling;
			if (curNode.nodeType == 3) {
				this.removeChild(curNode);
			}
		}
		return this;
	},
	remove: function() {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
		return this;
	},
	replace: function(html) {
		var nodes = this.before(html);
		this.remove();
		return nodes;
	},
	after: function(html) {
		var frag = toFragment(html);
		var nodes = new ElementArray(frag.childNodes);
		this.parentNode.insertBefore(frag, this.nextSibling);
		return nodes;
	},
	append: function(html) {
		if (!html || (html.hasOwnProperty('length') && !html.length)) return;
		var frag = toFragment(html);
		var nodes = new ElementArray(frag.childNodes);
		this.appendChild(frag);
		return nodes;
	},
	before: function(html) {
		var frag = toFragment(html);
		var nodes = new ElementArray(frag.childNodes);
		this.parentNode.insertBefore(frag, this);
		return nodes;
	},
	prepend: function(html) {
		var frag = toFragment(html);
		var nodes = new ElementArray(frag.childNodes);
		this.insertBefore(frag, this.firstChild);
		return nodes;
	}
});


ElementArray.map({
	makeClass: 'forEach',
	call: 'forEach',
	cleanWhitespace: 'forEach',
	remove: 'forEach',
	after: 'merge',
	append: 'merge',
	before: 'merge',
	prepend: 'merge'
});
