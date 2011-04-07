
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
