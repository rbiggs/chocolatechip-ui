
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
