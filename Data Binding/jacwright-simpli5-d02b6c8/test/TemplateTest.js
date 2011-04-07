
TestCase('TemplateTest', {
	
	setUp: function() {
		this.template = new Template('<div>',
				'<ul class="green {data.myclass}">',
					'<li>asdf</li>',
				'</ul>',
			'</div>', true);
	},
	
	tearDown: function() {
		
	},
	
	testTemplateCreate: function() {
		assertEquals('Template not created correctly', this.template.html, '<div><ul class="green {data.myclass}"><li>asdf</li></ul></div>');
		assertNotNull('Template compile flag ignored on creation', this.template.compiled);
	},
	
	testTemplateApply: function() {
		this.template.compiled = null; // make sure we are testing the uncompiled apply here
		var result = this.template.apply({myclass: 'foobar'});
		assertEquals('Applied template incorrect', '<div><ul class="green foobar"><li>asdf</li></ul></div>', result);
	},
	
	testTemplateApplyCompiled: function() {
		var result = this.template.apply({myclass: 'foobar'});
		assertEquals('Applied compiled template incorrect', '<div><ul class="green foobar"><li>asdf</li></ul></div>', result);
	},
	
	testTemplateCreate: function() {
		var div = this.template.create({myclass: 'foobar'});
		assertTrue('Create did not succeed', div instanceof HTMLDivElement);
		assertEquals('Create succeeded, but results were incorrect', div.firstChild.className, 'green foobar');
	}//,
//	TODO fix the infinite loop happening here
//	testTemplateCreateBound: function() {
//		var div = this.template.createBound({myclass: 'foobar'});
//		assertTrue('CreateBound did not succeed', div instanceof HTMLDivElement);
//		assertEquals('CreateBound succeeded, but results were incorrect', div.firstChild.className, 'green foobar');
//	},
//	
//	testTemplateCreateBoundWithThis: function() {
//		var template = new Template('<div>',
//				'<ul class="green {data.myclass}">',
//					'<li>Hello {this.name}</li>',
//				'</ul>',
//			'</div>');
//		
//		var div = template.createBound({myclass: 'foobar'});
//		
//		assertTrue('CreateBound did not succeed', div instanceof HTMLDivElement);
//		assertEquals('CreateBound succeeded, but results were incorrect', div.firstChild.className, 'green foobar');
//		assertEquals('Binding did not initialize correctly', div.outerHTML, '<div><ul class="green foobar"><li>Hello </li></ul></div>');
//		div.name = 'Bob';
//		assertEquals('Binding did not update correctly', div.outerHTML, '<div><ul class="green foobar"><li>Hello Bob</li></ul></div>');
//	}
});