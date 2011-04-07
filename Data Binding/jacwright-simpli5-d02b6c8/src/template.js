
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
