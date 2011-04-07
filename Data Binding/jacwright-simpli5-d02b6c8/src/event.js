
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
