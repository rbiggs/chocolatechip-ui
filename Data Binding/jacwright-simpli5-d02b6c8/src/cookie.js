
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
