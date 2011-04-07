
function forEach(iterable, func) {
	Array.prototype.forEach.call(iterable, func);
}

function toArray(iterable) {
	if (iterable instanceof Array) return iterable;
	var arr = Array.prototype.slice.call(iterable);
	if (!arr.length && iterable != null && !('length' in iterable)) return [iterable];
	return arr;
}

/**
 * 
 * @param obj
 * @param extension
 * @param [overwrite]
 */
function extend(obj, extension, overwrite) {
	if (this != window) {
		obj = this;
		extension = obj;
		overwrite = extension;
	}
	
	for (var i in extension) {
		if (overwrite === false && i in obj) {
			continue;
		}
		
		var getter = extension.__lookupGetter__(i), setter = extension.__lookupSetter__(i);
		if (getter || setter) {
			if (getter) obj.__defineGetter__(i, getter);
			if (setter) obj.__defineSetter__(i, setter);
		} else {
			obj[i] = extension[i];
		}
	}
	
	return obj;
}

String.trim = function(str) {
	return str.replace(String.trim.regex, '');
};
String.trim.regex = /^\s+|\s+$/g;

function isNumeric(value) {
	return typeof value == 'number' || (typeof value == 'string' && parseFloat(value).toString() == String.trim(value));
}

var toFragment, fromElement;

(function() {
	var div = document.createElement('div');
	
	toFragment = function(html) {
		var frag = document.createDocumentFragment();
		
		if (html instanceof Node) {
			frag.appendChild(html);
		} else if (typeof html == 'string') {
			div.innerHTML = html;
			while (div.firstChild) {
				frag.appendChild(div.firstChild);
			}
		} else if (html instanceof Array || html instanceof NodeList) {
			for (var i = 0, l = html.length; i < l; i++) {
				frag.appendChild(html[i]);
			}
		}
		return frag;
	};
	
	fromElement = function(element) {
		div.appendChild(element.cloneNode(true));
		var outerHTML = div.innerHTML;
		div.innerHTML = '';
		return outerHTML;
	}
})();


function toElement(html) {
	return toFragment(html).firstChild;
}

/**
 * 
 * @param implementation
 */
function Class(implementation) {
	// create the constructor if not provided
	if (!implementation.hasOwnProperty('constructor')) {
		implementation.constructor = function() {};
	}
	var constructor = implementation.constructor;
	
	if (implementation) {
		if (implementation.extend) {
			Class.subclass.prototype = implementation.extend.prototype;
			constructor.prototype = new Class.subclass();
			delete implementation.extend;
		}
		
		if (implementation.implement) {
			var impl = implementation.implement instanceof Array ? implementation.implement : [implementation.implement];
			for (var i = 0, l = impl.length; i < l; i++) {
				Class.implement(constructor, impl[i]);
			}
			delete implementation.implement;
		}
		// Copy the properties over onto the new prototype
		Class.mixin(constructor, implementation);
	}
	return constructor;
}

extend(Class, {
	subclass: function() {},
	implement: function(classObj, implClassObj) {
		Class.mixin(classObj, implClassObj.prototype);
	},
	mixin: function(classObj, methods) {
		extend(classObj.prototype, methods);
	},
	makeClass: function(instance, classType, skipConstructor) {
		instance.__proto__ = classType.prototype;
		var args = toArray(arguments);
		args.splice(0, 3);
		if (!skipConstructor) classType.apply(instance, args);
		return instance;
	},
	insert: function(instance, classType) {
		var proto = {};
		for (var i in classType.prototype) {
			if (classType.prototype.hasOwnProperty(i)) {
				proto[i] = classType.prototype[i];
			}
		}
		proto.__proto__ = instance.__proto__;
		instance.__proto__ = proto;
		return instance;
	}
});

/**
 * Bind a function to run in the scope of obj (i.e. "this" will equal obj) 
 * @param obj
 * @param * additional arguments will be added to the call
 */
Function.prototype.bind = function(obj) {
	var method = this, args = [];
	for (var i = 1, l = arguments.length; i < l; i++) {
		args.push(arguments[i]);
	}
	var func = function() {
		var a = [];
		for (var i = 0, l = arguments.length; i < l; i++) {
			a.push(arguments[i]);
		}
		a = a.concat(args);
		return method.apply(obj, a);
	}
	func.toString = function() {
		return method.toString();
	}
	return func;
};

Function.prototype.boundTo = function(obj) {
	if (!this.hasOwnProperty('__boundTo')) this.__boundTo = {};
	
	var objId = simpli5.getId(obj);
	
	return this.__boundTo[objId] || (this.__boundTo[objId] = this.bind(obj));
};

// starts calling a function at regular intervals
Function.prototype.start = function(frequency) {
	if (this.timer) return;
	this.timer = setInterval(this, frequency*1000);
	this();
	return this.timer;
};

// stops a function which is currently being called at intervals from .start()
Function.prototype.stop = function() {
	clearInterval(this.timer);
	delete this.timer;
};

// stops a function which is currently being called at intervals from .start()
Function.prototype.running = function() {
	return !!this.timer;
};

// returns a new function which is throttled from being called too frequently
Function.prototype.throttle = function(delay) {
	var method = this;
	var closure = function() {
		if (closure.throttled) {
			closure.pending = arguments;
			return closure.throttled;
		}
		closure.throttled = setTimeout(function() {
			delete closure.throttled;
			if (closure.pending) {
				closure.apply(null, closure.pending);
				delete closure.pending;
			}
		}, delay);
		return method.apply(null, arguments);
	}
	return closure;
};

var ElementArray = new Class({
	extend: Array,
	
	constructor: function(selector) {
		var array = [];
		Class.makeClass(array, ElementArray, true);
		if (!selector) {
			return array;
		} else if (selector.nodeType) {
			array.push(selector);
		} else if (typeof selector === "string") {
			array.merge(document.querySelectorAll(selector));
		} else {
			array.merge(selector);
		}
		return array;
	},
	
	concat: function(args) {
		return Class.makeClass(Array.prototype.concat.apply(this, arguments), ElementArray, true);
	},
	filter: function(func, thisObj) {
		return Class.makeClass(Array.prototype.filter.call(this, func, thisObj), ElementArray, true);
	},
	map: function(func, thisObj) {
		return Class.makeClass(Array.prototype.map.call(this, func, thisObj), ElementArray, true);
	},
	slice: function(start, end) {
		return Class.makeClass(Array.prototype.slice.call(this, start, end), ElementArray, true);
	},
	splice: function(startIndex, howMany, args) {
		return Class.makeClass(Array.prototype.splice.apply(this, arguments), ElementArray, true);
	},
	
	/**
	 * Merges an Element, Array of Elements, or NodeList of Elements into this ElementArray.
	 * 
	 * @param elems NodeList|Array|Element
	 */
	merge: function(elems) {
		if (elems == null) return;
		elems = toArray(elems).filter(function(element) {
			return !!element.tagName;
		});
		this.push.apply(this, elems);
	},

	/**
	 * Returns a new ElementArray which will be a subset of this ElementArray filtered by selector.
	 * 
	 * @param selector String
	 */
	filterBy: function(selector) {
		// TODO benchmark this method vs using document.findAll(selector) and indexOf(element)
		return this.filter(function(element) {
			return element.matches(selector);
		});
	},
	
	toString: function() {
		return 'ElementArray: [' + this.join(',') + ']';
	}
});

extend(ElementArray, {

	/**
	 * Static method adds a mapping function to ElementArray which runs through the list of elements and calls the
	 * corresponding method on the element, then handles the results using the map method specified. This is only a
	 * helper to avoid repetative or redundant functions which are all the same except for the method they are mapping
	 * to. Using map is not required to add functionality to ElementArray.
	 * 
	 * Map methods:
	 * some: returns true if ANY of the elements return true for that method.
	 * every: returns true if ALL of the elements return true for that method.
	 * forEach: runs the method on each element and returns a reference to itself (the ElementArray).
	 * merge: returns a new ElementArray with the merged results of each element method call.
	 * getterSetter: if 1 parameter is passed (a name) returns the value of the getter of the first element, if 2
	 *               parameters are passed (name, value) will set the value on the setters of each element.
	 * returnFirst: calls the method on each element until a non-null result is returned.
	 * callFirst: calls the method on the first element and returns its result.
	 * 
	 * Example:
	 * <code>
	 * // remove an element from the document
	 * HTMLElement.prototype.destroy = function() {
	 *     this.parentNode.removeChild(this);
	 * }
	 * 
	 * // remove all elements in array from the document
	 * ElementArray.map({ destroy: 'forEach' });
	 * </code>
	 * 
	 * @param mapping Object A hash of method names and mapping methods for ElementArray to map the results in the
	 * correct manner.
	 */
	map: function(mapping) {
		var map = ElementArray.map, elementArray = ElementArray.prototype, element = HTMLElement.prototype;
		for (var i in mapping) {
			var func = mapping[i];
			if (typeof func != 'function') {
				if (!map.hasOwnProperty(func)) continue;
				func = map[func];
			}
			elementArray[i] = func(element[i]);
		}
	}
});

// mapping methods create a new function that calls the given function on every element in the ElementArray.
extend(ElementArray.map, {
	some: function(func) {
		return function() {
			var args = arguments;
			return this.some(function(element) {
				return func.apply(element, args);
			});
		};
	},
	every: function(func) {
		return function() {
			var args = arguments;
			return this.every(function(element) {
				return func.apply(element, args);
			});
		};
	},
	forEach: function(func) {
		return function() {
			var args = arguments;
			this.forEach(function(element) {
				func.apply(element, args);
			});
			return this;
		};
	},
	merge: function(func) {
		return function() {
			var args = arguments;
			var results = new ElementArray();
			this.forEach(function(element) {
				results.merge(func.apply(element, args));
			});
			return results;
		};
	},
	getterSetter: function(func) {
		return function() {
			var args = arguments;
			if (args.length == 1) {
				return this.length ? func.call(this[0], args[0]) : undefined;
			}
			this.forEach(function(element) {
				func.apply(element, args);
			});
			return this;
		};
	},
	returnFirst: function(func) {
		return function() {
			for (var i = 0, l = this.length; i < l; i++) {
				var result = func.apply(this[i], arguments);
				if (result != null) return result;
			}
		};
	},
	callFirst: function(func) {
		return function() {
			return func.apply(this[0], arguments);
		};
	}
});

Event.prevent = function(event) {
	event.preventDefault();
};
Event.stop = function(event) {
	event.preventDefault();
	event.stopPropagation();
};

var CustomEvent = new Class({
	extend: Event,
	constructor: function(type, bubbles, cancelable) {
		var evt = document.createEvent('Events');
		evt.initEvent(type, bubbles || false, cancelable || false);
		Class.makeClass(evt, this.constructor, true);
		return evt;
	}
});

//initMouseEvent( 'type', bubbles, cancelable, windowObject, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget )
var CustomMouseEvent = new Class({
	extend: MouseEvent,
	constructor: function(type, bubbles, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent(type, bubbles || false, cancelable || false, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
		Class.makeClass(evt, this.constructor, true);
		return evt;
	}
});

// initMutationEvent( 'type', bubbles, cancelable, relatedNode, (string) prevValue, (string) newValue, (string) attrName, (short) attrChange )
var CustomMutationEvent = new Class({
	extend: MutationEvent,
	constructor: function(type, bubbles, cancelable, relatedNode, prevValue, newValue, attrName, attrChange) {
		var evt = document.createEvent('MutationEvents');
		evt.initMutationEvent(type, bubbles || false, cancelable || false, relatedNode, prevValue, newValue, attrName, attrChange);
		Class.makeClass(evt, this.constructor, true);
		return evt;
	}
});


var DataEvent = new Class({
	extend: CustomEvent,
	constructor: function(type, data) {
		var evt = CustomEvent.call(this, type); // super(type);
		evt.data = data;
		return evt;
	}
});

var ChangeEvent = new Class({
	extend: CustomEvent,
	
	constructor: function(type, oldValue, newValue) {
		var evt = CustomEvent.call(this, type); // super(type);
		evt.oldValue = oldValue;
		evt.newValue = newValue;
		return evt;
	}
});


var ArrayChangeEvent = new Class({
	extend: CustomEvent,
	constructor: function(action, startIndex, endIndex, items) {
		var evt = CustomEvent.call(this, 'change'); // super(type);
		evt.action = action;
		evt.startIndex = startIndex;
		evt.endIndex = endIndex;
		evt.items = items;
		return evt;
	}
});


var ErrorEvent = new Class({
	extend: CustomEvent,
	constructor: function(type, code, msg) {
		var evt = CustomEvent.call(this, type); // super(type);
		evt.code = code;
		evt.msg = msg;
		return evt;
	}
});


var HistoryEvent = new Class({
	extend: CustomEvent,
	constructor: function(type, hash, state) {
		var evt = CustomEvent.call(this, type); // super(type);
		evt.hash = hash != null ? hash : window.location.hash.substring(1);
		evt.state = state;
		return evt;
	}
});


var EventDispatcher = new Class({
	createClosures: function(listeners) {
		if ( !(listeners instanceof Array)) {
			if (arguments.length == 1 && typeof listeners == 'string' && listeners.indexOf(',') != -1) {
				listeners = listeners.split(/\s*,\s*/);
			} else {
				listeners = toArray(arguments);
			}
		} 
		for (var i = 0, l = listeners.length; i < l; i++) {
			var methodName = listeners[i];
			if (methodName in this) this[methodName] = this[methodName].bind(this);
		}
	},
	addEventListener: function(type, listener) {
		if (typeof listener != 'function') throw 'Listener must be a function';
		if (!this.__events) {
			this.__events = {};
		}
		var events = this.__events[type];
		if (!events) {
			this.__events[type] = events = [];
		} else if (events.indexOf(listener) != -1) {
			return; // already added
		}
		events.push(listener);
	},
	removeEventListener: function(type, listener) {
		if (!this.__events) return;
		var events = this.__events[type];
		if (!events) return;
		var index = events.indexOf(listener);
		if (index != -1) {
			events.splice(index, 1);
		}
	},
	hasEventListener: function(type) {
		return (this.__events != null && type in this.__events && this.__events[type].length > 0);
	},
	on: function(type, listener) {
		var types = type.split(/\s*,\s*/);
		
		for (var i = 0, l = types.length; i < l; i++) {
			this.addEventListener(types[i], listener, false);
		};
		return this;
	},
	un: function(type, listener) {
		var types = type.split(/\s*,\s*/);
		
		for (var i = 0, l = types.length; i < l; i++) {
			this.removeEventListener(types[i], listener, false);
		};
		return this;
	},
	listen: function(selector, type, listener) {
		var wrap = function(event) {
			var target = event.target.parent(selector);
			if (target) {
				return listener.call(target, event);
			}
		}
		if (!listener.hasOwnProperty('__listen')) listener.__listen = {};
		listener.__listen[simpli5.getId(this)] = wrap;
		return this.on(type, wrap);
	},
	unlisten: function(selector, type, listener) {
		if (!listener.hasOwnProperty('__listen')) return;
		var wrap = listener.__listen[simpli5.getId(this)];
		if (wrap) this.un(type, wrap);
		return this;
	},
	dispatchEvent: function(event, clear) {
		if (!this.__events) return;
		var events = this.__events[event.type];
		if (!events) return;
		if (clear) delete this.__events[event.type];
		for (var i = 0, l = events.length; i < l; i++) {
			events[i].call(this, event);
		}
	},
	dispatch: function(eventType, clear) {
		if (!this.__events || !this.__events[eventType] || !this.__events[eventType].length) return;
		
		this.dispatchEvent(new CustomEvent(eventType), clear);
	}
});

(function() {
	var add = Node.prototype.addEventListener, remove = Node.prototype.removeEventListener;
	extend(Node.prototype, {
		// added for hasEventListener method, doesn't work in Firefox TODO fix or remove
		addEventListener: function(type, listener, capture) {
			if (!this.__events) {
				this.__events = {};
			}
			var events = this.__events[type];
			if (!events) {
				this.__events[type] = events = [];
			} else if (events.indexOf(listener) == -1) {
				events.push(listener);
			}
			add.call(this, type, listener, capture || false);
		},
		removeEventListener: function(type, listener, capture) {
			if (!this.__events) return;
			var events = this.__events[type];
			if (!events) return;
			var index = events.indexOf(listener);
			if (index != -1) {
				events.splice(index, 1);
			}
			remove.call(this, type, listener, capture || false);
		},
		hasEventListener: EventDispatcher.prototype.hasEventListener,
		on: EventDispatcher.prototype.on,
		un: EventDispatcher.prototype.un,
		listen: EventDispatcher.prototype.listen,
		unlisten: EventDispatcher.prototype.unlisten,
		createClosures: EventDispatcher.prototype.createClosures
	});
})();
extend(window, {
	on: EventDispatcher.prototype.on,
	un: EventDispatcher.prototype.un
});

ElementArray.map({
	on: 'forEach',
	un: 'forEach',
	listen: 'forEach',
	unlisten: 'forEach'
});


/**
 * Setup rollover/rollout events which components use often
 */
(function() {
	
	function listener(event) {
		var child = event.relatedTarget;
		var ancestor = event.target;
		// cancel if the relatedTarget is a child of the target
		while (child) {
			if (child.parentNode == ancestor) return;
			child = child.parentNode;
		}
		
		// dispatch for the child and each parentNode except the common ancestor
		ancestor = event.target.parentNode;
		var ancestors = [];
		while (ancestor) {
			ancestors.push(ancestor);
			ancestor = ancestor.parentNode;
		}
		ancestor = event.relatedTarget;
		while (ancestor) {
			if (ancestors.indexOf(ancestor) != -1) break;
			ancestor = ancestor.parentNode;
		}
		child = event.target;
		while (child) {
			var mouseEvent = document.createEvent('MouseEvents');
			mouseEvent.initEvent(event.type.replace('mouse', 'roll'),
					false, // does not bubble
					event.cancelable,
					event.view,
					event.detail, event.screenX, event.screenY,
					event.ctrlKey, event.altKey, event.metaKey, event.button,
					event.relatedTarget);
			child.dispatchEvent(mouseEvent);
			child = child.parentNode;
			if (child == ancestor) break;
		}
	}
	
	// setup the rollover/out events for components to use
	document.addEventListener('mouseover', listener, false);
	document.addEventListener('mouseout', listener, false);
})();

var simpli5 = (function() {
	
	// PRIVATE MEMBERS
	
	// id for global object ids used with molded.getId()
	var id = 0;
	
	// holds component registrations
	var registry = {};
	
	/**
	 * Sets up everything needed when the document is ready.
	 */
	function onDomLoaded() {
		simpli5.dispatch('domready');
		simpli5.mold(document.body);
		simpli5.dispatch('molded');
		simpli5.checkLoading();
	}
	
	
	// molded class, public members
	
	var Simpli5 = new Class({
		extend: EventDispatcher,
		
		/**
		 * Constructor
		 */
		constructor: function() {
			this.ready = false;
			document.addEventListener('DOMContentLoaded', onDomLoaded, false);
		},
		
		/**
		 * Create and return a unique id for an object. This allows object lookup in object hashmaps.
		 * 
		 * @param obj Object
		 * @return String
		 */
		getId: function(obj) {
			return obj.__simpli5Id || (obj.__simpli5Id = id++);
		},
		
		/**
		 * Registers a selector which will find and convert all elements to the given component type. When a two
		 * selectors match an element the former component will take precedence. When registering a component with the
		 * exact same selector as a previously registered component, the former will be replaced in the registry.
		 * 
		 * @param selector String
		 * @param componentClass Function (Class)
		 */
		register: function(selector, componentClass) {
			registry[selector] = componentClass;
		},

		/**
		 * Unregisters a given selector from converting its elements to a component type.
		 * 
		 * @param selector String
		 */
		unregister: function(selector) {
			delete registry[selector];
		},

		/**
		 * Returns the component type that is registered with a given selector.
		 * 
		 * @param selector
		 */
		getRegistered: function(selector) {
			return registry[selector];
		},

		selector: function(selector) {
			return selector + ', [component="' + selector + '"]';
		},
		
		/**
		 * Initialize all the components and set up all the data-bindings.
		 * 
		 * @param element HTMLElement
		 */
		mold: function(element) {
			
			for (var i in registry) {
				var selector = this.selector(i);
				try {
					if (element instanceof Array) {
						element.forEach(function(element) {
							if (!element.__isComponent && element.matches(selector)) element.makeClass(registry[i]);
						});
					} else if (element.matches(selector)) element.makeClass(registry[i]);
				} catch (e) {
					if (e.name == 'SYNTAX_ERR') throw 'Invalid selector used to mold: ' + selector;
					else throw e;
				}
				element.findAll(selector).forEach(function(elem) {
					if (!elem.__isComponent) elem.makeClass(registry[i]);
				});
			}
			
			return element;
		},
		
		checkLoading: function() {
			if (External.loadCount == 0) {
				simpli5.dispatch('ready', true);
			}
		}
	});
	
	
	// return an instance of the molded class
	return new Simpli5();
})();

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

var PropertyChange;
var Bind;
var BindableArray;

(function() {

PropertyChange = {

	/**
	 * 
	 * @param obj
	 * @param property
	 * @param observer
	 * @param [allTypes]
	 */
	observe: function(obj, property, observer, allTypes) {
		var props = property.split(/\s*,\s*/);
		var properties = obj.__observers__;
		if (!properties) {
			obj.__observers__ = properties = {};
		}
		
		for (var i = 0, l = props.length; i < l; i++) {
			property = props[i];
			if (typeof obj == 'function' && allTypes) {
				property = '(' + property + ')';
			}
			if (!this.isObservable(obj, property)) {
				this.makeObservable(obj, property);
			}
			var observers = properties[property];
			if (!observers) {
				properties[property] = observers = [];
			}
			if (observers.indexOf(observer) == -1) observers.push(observer);
		}
	},
	
	unobserve: function(obj, property, observer) {
		var props = property.split(/\s*,\s*/);
		var properties = obj.__observers__;
		if (!properties) return;
		
		for (var i = 0, l = props.length; i < l; i++) {
			property = props[i];
			var observers = properties[property];
			if (!observers) continue;
			var index = observers.indexOf(observer);
			observers.splice(index, 1);
		}
	},
	
	dispatch: function(obj, property, oldValue, newValue, force) {
		if (!force && oldValue === newValue) return;
		var properties = obj.__observers__, i, l;
		if (!properties) return;
		
		var observers = [].concat(properties[property] || []).concat(properties['*'] || []);
		for (i = 0, l = observers.length; i < l; i++) {
			observers[i](property, oldValue, newValue, obj);
		}
		
		var constructor = obj.constructor;
		property = '(' + ')';
		while (constructor) {
			properties = constructor.__observers__;
			constructor = constructor.prototype.__proto__ ? constructor.prototype.__proto__.constructor : null;
			if (!properties) continue;
			
			observers = [].concat(properties[property] || []).concat(properties['(*)'] || []);
			for (i = 0, l = observers.length; i < l; i++) {
				observers[i](property, oldValue, newValue, obj);
			}
		}
	},
	
	isObservable: function(obj, property) {
		var setter = obj.__lookupSetter__(property);
		if (setter && setter.observable) return true;
		if (!setter || setter.toString().indexOf('PropertyChange.dispatch') == -1) {
			return false;
		} else {
			setter.observable = true;
			return true;
		}
	},
	
	makeObservable: function(obj, property) {
		var getter = obj.__lookupGetter__(property);
		var setter = obj.__lookupSetter__(property);
		
		if (getter && setter) {
			obj.__defineSetter__(property, function(value) {
				var oldValue = getter.call(obj);
				if (oldValue == value) return;
				setter.call(this, value);
				value = getter.call(obj);
				PropertyChange.dispatch(obj, property, oldValue, value);
			});
		} else if (!getter) { // if read-only don't change, dev's job to dispatch the change
			var prop = obj[property];
			obj.__defineGetter__(property, function() { return prop; });
			obj.__defineSetter__(property, function(value) {
				var oldValue = prop;
				if (oldValue == value) return;
				prop = value;
				PropertyChange.dispatch(obj, property, oldValue, value);
			});
			obj.__lookupSetter__(property).observable = true;
		}
	}
};


Bind = {
	
	property: function(source, sourceProp, target, targetProp, twoWay) {
		var binding = new Binding(source, sourceProp, target, targetProp, twoWay);
		var bindings = source.__bindings__;
		if (!bindings) {
			source.__bindings__ = bindings = [];
		}
		bindings.push(binding);
		bindings = target.__bindings__;
		if (!bindings) {
			target.__bindings__ = bindings = [];
		}
		bindings.push(binding);
	},
	
	setter: function(source, sourceProp, setter) {
		var binding = new Binding(source, sourceProp, setter);
		var bindings = source.__bindings__;
		if (!bindings) {
			source.__bindings__ = bindings = [];
		}
		bindings.push(binding);
	},
	
	removeProperty: function(source, sourcePath, target, targetPath, twoWay) {
		var bindings = source.__bindings__;
		var targetBindings = target.__bindings__;
		if (!bindings || !targetBindings) return;
		
		for (var i = 0, l = bindings.length; i < l; i++) {
			var binding = bindings[i];
			if (binding.matches(source, sourcePath, target, targetPath, twoWay)) {
				binding.release();
				bindings.splice(i, 1);
				var index = targetBindings.indexOf(binding);
				if (index != -1) targetBindings.splice(index, 1);
				break;
			}
		}
	},
	
	removeSetter: function(source, sourcePath, setter) {
		var bindings = source.__bindings__;
		if (!bindings) return;
		
		for (var i = 0, l = bindings.length; i < l; i++) {
			var binding = bindings[i];
			if (binding.matches(source, sourcePath, setter)) {
				binding.release();
				bindings.splice(i, 1);
				break;
			}
		}
	},
	
	removeAll: function(target) {
		var bindings = target.__bindings__, index;
		if (!bindings) return;
		
		for (var i = 0, l = bindings.length; i < l; i++) {
			var binding = bindings[i];
			if (binding.source.length) {
				var bindSource = binding.source[0];
				index = bindSource.__bindings__.indexOf(binding);
				if (index != -1) bindSource.__bindings__.splice(index, 1);
			}
			if (binding.target.length) {
				var bindTarget = binding.target[0];
				index = bindTarget.__bindings__.indexOf(binding);
				if (index != -1) bindTarget.__bindings__.splice(index, 1);
			}
			binding.release();
		}
		bindings.length = 0;
	}
	
};

var Binding = new Class({
	
	constructor: function(source, sourcePath, target, targetPath, twoWay) {
		this.onChange = this.onChange.bind(this);
		this.source = [];
		this.target = [];
		this.reset(source, sourcePath, target, targetPath, twoWay);
	},
	
	matches: function(source, sourcePath, target, targetPath, twoWay) {
		if (typeof target == 'function' && targetPath == null) {
			return (this.source[0] == source && this.sourcePath.join('.') == sourcePath && this.setter == target);
		} else {
			return (this.source[0] == source && this.sourcePath.join('.') == sourcePath && this.target[0] == target && this.targetPath.join('.') == targetPath && this.twoWay == twoWay);
		}
	},
	
	release: function() {
		this.unbindPath('source', 0);
		this.unbindPath('target', 0);
		this.setter = null;
		this.sourcePath = null;
		this.targetPath = null;
		this.twoWay = false;
		this.sourceResolved = false;
		this.targetResolved = false;
		this.value = undefined;
	},

	reset: function(source, sourcePath, target, targetPath, twoWay) {
		this.release();
		this.twoWay = twoWay;
		
		if (typeof target == 'function' && targetPath == null) {
			this.setter = target;
			this.targetPath = [];
		} else {
			this.targetPath = targetPath.split('.');
		}
		this.sourcePath = sourcePath.split('.');

		this.bindPath('target', target, 0);
		this.update('source', source, 0);
	},
	
	bindPath: function(base, item, pathIndex) {
		var i, length, path = this[base + 'Path'], property, objs = this[base];
		
		this.unbindPath(base, pathIndex);
		
		for (i = pathIndex, length = path.length; i < length; i++) {
			if (item == null) break;
			objs[i] = item;
			property = path[i];
			if (pathIndex < length - 1 || this.twoWay || base == 'source') {
				PropertyChange.observe(item, property, this.onChange);
			}
			item = item[property];
		}
		this[base + 'Resolved'] = (i == length || item != null);
		return this[base + 'Resolved'] ? item : undefined;
	},
	
	unbindPath: function(base, pathIndex) {
		var path = this[base + 'Path'], objs = this[base], i = objs.length;
		
		while (i-- > pathIndex) {
			PropertyChange.unobserve(objs[i], path[i], this.onChange);
		}
		
		objs.length = pathIndex;
	},
	
	update: function(base, item, pathIndex) {
		pathIndex = pathIndex || 0;
		
		var oldValue = this.value;
		this.value = this.bindPath(base, item, pathIndex);
		
		this.updating = true;
		if (this.setter) {
			var target = this.source[this.source.length - 1];
			this.setter.call(target, this.sourcePath[this.sourcePath.length - 1], oldValue, this.value, target);
		}
		
		var otherBase = (base == 'source' ? 'target' : 'source');
		var resolved = this[otherBase + 'Resolved'];
		if (resolved) {
			var otherPath = this[otherBase + 'Path'];
			var otherItem = this[otherBase][otherPath.length - 1];
			if (otherItem) {
				var prop = otherPath[otherPath.length - 1];
				otherItem[prop] = this.value;
			}
		}
		this.updating = false;
	},
	
	onChange: function(property, oldValue, newValue, target) {
		if (this.updating) return;
		var pathIndex, prop;
		
		if ( (pathIndex = this.source.indexOf(target)) != -1) {
			prop = this.sourcePath[pathIndex];
			if (prop == property) {
				this.update('source', newValue, pathIndex + 1);
				return; // done
			}
		}

		if ( (pathIndex = this.target.indexOf(target)) != -1) {
			prop = this.targetPath[pathIndex];

			if (prop == property) {
				if (this.twoWay) {
					this.update('target', newValue, pathIndex + 1);
				} else {
					this.bindPath('target', newValue, pathIndex + 1);
					if (this.sourceResolved && this.targetResolved) {
						target = this.target[this.targetPath.length - 1];
						prop = this.targetPath[this.targetPath.length - 1];
						target[prop] = this.value;
					}
				}
			}
		}
	}
});

BindableArray = new Class({
	extend: Array,
	implement: EventDispatcher,
	
	push: function() {
		var items = toArray(arguments);
		var result = Array.prototype.push.apply(this, items);
		this.dispatchEvent(new ArrayChangeEvent('add', this.length - items.length, this.length - 1, items));
		return result;
	},
	
	pop: function() {
		var result = Array.prototype.pop.call(this);
		this.dispatchEvent(new ArrayChangeEvent('remove', this.length, this.length, [result]));
		return result;
	},
	
	shift: function() {
		var result = Array.prototype.shift.call(this);
		this.dispatchEvent(new ArrayChangeEvent('remove', 0, 0, [result]));
		return result;
	},
	
	unshift: function() {
		var items = toArray(arguments);
		var result = Array.prototype.unshift.apply(this, items);
		this.dispatchEvent(new ArrayChangeEvent('add', 0, items.length, items));
		return result;
	},
	
	splice: function(index, howmany, element1) {
		var args = toArray(arguments);
		var items = args.slice(2);
		var result = Array.prototype.splice.apply(this, args);
		
		if (result.length) {
			this.dispatchEvent(new ArrayChangeEvent('remove', index, result.length - 1, result));
		}
		if (items.length) {
			this.dispatchEvent(new ArrayChangeEvent('add', index, items.length - 1, items));
		}
		return result;
	},
	
	sort: function() {
		var args = toArray(arguments);
		var result = Array.prototype.sort.apply(this, args);
		this.dispatchEvent(new ArrayChangeEvent('reset', 0, this.length - 1, this));
		return result;
	},
	
	reverse: function() {
		var result = Array.prototype.reverse.call(this);
		this.dispatchEvent(new ArrayChangeEvent('reset', 0, this.length - 1, this));
		return result;
	}
});

})();

var Template = new Class({
	constructor: function (html) {
		if (arguments.length) {
			this.set.apply(this, arguments);
		}
	},
	
    placeholdersExp: /\{([^\{\}]+)\}/g,
	slashesExp: /\\/g,
	fixCarriageExp: /(\r\n|\n)/g,
	escapeSingleExp: /'/g,
	unEscapeEscapesExp: /\\('|\\)/g,
	tagStartExp: /<\w/g,
	attributeExp: /([-\w]+)="([^"]*\{[^\}]*\}[^"]*)"/g,
	innerContentExp: />([^<]*\{[^\}]*\}[^<]*)</g,
	propExp: /(^|\W)(this|data)\.([\w\.]+)(\()?/g,
	
	replace: function(m, code, index, str, data) {
		return eval('try { ' + code + ' }catch(e) {}') || '';
	},
	
	set: function (html) {
		delete this.apply; // delete cached version if exists
		delete this.createBound; // delete cached version if exists
		delete this.compiled;
		delete this.compiledBound;
		var lines = [], compile;
		for (var i = 0, l = arguments.length; i < l; i++) {
			var param = arguments[i];
			if (param instanceof Array) {
				lines = lines.concat(param);
			} else if (typeof param === 'string') {
				lines.push(param);
			} else if (typeof param === 'boolean') {
				compile = param;
			}
		}
		this.html = lines.join('').replace(/%7B/g, '{').replace(/%7D/g, '}') || '';
		if (compile) this.compile();
		return this;
	},
	
    apply: function(data) {
	    var replace = this.replace.bind(this, data);
        return this.html.replace(this.placeholdersExp, replace);
    },
	
	compileReplace: function(match, code) {
		// slashes have been added for all ', remove for code
		return "' + ((" + code.replace(this.unEscapeEscapesExp, "$1") + ") || '') + '";
	},
	
	compileReplaceArray: function(match, code) {
		// slashes have been added for all ', remove for code
		return "', ((" + code.replace(this.unEscapeEscapesExp, "$1") + ") || ''), '";
	},
	
	compile: function() {
		if (this.compiled) this;
		try {
			var func = "(function(data) { return '" +
				this.html.replace(this.slashesExp, '\\\\')
						.replace(this.fixCarriageExp, '\\n')
						.replace(this.escapeSingleExp, "\\'")
						.replace(this.placeholdersExp, this.compileReplace.boundTo(this)) +
			"'; })";
			this.apply = eval(func);
			this.compiled = true;
		} catch(e) {
			throw 'Error creating template "' + e + '" for template:\n' + this.html;
		}
		return this;
    },
	
	create: function(data) {
		var html = this.apply(data);
		return toElement(html);
	},
	
	createMolded: function(data) {
		return simpli5.mold(this.create(data));
	},
	
	// creates the template binding all {data.*} expressions to the top-level element
	createBound: function(data) {
		var topElement = toElement(this.html);
		
		simpli5.mold(topElement);
		
		// if there are no binding expressions, just return the html
		if (!this.html.match(this.placeholdersExp)) {
			return topElement;
		}
		
		var nodes = topElement.findAll('*');
		nodes.unshift(topElement);
		var nodeIndexes = [];
		while (this.tagStartExp.test(this.html)) {
			nodeIndexes.push(this.tagStartExp.lastIndex - 2); // the start of the tag
		}
		
		// find all the attributes and content {} and set up the bindings
		var match, setter;
		
		// find all attributes that have binding expressions
		while ( (match = this.attributeExp.exec(this.html)) ) {
			var attr = match[1];
			var value = match[2];
			
			if (data == null) {
				value = value.replace(/\bdata\b/g, 'this.data');
			}
			
			var element = null, index = this.attributeExp.lastIndex;
			for (var i = 0; i < nodeIndexes.length; i++) {
				if (index < nodeIndexes[i]) {
					element = nodes[i - 1];
					break;
				}
			}
			if (!element) element = nodes[nodes.length - 1];
			
			setter = this.createAttributeSetter(attr, value, topElement, element);
			
			// pull out binding expressions, there may be more than one
			while ( (match = this.placeholdersExp.exec(value)) ) {
				var code = match[1];
				// find each property that 
				while ( (match = this.propExp.exec(code)) ) {
					if (match[4]) continue; // matched a function, don't bind
					var obj = match[2] == 'this' ? topElement : data;
					var prop = match[3];
					Bind.setter(obj, prop, setter);
				}
			}
			setter();
		}
		
		// find all inner text that have binding expressions
		while ( (match = this.innerContentExp.exec(this.html)) ) {
			var content = match[1];
			var element = null, index = this.innerContentExp.lastIndex;
			
			if (data == null) {
				content = content.replace(/\bdata\b/g, 'this.data');
			}
			
			for (var i = 0; i < nodeIndexes.length; i++) {
				if (index < nodeIndexes[i]) {
					element = nodes[i - 1];
					break;
				}
			}
			if (!element) element = nodes[nodes.length - 1];
			
			setter = this.createContentSetter(content, topElement, element);
			
			// pull out binding expressions, there may be more than one
			while ( (match = this.placeholdersExp.exec(content)) ) {
				var code = match[1];
				
				// find each property that 
				while ( (match = this.propExp.exec(code)) ) {
					if (match[4]) continue; // matched a function, don't bind
					var obj = match[2] == 'this' ? topElement : data;
					var prop = match[3];
					if (!data)
					Bind.setter(obj, prop, setter);
				}
			}
			setter();
		}
		
		return topElement;
	},
	
	createAttributeSetter: function(attr, value, topElement, element) {
		return eval("(function() { try { element.attr('" + attr + "', '" +
				value.replace(this.slashesExp, '\\\\')
						.replace(this.fixCarriageExp, '\\n')
						.replace(this.escapeSingleExp, "\\'")
						.replace(this.placeholdersExp, this.compileReplace.boundTo(this)) +
			"'); } catch(e) { element.attr('" + attr + "', ''); } })").bind(topElement);
	},
	
	createContentSetter: function(content, topElement, element) {
		return eval("(function() { try { element.html(['" +
				content.replace(this.slashesExp, '\\\\')
						.replace(this.fixCarriageExp, '\\n')
						.replace(this.escapeSingleExp, "\\'")
						.replace(this.placeholdersExp, this.compileReplaceArray.boundTo(this)) +
			"']); } catch(e) { element.html(''); } })").bind(topElement);
	},
	
	compileBound: function() {
		if (this.compiledBound) return this;
		
		if (!this.html.match(this.placeholdersExp)) {
			this.createBound = this.createMolded;
			return;
		}
		
		var sections = "", section, count = 0, i, index, finalIndex, code, obj, prop;
		
		var nodes = toFragment(this.html).findAll('*');
		var nodeIndexes = [];
		while (this.tagStartExp.test(this.html)) {
			nodeIndexes.push(this.tagStartExp.lastIndex - 2); // the start of the tag
		}
		
		// find all the attributes and content {} and set up the bindings
		var match, setter;
		
		// find all attributes that have binding expressions
		while ( (match = this.attributeExp.exec(this.html)) ) {
			var attr = match[1];
			var value = match[2];
			
			index = this.attributeExp.lastIndex;
			finalIndex = -1;
			for (var i = 0; i < nodeIndexes.length; i++) {
				if (index < nodeIndexes[i]) {
					finalIndex = i - 1;
					break;
				}
			}
			if (finalIndex == -1) finalIndex = nodes.length - 1;
			
			count++;
			
			section = "\tvar element" + count + " = nodes[" + finalIndex + "], setter" + count + " = (function() {\n" +
			"		try {\n" +
			"			element" + count + ".attr('" + attr + "', '" + value.replace(this.slashesExp, '\\\\').replace(this.fixCarriageExp, '\\n').replace(this.escapeSingleExp, "\\'").replace(this.placeholdersExp, this.compileReplace.boundTo(this)) + "');\n" +
			"		} catch(e) {\n" +
			"			element" + count + ".attr('" + attr + "', '');\n" +
			"		}\n" +
			"	});\n";
			
			sections += section.replace(/this/g, 'topElement').replace(/(^|[^.])data/g, '$1host.data');
			
			// pull out binding expressions, there may be more than one
			while ( (match = this.placeholdersExp.exec(value)) ) {
				code = match[1];
				// find each property that 
				while ( (match = this.propExp.exec(code)) ) {
					if (match[4]) continue; // matched a function, don't bind
					obj = match[2] == 'this' ? 'topElement' : 'data';
					prop = match[2] == 'this' ? match[3] : 'data.' + match[3];
					sections += "\tBind.setter(" + obj + ", '" + prop + "', setter" + count + ");\n";
				}
			}
			sections += "\tsetter" + count + "();\n";
		}
		
		// find all inner text that have binding expressions
		while ( (match = this.innerContentExp.exec(this.html)) ) {
			var content = match[1];
			
			index = this.innerContentExp.lastIndex;
			finalIndex = -1;
			for (i = 0; i < nodeIndexes.length; i++) {
				if (index < nodeIndexes[i]) {
					finalIndex = i - 1;
					break;
				}
			}
			if (finalIndex == -1) finalIndex = nodes.length - 1;
			
			count++;
			
			section = "\tvar element" + count + " = nodes[" + finalIndex + "], setter" + count + " = (function() {\n" +
			"		try {\n" +
			"			element" + count + ".html(['" + content.replace(this.slashesExp, '\\\\').replace(this.fixCarriageExp, '\\n').replace(this.escapeSingleExp, "\\'").replace(this.placeholdersExp, this.compileReplaceArray.boundTo(this)) + "']);\n" +
			"		} catch(e) {\n" +
			"			element" + count + ".html('');\n" +
			"		}\n" +
			"	});\n";
			
			sections += section.replace(/this/g, 'topElement').replace(/(^|[^.])data/g, '$1host.data');
			
			// pull out binding expressions, there may be more than one
			while ( (match = this.placeholdersExp.exec(content)) ) {
				code = match[1];
				
				// find each property that 
				while ( (match = this.propExp.exec(code)) ) {
					if (match[4]) continue; // matched a function, don't bind
					obj = match[2] == 'this' ? 'topElement' : 'host';
					prop = match[2] == 'this' ? match[3] : 'data.' + match[3];
					sections += "\tBind.setter(" + obj + ", '" + prop + "', setter" + count + ");\n";
				}
			}
			sections += "\tsetter" + count + "();\n";
		}
		
		var func = "(function(data) {\n" +
		"	var fragment = toFragment(this.html), topElement = fragment.firstChild.nodeName ? fragment.firstChild : fragment.firstChild.nextSibling, nodes = fragment.findAll('*'), host = topElement;\n" +
		"	simpli5.mold(topElement);\n" +
		"	if (data) {\n" +
		"		host = {data: data};\n" +
		"	} else {\n" +
		"		data = topElement;\n" +
		"	}\n" + sections + "\n" +
		"	return topElement;\n" +
		"})";
		
		this.createBound = eval(func);
		this.compiledBound = true;
		
		return this;
	}
});
var Component, Configuration;

(function() {

	/**
	 * Initialize the events for an element
	 * @param obj
	 * @param element
	 */
	function initializeEvents(obj, element) {
		var evts = obj.events;
		 
		if (!evts || navigator.userAgent.indexOf('Firefox') != -1) return;
		
		for (var i = 0, l = evts.length; i < l; i++) {
			var evt = evts[i];
			if (element.hasAttribute('on' + evt)) {
				try {
					var listener = eval('(function(event) {' + element.getAttribute('on' + evt) + '})');
				} catch(e) {}
				if (listener) obj.on(evt, listener.boundTo(obj));
			}
		}
	}
	
	/**
	 * Initialize the properties from the attributes for an element
	 * @param obj
	 * @param element
	 */
	function initializeAttributes(obj, element) {
		var attrs = obj.properties;
		
		if (!attrs) return;
		
		for (var i = 0, l = attrs.length; i < l; i++) {
			var attr = attrs[i], prop = camelize(attr);
			if (element.hasAttribute(attr)) {
				obj[prop] = getValue(prop, element.getAttribute(attr));
			}
		}
	}
	
	function camelize(str) {
		var parts = str.split('-'), len = parts.length;
		if (len == 1) return parts[0];
		
		var camelized = str.charAt(0) == '-'
			? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
			: parts[0];
		
		for (var i = 1; i < len; i++)
			camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
		
		return camelized;
	}
	
	function getValue(prop, value) {
		var parsed;
		if (value.indexOf('{') == 0 && value.lastIndexOf('}') == value.length - 1) {
			// handle a bound value
			var component = this;
			value = value.substring(1, value.length - 1);
			Bind.setter(window, value, eval('(function() { try { component.' + prop + ' = ' + value + '; } catch (e) {} })'));
		} else if (value.indexOf(',') != -1) {
			parsed = value.split(/\s*,\s*/);
			for (var i = 0, l = parsed.length; i < parsed; i++) {
				parsed[i] = this.getValue(parsed[i]);
			}
			return parsed;
		} else if ((parsed = parseFloat(value)) == value.toString()) {
			return parsed;
		} else if (value == 'true' || value == 'false') {
			return (value == 'true');
		}
		return value;
	}
	
	
	
	Component = new Class({
		extend: window.HTMLUnknownElement || HTMLElement, // HTMLUnknownElement for Firefox quirkiness
		__isComponent: true,
		
		constructor: function(implementation) {
			// call the constructor inside our custom constructor
			var constructor = implementation.constructor;
			
			if (implementation.template && !implementation.template.compiledBound) implementation.template.compileBound();
			
			// register
			var register = implementation.register;
			delete implementation.register;
			
			// custom constructor
			implementation.constructor = function(data) { // the data object for an itemTemplate
				var element = this;
				this.data = data;
				
				// firefox throws an error for just accessing the tagName property, even though it exists.
				var firefoxError = false;
				try {
					element.tagName;
				} catch (e) {
					firefoxError = true;
				}
				
				if ((firefoxError || !element.tagName) && this.template) {
					element = this.template.createBound();
					element.__proto__ = this.__proto__;
					if ( !(element instanceof HTMLElement)) throw 'Components must extend HTMLElement or a subclass.';
				}
				
				constructor.apply(element, arguments);
				initializeEvents(element, element);
				initializeAttributes(element, element);
				if ('init' in element) element.init();
				return element;
			}
			
			if (register) {
				simpli5.register(register, implementation.constructor);
			}
			
			return new Class(implementation);
		}
		
	});
	
	/**
	 * Elements which represent objects and not actual visual pieces of the display. The
	 * HTMLElement will be removed after the configuration is saved and set up appropriately.
	 */
	Configuration = new Class({
		
		constructor: function(implementation) {
			
			var constructor = implementation.constructor;
			
			// register
			var register = implementation.register;
			delete implementation.register;
			
			// custom constructor
			implementation.constructor = function() {
				var element = this;
				
				constructor.apply(this, arguments);
				initializeEvents(this, element);
				initializeAttributes(this, element);
				element.remove();
				if ('init' in this) this.init();
			}
			
			if (register) {
				simpli5.register(register, implementation.constructor);
			}
			
			return new Class(implementation);
		}
	});

})();


var External = new Component({
	extend: Component,
	template: new Template('<external></external>'),
	register: 'external, [external]',
	properties: ['url', 'external', 'auto-load'],
	events: ['loaded'],
	
	constructor: function() {
		this.autoLoad = true;
	},
	
	init: function() {
		if (this.external) this.url = this.external;
		if (this.autoLoad && this.url) this.load();
	},
	
	load: function() {
		External.loadCount += 1;
		Ajax.send({
			method: 'get',
			url: this.url,
			complete: this.onLoaded.boundTo(this),
			error: this.onError.boundTo(this)
		});
	},
	
	onLoaded: function(data) {
		
		if (!data) return;
		
		var html = data;
		var nodes = this.replace(html);
		if (nodes.length == 1) {
			var node = nodes[0];
			for (var i = 0; i < this.attributes.length; i++) {
				var attr = this.attributes[i];
				if (this.properties.indexOf(attr.nodeName) == -1) {
					node.setAttribute(attr.nodeName, attr.nodeValue);
				}
			}
		}
		
		// TODO vet against other browsers
		var unsupported = navigator.userAgent.toLowerCase().indexOf('firefox') == -1;
		
		// replace all scripts with newly created but matching ones so that they'll execute. Firefox doesn't need it
		var scriptCount = 0;
		var scripts = nodes.findAll('script');
		for (var i = 0; i < scripts.length; i++) {
			var script = scripts[i];
			
			if (unsupported) {
				var old = script;
				script = document.createElement('script');
				for (var j = 0; j < old.attributes.length; j++) {
					var attr = old.attributes[j];
					if (attr.name) script.setAttribute(attr.name, attr.value);
				}
				script.innerHTML = old.innerHTML;
				old.replace(script);
			}
			
			if (script.hasAttribute('src')) {
				scriptCount++;
				script.onload = function() {
					if (--scriptCount == 0) {
						simpli5.mold(nodes);
						External.loadCount -= 1;
						simpli5.checkLoading();
					}
				};
			}
		}
		
		if (scriptCount == 0) {
			External.loadCount -= 1;
			simpli5.mold(nodes);
			simpli5.checkLoading();
		}
	},
	
	onError: function() {
		External.loadCount -= 1;
	}
});

External.loadCount = 0;

var Ajax = new Class({
	extend: Function,
	
	defaults: {
		method: 'get',
		async: true,
		prefix: '',
		headers: {},
		creds: false,
		format: function(data) { return data; }
	},
	
	constructor: function() {
		this.defaults = extend({}, this.defaults); // copy defaults for local alteration
		if (this.defaults.headers) {
			this.defaults.headers = extend({}, this.defaults.headers);
		}
	},
	
	get: function(url, data) {
		return this.send({
			method: 'get',
			url: url,
			data: data
		});
	},
	
	post: function(url, data) {
		return this.send({
			method: 'post',
			url: url,
			data: data
		});
	},
	
	put: function(url, data) {
		return this.send({
			method: 'put',
			url: url,
			data: data
		});
	},
	
	del: function(url) {
		return this.send({
			method: 'delete',
			url: url,
			data: data
		});
	},
	
	send: function(options) {
		// perhaps we should implement a deep copy
		if (options.headers && this.defaults.headers) {
			extend(options.headers, this.defaults.headers, false);
		}
		extend(options, this.defaults, false);
		
		var xhr = new XMLHttpRequest(), response = new Response();
		response.xhr = xhr;
		
		if (options.data && options.method.toLowerCase() == 'get') {
			var append = [];
			var appender = options.url.indexOf('?') == -1 ? '?' : '&';
			for (var i in options.data) {
				if (options.data.hasOwnProperty(i))
					append.push(encodeURIComponent(i) + '=' + encodeURIComponent(options.data[i]));
			}
			options.url += appender + append.join('&');
			delete options.data;
		}
		
		if (options.prefix && !/\w+:\/\//.test(options.url)) {
			options.url = options.prefix + options.url;
		}
		
		if (options.user) {
			xhr.open(options.method, options.url, options.async, options.user, options.password);
		} else {
			xhr.open(options.method, options.url, options.async);
		}
		
		if (options.creds) {
			xhr.withCredentials = true;
		}
		
		if (options.headers) {
			for (var i in options.headers) {
				if (!options.headers.hasOwnProperty(i)) continue;
				if (i.toLowerCase() == 'content-type' && !options.data) continue;
				xhr.setRequestHeader(i, options.headers[i]);
			}
		}
		
		response.on('abort', function() {
			response.un('abort', arguments.callee);
			alert('aborting');
			xhr.abort();
		});
		
		if (options.progress) response.on('progress', options.progress);
		if (options.complete) response.on('complete', options.complete);
		if (options.error) response.on('error', options.error);
		
		var lastIndex = 0, results;
		xhr.onprogress = function(e) {
			try {
				results = options.format(xhr.responseText.substring(lastIndex), xhr);
				lastIndex = xhr.responseText.length;
			} catch(e) {}
			response.trigger('progress', results);
		};
		
		xhr.onerror = function(e) {
			response.trigger('error', xhr);
		};
		
		xhr.onload = function(e) {
			try {
				results = options.format(xhr.responseText, xhr);
			} catch(e) {
				// formating error
				alert(e);
			}
			response.trigger('complete', results);
		};
		
		xhr.onabort = function(e) {
			response.trigger('abort', xhr);
		};
		
		if (options.data) {
			xhr.send(options.data);
		} else {
			xhr.send();
		}
		
		return response;
	},
	
	jsonFormat: function(data) {
		if (data == '' || data == null) return null;
		else return JSON.parse(data);
	}
});

Class.makeClass(Ajax, Ajax, true); // make Ajax a singleton instance of itself 

/**
 * Represents a single service which can be 
 */
var AjaxService = new Component({
	extend: Component,
	register: 'services service',
	properties: ['url-prefix', 'user', 'password', 'creds'],
	events: ['progress', 'complete', 'error'],
	
	constructor: function(connection) {
		this.connection = connection || Ajax;
		var service = this;
		var headers = this.headers = {};
		this.urlPrefix = '';
		
		this.findAll('headers header').forEach(function(header) {
			if (!header.hasAttribute('name') || !header.hasAttribute('value')) return;
			headers[header.getAttribute('name')] = header.getAttribute('value');
		});
		
		this.calls = this.findAll('call').forEach(function(call) {
			call.service = service;
			if (call.hasAttribute('name')) service[call.getAttribute('name')] = call;
		});
	},
	
	send: function(method, url) {
		return this.connection.send({
			method: method,
			url: this.urlPrefix + url,
			format: this.format,
			headers: this.headers,
			user: this.user,
			password: this.password,
			creds: !!this.creds
		});
	},
	
	format: function(data) {
		if (data == '' || data == null) return null;
		else return JSON.parse(data);
	}
});

var AjaxCall = new Component({
	extend: Component,
	register: 'services service call',
	properties: ['method', 'url', 'auto-trigger'],
	events: ['progress', 'complete', 'error'],
	
	constructor: function() {
		this.css('display', 'none');
		this.autoTrigger = false;
		this.url = '';
		this.method = 'get';
	},
	
	get autoTrigger() {
		return this._autoTrigger || false;
	},
	set autoTrigger(value) {
		if (this._autoTrigger == value) return;
		this._autoTrigger = value;
		
		clearInterval(this._autoTriggerInterval);
		
		if (value === false) return;
		
		this.trigger();
		if (value === true || isNaN(value *= 1000)) return; // that's all
		
		this._autoTriggerInterval = setInterval(this.trigger.boundTo(this), value);
	},
	
	trigger: function(params) {
		if (params) {
			if ( !(params instanceof Array) ) params = [params];
			for (var i = 0; i < params.length; i++) {
				var url = this.url, param = params[i];
				for (var prop in param) url = url.replace(':' + prop, param[prop]);
				var response = this.service.send(this.method, url).on('complete', this.complete.boundTo(this));
				if (params.length == 1) return response;
			}
		} else {
			return this.service.send(this.method, this.url).on('complete', this.complete.boundTo(this));
		}
	},
	
	progress: function(data) {
		this.dispatchEvent(new DataEvent('progress', data));
	},
	
	complete: function(data) {
		this.data = data;
		this.dispatchEvent(new DataEvent('complete', data));
	},
	
	error: function(status, data) {
		this.dispatchEvent(new ErrorEvent('error', status, data));
	}
});

var Response = new Class({
	
	constructor: function() {
		this.status = 'progress';
		this.handlers = {complete: [], error: [], progress: []};
	},
	
	on: function(type, handler) {
		var types = type.split(/\s*,\s*/);
		var params = toArray(arguments).slice(1);
		
		for (var i = 0, l = types.length; i < l; i++) {
			if (!this.handlers.hasOwnProperty(types[i])) continue;
			this.handlers[types[i]].push(params);
		}
		return this;
	},
	
	un: function(type, handler) {
		var types = type.split(/\s*,\s*/);
		
		for (var i = 0, l = types.length; i < l; i++) {
			if (!this.handlers.hasOwnProperty(types[i])) continue;
			var handlers = this.handlers[types[i]];
			for (var i = 0; i < handlers.length; i++) {
				if (handler == handlers[i][0]) {
					handlers.splice(i--, 1);
				}
			}
		}
		return this;
	},
	
	abort: function(data) {
		return this.trigger('abort', data);
	},
	
	triggerComplete: function(data) {
		return this.trigger('complete', data);
	},
	
	triggerError: function(error) {
		return this.trigger('error', error);
	},
	
	trigger: function(type, data) {
		if (!this.handlers.hasOwnProperty(type)) return;
		this.status = type;
		var handlers = this.handlers[type];
		
		while (handlers.length) {
			var params = handlers.shift();
			var handler = params[0];
			params[0] = data;
			var result = handler.apply(data, params);
			if (result !== undefined) {
				if (result instanceof Response) {
					result.on('complete', this.triggerComplete.boundTo(this));
					result.on('error', this.triggerError.boundTo(this));
					return; // pick back up after this response is done
				} else {
					if (result instanceof Error && this.status == 'complete') {
						this.status = 'error';
						handlers = this.handlers.error;
					}
					data = result;
				}
			}
		}
		return this;
	}
});

var AjaxError = new Class({
	extend: Error,
	
	constructor: function(msg, status) {
		this.name = 'AjaxError';
		this.message = msg;
		this.status = status;
	},
	
	toString: function() {
		return 'AjaxError: ' + this.status + ' - ' + this.message;
	}
});

Storage.prototype.get = function(key) {
    return JSON.parse(this.getItem(key));
}

Storage.prototype.set = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

extend(Storage, {
	
	get: function(key, defaultValue) {
		if (key in sessionStorage) {
			return JSON.parse(sessionStorage[key]);
		} else if (key in localStorage) {
			return JSON.parse(localStorage[key]);
		} else {
			return defaultValue || false;
		}
	},
	
	set: function(key, value) {
		value = JSON.stringify(value);
		sessionStorage[key] = value;
		localStorage[key] = value;
	}
});

var Cookie = {
	set: function(name, value, expires) {
		document.cookie = name + "=" + encodeURI(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
		'; path=/';
	},
	
	get: function(name) {
		Cookie.open();
		return Cookie.cookies[name];
	},
	
	remove: function(name) {
		Cookie.set(name, '', new Date(0));
	},
	
	open: function() {
		Cookie.cookies = [];
		var items = document.cookie.split('; ');
		for (var i = 0; i < items.length; i++) {
			var cookie = items[i].split('=');
			Cookie.cookies[cookie[0]] = decodeURI(cookie[1]);
		}
	}
};
