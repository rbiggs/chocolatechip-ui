
var List = new Component({
	extend: Component,
	template: new Template('<list></list>'),
	register: 'list',
	properties: ['data'],
	
	constructor: function() {
		Bind.setter(this, 'data', this.onDataChange.boundTo(this));
		if (this.children.length) {
			this.itemTemplate = new Template(fromElement(this.children[0]));
			this.itemTemplate.compileBound();
			this.removeChild(this.children[0]);
		}
	},
	
	onDataChange: function(prop, old, value) {
		if (old && old instanceof BindableArray) old.un('change', this.onDataUpdate.boundTo(this));
		if (value && value instanceof Array) {
			if ( !(value instanceof BindableArray)) Class.makeClass(value, BindableArray);
			value.on('change', this.onDataUpdate.boundTo(this));
			this.onDataUpdate();
		}
	},
	
	onDataUpdate: function(event) {
		var action = event ? event.action : 'reset', template = this.itemTemplate;
		if (!template) return;
		var list = this;
		
		switch(action) {
			case 'add':
				var nextSib = this.children[event.startIndex];
				event.items.forEach(function(data) {
					var item = template.createBound();
					item.data = data;
					list.insertBefore(item, nextSib);
				});
				break;
			case 'remove':
				for (var i = event.startIndex; i <= event.endIndex; i++) {
					this.removeChild(this.children[event.startIndex]);
				}
				break;
			case 'reset':
				var items = [];
				this.data.forEach(function(data) {
					var item = template.createBound();
					item.data = data;
					items.push(item);
				});
				this.append(items);
				break;
		}
		
	}
});
