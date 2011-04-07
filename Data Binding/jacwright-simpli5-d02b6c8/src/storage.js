
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
