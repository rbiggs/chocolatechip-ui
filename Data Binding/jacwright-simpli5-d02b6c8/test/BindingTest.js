
TestCase('PropertyChangeTest', {
	
	setUp: function() {
		this.obj = {name: 'John', age: 32, smart: true,
			get status() {
				return this._status;
			},
			set status(value) {
				var oldValue = this._status;
				if (oldValue == value) return;
				this._status = value;
				PropertyChange.dispatch(this, 'status', oldValue, value);
			},
			get height() {
				return this._height;
			},
			set height(value) {
				if (typeof value != 'string') value += '"'; // inches
				this._height = value;
			}
		};
	},
	
	tearDown: function() {
		this.obj = null;
	},
	
	testAddObserver: function() {
		var observer = function() {};
		PropertyChange.observe(this.obj, 'name', observer);
		assertEquals('Observer was not added successfully', this.obj.__observers__.name.length, 1);
		assertEquals('Observer was not added successfully', this.obj.__observers__.name[0], observer);
	},
	
	testAddObservers: function() {
		var observer = function() {};
		PropertyChange.observe(this.obj, 'name, age, smart', observer);
		assertEquals('Multiple observers were not added successfully', this.obj.__observers__.name[0], observer);
		assertEquals('Multiple observers were not added successfully', this.obj.__observers__.age[0], observer);
		assertEquals('Multiple observers were not added successfully', this.obj.__observers__.smart[0], observer);
	},
	
	testRemoveObserver: function() {
		var observer = function() {};
		this.obj.__observers__ = {name: [observer]};
		PropertyChange.unobserve(this.obj, 'name', observer);
		assertEquals('Observer was not removed successfully', this.obj.__observers__.name.length, 0);
	},
	
	testRemoveObservers: function() {
		var observer = function() {};
		this.obj.__observers__ = {name: [observer], age: [observer], smart: [observer]};
		PropertyChange.unobserve(this.obj, 'name, age, smart', observer);
		assertEquals('Multiple observers were not removed successfully', this.obj.__observers__.name.length, 0);
		assertEquals('Multiple observers were not removed successfully', this.obj.__observers__.age.length, 0);
		assertEquals('Multiple observers were not removed successfully', this.obj.__observers__.smart.length, 0);
	},
	
	testIsObservable: function() {
		assertFalse('Un-observable property specified as observable', PropertyChange.isObservable(this.obj, 'name'));
		assertTrue('Observable property specified as un-observable', PropertyChange.isObservable(this.obj, 'status'));
	},
	
	testMakeObservable: function() {
		PropertyChange.makeObservable(this.obj, 'name');
		assertNotNull('Property was not made observable', this.obj.__lookupSetter__('name'));
	},
	
	testObserving: function() {
		var changed = false;
		var obj = this.obj;
		PropertyChange.observe(this.obj, 'name', function(property, oldValue, newValue, target) {
			assertEquals('Property was not passed to observer correctly', 'name', property);
			assertEquals('Target was not passed to observer correctly', 'John', oldValue);
			assertSame('Target was not passed to observer correctly', 'Fred', newValue);
			assertEquals('Target was not passed to observer correctly', obj, target);
			changed = true;
		});
		this.obj.name = 'Fred';
		assertTrue('Observer was never called on property change', changed);
	},
	
	testObservingSetter: function() {
		var changed = false;
		var obj = this.obj;
		obj.height = 100;
		PropertyChange.observe(this.obj, 'height', function(property, oldValue, newValue, target) {
			assertEquals('Property was not passed to observer correctly for setter', 'height', property);
			assertEquals('Target was not passed to observer correctly for setter', '100"', oldValue);
			assertSame('Target was not passed to observer correctly for setter', '110"', newValue);
			assertEquals('Target was not passed to observer correctly for setter', obj, target);
			changed = true;
		});
		obj.height = 110;
		assertTrue('Observer was never called on setter change', changed);
	}
	
});


TestCase('BindingTest', {
	
	setUp: function() {
		this.source = {name: 'John', age: 32, smart: true, friend: {name: 'Harold', age: 11, smart: false}};
		this.target = {name: 'Sue', age: 28, smart: false, friend: {name: 'Sally', age: 16, smart: true}};
	},
	
	tearDown: function() {
		this.source = null;
		this.target = null;
	},
	
	testBindProperty: function() {
		Bind.property(this.source, 'age', this.target, 'friend.age', true);
		assertEquals('Binding did not update', this.source.age, this.target.friend.age);
		this.target.friend.age = 100;
		assertEquals('Binding did not update', this.target.friend.age, this.source.age);
	},
	
	testRemoveBindProperty: function() {
		Bind.property(this.source, 'age', this.target, 'friend.age', true);
		this.source.age = 50;
		assertEquals('Binding did not update', 50, this.target.friend.age);
		Bind.removeProperty(this.source, 'age', this.target, 'friend.age', true);
		this.source.age = 60;
		assertEquals('Binding updated when it should not have', 50, this.target.friend.age);
	},
	
	testBindSetter: function() {
		var changed = false;
		Bind.setter(this.source, 'name', function() {
			changed = true;
		});
		this.source.name = 'asdf';
		assertTrue('Bind setter never called', changed);
	}
});