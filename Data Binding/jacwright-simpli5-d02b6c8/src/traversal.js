
extend(Node.prototype, {
	parent: function(selector) {
		var node = this.parentNode;
		var isElement = !!selector.tagName;
		while (node) {
			if (isElement && node == selector) return node;
			else if ('matches' in node && node.matches(selector)) return node;
			node = node.parentNode;
		}
		return null;
	}
});

extend(Element.prototype, {
	find: function(selector) {
		return this.querySelector(selector);
	},
	findAll: function(selector) {
		return new ElementArray(this.querySelectorAll(selector));
	},
	matches: (Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || function(selector) {
		return (document.findAll(selector).indexOf(this) != -1);
	}),
	getChildren: function(selector) {
		var children = new ElementArray(this.children);
		if (selector) return children.filterBy(selector);
		return children;
	},
	siblings: function(selector) {
		var sibs = new ElementArray(this.parentNode.children);
		sibs.splice(sibs.indexOf(this), 1);
		if (selector) return sibs.filterBy(selector);
		return sibs;
	}
});

HTMLDocument.prototype.find = Element.prototype.find;
HTMLDocument.prototype.findAll = Element.prototype.findAll;
DocumentFragment.prototype.find = Element.prototype.find;
DocumentFragment.prototype.findAll = Element.prototype.findAll;

ElementArray.map({
	find: 'returnFirst',
	findAll: 'merge',
	matches: 'every',
	getChildren: 'merge'
});
