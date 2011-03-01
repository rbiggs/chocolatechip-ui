/*        
    pO)     
   6  /\
     /MM\
   /MMMMMM\
  /MMMMMMMM\
(((MMMMMMMM)))
 \:~==++==~:/    
       
ChocolateChip.js: tiny but delicious
A JavaScript library for mobile Web app development, providing the functionality 
necessary for creating professional HTML5/CSS3-based Web apps.

Copyright 2011 Robert Biggs: www.choclatechip-mobile.net
License: BSD
Version 1.1.2

*/

(function() {
	/* 
	Function: $
	
	This method uses JavaScript's document.querySelector() method to get the designated node. It will always return the first match.
	
	Parameters:
	
	A valid CSS selector.
	
	- selector:string A string defining a valid CSS selector.
	- context:string A string defining a valid CSS selector or an actual node.
	
	Returns: 
	
	A valid document node.
	
	Example:
	
	(start code)
	var item = $("#item");
	var menuItems = $(".menu > li"); // Will return the first list item only.
	$("section > p:first-of-type").css("color: red; background-color: yellow; padding: 10px;");
	var list = $("ul", mainList);
	(end)
	*/
    var $ = function ( selector, context ) {
    	if (!!context) {
    		if (typeof context === "string") {
				return document.querySelector(context + " " + selector);
    		} else if (context.nodeType === 1) {
    			return context.querySelector(selector);
    		} 
    	} else {
    		return document.querySelector(selector);
    	}
		return document.querySelector(selector);
	};
	/* 
	Function: $.extend
	
	A method to extend the ChocolateChip's $ method. This uses EC5's Object.defineProperty to extend objects without polluting the object's prototype.
	
	Syntax:
	
	(start code)
	$.extend(object, {
	// object literal here.
	});
	(end)
		
	Parameters:
	
	- The object to extend. In most cases this will be $ or HTMLElement.prototype.
	- A object literal of properties to add to ChocolateChip. These can be values or methods.
	
	Example:
	
	(start code)
	$.extend($, {
		saySomething : function ( msg ) {
			console.log("This is what I have to say: " + msg);
		}
	});
	$.saySomething("This is a pretty cool feature!");
	
	$.extend(HTMLElement.prototype, {
		sing : function ( lyrics ) {
			console.log(msg);
		}
	});
	$("p:first-of-type").sing("Even a paragraph can sing!");
	(end)
	
	*/
    $.extend = function(obj, prop) {
    	if (!Object.keys) {
			if (!prop) {
				prop = obj;
				obj = this;
			}
			for (var i in prop) {
				obj[i] = prop[i];
			}
			return obj;
		} else {
			Object.keys(prop).forEach(function(p) {
				if (prop.hasOwnProperty(p)) {
					Object.defineProperty(obj, p, {
						value: prop[p],
						writable: true,
						enumerable: false,
						configurable: true
					});
				}
			});
		}
	};
	
	$.extend($, {
		/*
		Variable: $.version
		
		Version: 1.1.1
		
		Example:
		
		(start code)
		console.log("The version is: " + $.version);
		(end)
		*/
		version : "1.1.2",
		
		/* 
		Function: $.collectionToArray
		
		This is a function to convert an DOM node collection into an array. This is so you can use array extras like, forEach, map, slice, etc.
		
		Parameters:
		
		The node collection to convert into an array.
		
		Syntax:
		
		$.collectionToArray(NodeList);
		
		Returns:
		
		An array of nodes in an HTMLElement collection. 
		
		Example:
		
		(start code)
		var p = document.getElementsByTagName("p");
		var pArray = $.collectionToArray(p);
		(end)
		
		*/
		collectionToArray : function ( collection ) {
			var array = [];
			var i = 0, len = collection.length;
			while ( i < len ) {
				array[i] = collection[i];
				i++;
			}
			return array;
		},
		/* 
		Function: $.$$
		
		This method uses document.querySelectorAll to return a DOM collection as an array. It employs the method $.collectionToArray to convert the collection of nodes into an array. This will later be passed out as a global object. It also uses the $.collectionToArray method to convert and HTMLCollection into an array. $.$$() gets aliased as window.$$() so that you can uses it as just $$() instead of $.$$().
		
		Parameters:
		
		A valid CSS selector.
		
		Syntax:
		
		(start code)
		$$(selector);
		$$(selector, context);
		(end)
			
		Parameters:
		
		- A string defining a valid CSS selector.
		- Context: A string defining a valid CSS selector or an actual node.
		
		Returns:
		
		An array of nodes comprising an element collection.
		
		Example:
		
		(start code)
		var sections = $$("section");
		$$("section > p").forEach(function(p) {
			p.css("color: red; background-color: yellow; padding: 10px;");
		});
		(end)
		 
		See Also:
		 
		<$.collectionToArray>
		*/
		
		$$ : function ( selector, context ) {
			if (!!context) {
				if (typeof context === "string") {
					return $.collectionToArray(document.querySelectorAll(context + " " + selector));
				} else if (context.nodeType === 1){
					return $.collectionToArray(context.querySelectorAll(selector));
				}
			} else {
				return $.collectionToArray(document.querySelectorAll(selector));
			}
		},
		body : null,
		app : null
	});
    
	$.extend(HTMLElement.prototype, {
		/* 
		Function: Element.previous
		
		This method returns the previous sibling of the element upon which it executes. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).previous();
		
		Returns:
		
		The previous sibling node. 
		
		Example:
		
		(start code)
		var previousItem = $("#item").previous();
		(end)
		*/
		previous : function ( ) {
			return this.previousElementSibling;
		},
		
		/* 
		Function: Element.next
		
		This method return the next sibling of the element upon which it executes. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).next();
		
		Returns:
		
		The next sibling node. 
		
		Example:
		
		(start code)
		var nextItem = $("#item").next();
		(end)
		*/
		next : function ( ) {
			return this.nextElementSibling;
		},
		
		/* 
		Function: Element.first
		
		A method to get the first child of an element while avoiding empty text nodes. This method is attached directly to the Element object.
		
		Syntax:
		
		element.first();
		
		Example:
		
		(start code)
		$("#menu").first();
		(end)
		*/
		first : function ( ) {
			return this.firstElementChild;
		},
		
		/* 
		Function: Element.last
		
		A method to get the last child of an element, while avoiding empty text nodes. This method is attached directly to the Element object.
		
		Syntax:
		
		element.last();
		
		Example:
		
		(start code)
		$("#menu").last();
		(end)
		*/
		last : function ( ) {
			return this.lastElementChild;
		},

		/*
		Function: Element.ancestor
		
		A method to retrieve an ancestor of a node. It can find an ancestor by numeric postion, tag, class or id. Besides class and id, no other attributes can be parsed and will throw an exception.
		
		Parameters:
		
		- value: Either a number, a class, an id or a tag.
		
		Syntax: 
		
		Element.ancestor(selector)
		
		Returns:
		
		A matched ancestor node. 
		
		Usage:
		
		(start code) 
		// Will return the third ancestor tag:
		var theAncestor = $("#someID").ancestor(3);
		// Will return the element with id of "#main" 
		// if it is an ancestor of "#someID":
		var theAncestor = $("#someID").ancestor("#main");
		// Will return an element with a class of ".myView" if
		// it is an ancestor of "#someID":
		var theAncestor = $("#someID").ancestor(".myView");
		// Will return a subview tag if it is an ancestor of "#someID":
		var theAncestor = $("#someID").ancestor("subview");
		(end)
		*/		
		ancestor : function( selector ) {
			var idCheck = new RegExp("^#");
			var classCheck = new RegExp("^.");
			var p = this.parentNode;
			if (!p) {
				return false;
			}
			if (typeof selector === "string") {
				selector.trim();
			}
			if (typeof selector === "number") {
				position = selector || 1;
				 for (var i = 1; i < position; i++) {
					 if (p.nodeName === "HTML") {
						 return p;
					 } else {
						 if (p != null) {
							 p = p.parentNode;
						 }
					 }
				 }	
				 return p;
			} else if (selector.substr(0,1) === "." ) {
				var newSelector = selector.split(".")[1];
				if (p.nodeName === "BODY") {
					return false;
				}
				if (p.hasClass(newSelector)) {
					return p;
				} else {
					return p.ancestor(selector);
				}
			} else if (selector.substr(0,1) === "#" ) {
				var newSelector = selector.split("#")[1];
				if (p.getAttribute("id") === newSelector) {
					return p;
				} else {
					return p.ancestor(selector);
				}
			} else { 
			   if (p.tagName.toLowerCase() === selector) {
				   return p;
			   } else {
				   return p.ancestor(selector);
			   } 
			}
		},		
		
		/* 
		Function: Element.ancestorTag
		
		This is an alias to Element.ancestor included for backwards compatibility with earlier versions of ChocolateChip (1.1.0 or less).
		
		Syntax:
		
		Element.ancestorTag(selector);
		
		Returns:
		
		A matched ancestor node. 
		
		Example:
		
		(start code)
		var ancestor = $("#item").ancestorTag("article");
		(end)
		
		See Also:
		
		<Element.ancestor>
		*/
		ancestorByTag : function ( selector ) {
			return this.ancestor(selector);
		},
		
		/* 
		Function: Element.ancestorClass
		
		This is an alias to Element.ancestor included for backwards compatibility with earlier versions of ChocolateChip (1.1.0 or less).
		
		Syntax:
		
		Element.ancestorClass(selector);
		 
		Returns:
		
		A matched ancestor node. 
		 
		Example:
		
		(start code)
		var ancestor = $("#item").ancestorClass("generic class");
		(end)
		
		See Also:
		
		<Element.ancestor>
		*/
		ancestorByClass : function ( selector ) {
			selector = "." + selector;
			return this.ancestor(selector);
		},
		
		/* 
		Function: Element.ancestorByPosition
		
		This is an alias to Element.ancestor included for backwards compatibility with earlier versions of ChocolateChip (1.1.0 or less).
		
		Parameters: 
		
		An integer indicating the position of the ancestor to find.
		
		Syntax:
		
		Element.ancestorByPosition(position);
		
		Returns:
		
		A matched ancestor node. 
		
		Example:
		
		(start code)
		// Returns the third ancestor
		var ancestor = $("#item").ancestorPosition(3);
		(end)
		
		See Also:
		
		<Element.ancestor>
		*/		
		ancestorByPosition : function ( position ) {
			return this.ancestor(position);
		}
    });
 
	$.extend($, {
		/* 
		Function: $.make
		
		This method creates nodes from a string of valid HTML passed as an argument. The result is an array of one or more nodes. By iterating this array you can insert them into a document. This method is attached directly to the $ object.
		
		Parameters:
		- A string defining nodes to create.
		- An array of valid nodes existing in memory.
		
		Syntax:
		
		$.make(string);
		
		Returns:
		
		A collection of new nodes. 
		
		Example:
		
		(start code)
		var paragraph = $.make("<p>This is a paragraph</p>");
		(end)
		*/
		make : function ( HTMLString ) {
			var nodes = [];
			var temp = document.createElement("div");
			temp.innerHTML = HTMLString;
			var i = 0;
			var len = temp.childNodes.length;
			while (i < len) {
				nodes[i] = temp.childNodes[i];
				i++;
			}
			return nodes;
		},
		
		/* 
		Function: $.replace
		
		A method to clone a node. If a boolean value that evaluates to true is passed as an argument, the method will clone the node and all its child nodes, otherwise it clones only the node itself. This method is attached directly to the Element object.
		
		Syntax:
		
		$.replace(newNode, oldNode);
		
		Parameters:
		
		- newNode: A a node to with which to replace.
		- oldNode: The node to be replaced.
		
		Example:
		
		(start code)
		var newNode = $.make("<div>A new div</div>");
		$.replace(newNode, $("#menu"));
		(end)
		*/
		replace : function ( newElem, oldElem ) {
			 oldElem.parentNode.replaceChild(newElem, oldElem);
		}
    });
    
	$.extend(HTMLElement.prototype, {
		/* 
		Function: Element.empty
		
		Remove all child nodes of an element. This method invokes the removeEvents method first to remove any attached events and thereby prevent memory leaks. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).empty();
		
		Example:
		
		(start code)
		$("#item").empty();
		(end)
		*/
		empty : function ( ) {
			this.removeEvents();
			this.textContent = "";
		},
		
		/* 
		Function: Element.clone
		
		A method to clone a node. If a boolean value that evaluates to true is passed as an argument, the method will clone the node and all its child nodes, otherwise it clones only the node itself. This method is attached directly to the Element object.
		
		Syntax:
		
		element.clone();
		
		Parameters:
		
		- Any boolean value.
		
		@return {Node} Returns a clone of an element. 
		
		Example:
		
		(start code)
		var menu = $("#menu").clone(true);
		(end)
		*/
		clone : function ( value ) {
			if (value === true || !value) {
				return this.cloneNode(true);
			} else {
				return this.cloneNode(false);
			}
		},
		
		/* 
		Function: Element.wrap
		A method to wrap a node in markup. This method is attached directly to the Element object.
		
		Syntax:
		
		element.wrap(string);
		
		Parameters:
		
		- string: A string of valid HTML markup in which to encase the element.
		
		Example:
		
		(start code)
		$("#menu").wrap("<nav id='main'></nav>");
		(end)
		*/
		wrap : function ( string ) {
			var tempNode = $.make(string);
			tempNode = tempNode[0];
			var whichClone = this.clone(true);
			tempNode.appendChild(whichClone);
			this.after(tempNode, this);
			this.remove(this); 
		}
    });
    
	$.extend(HTMLElement.prototype, {
		/* 
		Function: Element.unwrap
		
		A method to unwrap a node by removing its parent node. It has a failsafe to stop removing nodes when it reaches the body tag.
		
		Syntax:
		
		element.unwrap();
		
		Example:
		
		(start code)
		$("#menu").unwrap();
		(end)
		*/
		unwrap : function ( ) {
			if (this.parentNode.nodeName === "BODY") {
				return false;
			}
			var element = this.cloneNode(true);
			$.replace(element, this.parentNode);
		},
		
		/* 
		Function: Element.text
		
		This method adds text to the target element, replacing whatever child nodes it might have. If no value is passed as an argument, the method returns the text value of all child nodes of the target element. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).text(string);
		$(selector).text(variable);
		$(selector).text();
		
		arguments:
		
		- string: A string of text to add to an element.
		- variable: A string of text to add to an element.
		
		Returns:
		
		The text nodes of the element. 
		
		Example:
		
		(start code)
		$("#item").text("This is an example of added text.");
		var textValue = $("#item").text();
		(end)
		*/
		text : function ( value ) {
			if (!!value) {
				this.innerText = value;
			} else {
				return this.innerText;
			}
		},
		
		/* 
		Function: Element.fill
		
		Replace element's childNodes with content. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).fill(content);
		
		Example:
		
		(start code)
		$("#item").fill(content);
		(end)
		*/
		fill : function ( content ) {
			this.empty();
			if (typeof content === "string") {
				this.textContent = content;
			} else {
				this.insert(content);
			}
		},
		
		/* 
		Function: Element.empty
		
		Remove all child nodes of an element. This method invokes the removeEvents method first to remove any attached events and thereby prevent memory leaks. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).empty();
		
		Example:
		
		(start code)
		$("#item").empty();
		(end)
		*/
		empty : function ( ) {
			this.removeEvents();
			this.textContent = "";
		},
		
		/* 
		Function: Element.remove
		
		Remove an element from the document. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).remove();
		
		Example:
		
		(start code)
		$("#item").remove();
		(end)
		*/
		remove : function ( ) {
			this.removeEvents();
			this.parentNode.removeChild(this);
		},
		
		/* 
		Function: Element.insert
		
		A method to insert a node or nodes at nth position in the child node collection of the element on which the method is being called. This can be the first position, the last position, or anywhere in between these. If no position is passed as an argument it defaults to last position. If the parent element has no child nodes, the method inserts the new element as the first child of the parent element. This method is attached directly to the Element object.
		
		Syntax:
		
		$.insert( content, position );
		
		Parameters:
		
		- A valid node to insert into the child node collection of another node.
		- A string with a value for first or last position for insertion.
		- An integer indicating the position in the target element's child node collection at which to insert.
		
		Example:
		
		(start code)
		$.itemNumber = 1;
		$$("p").forEach(function(item) { 
			item.insert( $.make("<span>Introductory Matter: " + $.itemNumber + " .</span>"), "first");
			++$.itemNumber;
		});
		$.itemNumber = null;
		(end)
		*/
		insert : function ( content, position ) {
			var c = "";
			if (typeof content === "string") {
				c = $.make(content);
			} else if (content.nodeType === 1) {
				c = [];
				c.push(content);
			} else {
				c = content;
			}
			var i = 0;
			var len = c.length;
			if (!position || position > (this.children.length + 1) || position === "last") {
				while (i < len) {
					this.appendChild(c[i]);
					i++;
				}
			} else if (position === 1 || position === "first") {
				while (i < len) {
					this.insertBefore(c[i], this.firstElementChild);
					i++;
				}
			} else {
				while (i < len) {
					this.insertBefore(c[i], this.children[position - 1]);
					i++;
				}
			}
		},
		
		/* 
		Function: Element.before
		
		A method to insert content before the node upon which it operates. This method is attached directly to the Element object.
		
		Syntax:
		
		element.before(node);
		
		Parameters:
		
		- node:node A valid node to insert before another node.
		
		Example:
		(start code)
		$.itemNumber = 1;
		$$("p").forEach(function(item) { 
		   item.before( $.make("<h1>Title " + $.itemNumber + "</h1>"));
		   ++$.itemNumber;
		});
		$.itemNumber = null;
		(end)
		*/
		before : function ( content ) {
			if (content.constructor === Array) {
			   var len = content.length;
			   var i = 0; 
			   while (i < len) {
				   this.parentNode.insertBefore(content[i], this);
				   i++;
			   }
			} else {
			   this.parentNode.insertBefore(content, this);
			}
		},
		
		/* 
		Function: Element.after
		
		A method to insert content consisting of a node or nodes before the node upon which it operates. This method is attached directly to the Element object.
		
		Syntax:
		
		element.after(node);
		
		Parameters:
		
		- node: A valid node to insert before another node.
		
		Example:
		
		(start code)
		$.itemNumber = 1;
		$$("p").forEach(function(item) { 
		   item.after( $.make("<p>Addendum " + $.itemNumber + "</p>"));
		   ++$.itemNumber;
		});
		$.itemNumber = null;
		(end)
		*/
		after : function ( content ) {
			var parent = this.parentNode;
			if (content.constructor === Array) {
				var i = 0, len = content.length;
				while (i < len) {
					if (this === parent.lastChild) {
						parent.appendChild(content[i]);
					} else {
						parent.insertBefore(content[i],this.nextSibling);
					}
					i++;
				}
			} else {
				if (content === this.lastChild) {
					parent.appendChild(content);
				} else {
					parent.insertBefore(content, this.next());
				}
			}
		},
		
		/* 
		Function: Element.hasClass
		
		Check an element to see if it has a particular class. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).hasClass(className);
		
		Parameters:
		
		- className: The name of the CSS class to check for.
		
		Example:
		
		(start code)
		$("#item").hasClass("hover");
		(end)
		*/
		hasClass : function ( className ) {
			return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(this.className);
		},
		
		/* 
		Function: Element.addClass
		
		Add a class to an element. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).addClass(className);
		
		Parameters:
		
		- className: The name of the CSS class to add.
		
		Example:
		
		(start code)
		$("#item").addClass("hover");
		(end)
		*/
		addClass : function ( className ) {
			if (!this.hasClass(className)) {
				this.className = [this.className, className].join(' ').replace(/^\s*|\s*$/g, "");
			}
		},
		
		/* 
		Function: Element.removeClass
		
		Remove a class from an element. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).removeClass(className);
		
		Parameters:
		
		- className:string the name of the CSS class to remove.
		
		Example:
		
		(start code)
		$("#item").removeClass("hover");
		(end)
		*/
		removeClass : function ( className ) {
			if (this.hasClass(className)) {
				var currentClasses = this.className;
				this.className = currentClasses.replace(new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g'), ' ').replace(/^\s*|\s*$/g, "");
			}
		},
		/*
		##Function: Element.disable
		
		A method to disable an element by adding the "disable" class and preventing mouse or touch interaction.
		
		##Example:
		
		    $("#myItem").disabled();
		
		*/
		disable : function ( ) {
			this.addClass("disabled");
			this.css("{cursor: default;}");
			this.prevent
		},
		
		/*
		##Function: Element.enable
		
		A method to facilitate re-enabling an element that was disabled by removing the "disabled" class and allow mouse and touch interaction.
		
		##Example:
		
		    $("#myItem").enable();
		
		*/
		enable : function ( ) {
			this.removeClass("disabled");
			this.css("{cursor: pointer;}");
		},
		
		/* 
		Function: Element.toggleClass
		
		Toggle a class on and off an element, or toggle between two classes. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).toggleClass(className);
		$(selector).toggleClass(className, className);
		
		Parameters:
		
		- firstClassName: The name of the first class to toggle.
		- secondClassName: The name of the second class to toggle.
		
		Example:
		
		(start code)
		$("#item").toggleClass("hover");
		$("#item").toggleClass("selected", "unselected");
		(end)
		*/
		toggleClass : function ( firstClassName, secondClassName ) {
		   if (!secondClassName) {
			   if (!this.hasClass(firstClassName)) {
				   this.addClass(firstClassName);
			   } else {
				   this.removeClass(firstClassName);
			   }
		   } else if (secondClassName) {
			   if (!this.hasClass(firstClassName)) {
				   this.addClass(firstClassName);
				   this.removeClass(secondClassName);
		   		} else {
			   		this.removeClass(firstClassName);
			   		this.addClass(secondClassName);
		   		}
			}
		},
		
		/* 
		Function: Element.getTop
		
		Get the precise top position of an element in relation to the top viewport.
		
		Syntax:
		
		$(selector).getTop();
		
		Example:
		
		(start code)
		$("#item").getTop();
		var button = $(".button");
		var buttonTop = button.getTop();
		(end)
		*/
		getTop : function() {
			var element = this;
			var pos = 0;
			while (element.offsetParent) {
				pos += element.offsetTop;
				element = element.offsetParent;
			}
			pos = pos + document.body.offsetTop;
			return pos;
		},
		
		/* 
		Function: Element.getLeft
		
		Get the precise left position of an element in relation to the left viewport.
		
		Syntax:
		
		$(selector).getLeft();
		
		Example:
		
		(start code)
		$("#item").getLeft();
		var button = $(".button");
		var buttonTop = button.getLeft();
		(end)
		*/
		getLeft : function(element) {
			var element = this;
			var pos = 0;
			while (element.offsetParent) {
				pos += element.offsetLeft;
				element = element.offsetParent;
			}
			pos = pos + document.body.offsetLeft;
			return pos;
		},
		
		/* 
		Function: Element.css
		
		Add a CSS declaration directly to an element. If a boolean value that equates to true is passed as a second, optional argument, the method will replace whatever inline CSS values are presently existing on the element, otherwise it appends the CSS declaration to whatever is already there. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).css(style declaration, property, value);
		
		Parameters:
		
		- style declaration:string A string of valid CSS property/values enclosed in curly braces and quotes.
		- property:string A string defining a CSS property.
		- value:string A string defining a CSS property value to set on an element.
		- A true value will cause any existing inline styles to be replace by the string of CSS styles. This is optional.
		
		Returns:
		
		CSS property value pairs as inline cssText or the computed value of a CSS property.
		
		Example:
		
		(start code)
		$("#item").css("font", "bold 12pt/14pt Arial, Helvetica, Sans-serif");
		console.log($("#item").css("font-size"));
		$("#item").css("{font-size: 24px; color: blue; background-color: red;}");
		(end)
		*/
		css : function ( property, value ) {
			if (/{/.test(property) && /}/.test(property) && !value) {
				this.style.cssText += property.substring(1, property.length - 1);
			}
			if (!value) {
				return document.defaultView.getComputedStyle(this, null).getPropertyValue(property.toLowerCase());
			} else {
				this.style.cssText += property + ":" + value + ";";
				return this;
			} 
		}
    });
    
    $.extend(String.prototype, {
    
		/* 
		Function: String.capitalize
		
		Method to capitalize the first letter of a string. This method is attached directly to the $ object.
		
		Syntax:
		
		$.capitalize(string);
		
		Parameters:
		
		- string:string A string to capitalize.
		
		Returns:
		
		A string with the first word capitalized, if a single word then its first letter is capitalized. 
		
		Example:
		
		(start code)
		var name = $.capitalize("robert"); // returns Robert
		(end)
		*/
		capitalize : function ( ) {
			var str = this;
			return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
		},
		
		/* 
		Function: String.capitalizeAll
		
		Method to capitalize the first letter of a words in a string. This method is attached directly to the $ object.
		
		Syntax:
		
		$.capitalizeAll(string);
		
		Parameters:
		
		- string: A string to capitalize.
		
		Returns:
		
		A string with all words capitalized. 
		
		Example:
		
		(start code)
		var name = $.capitalize("get out now"); // returns Get Out Now
		(end)
		*/
		capitalizeAll : function ( ) {
			str = this.split(" ");
			newstr = [];
			str.forEach(function(item) {
				newstr.push(item.capitalize());
			});
			return newstr.join(" ");
		}
    });
    
	$.extend(HTMLElement.prototype, {
		
		/* 
		Function: Element.bind
		
		A method to attach events to elements.
		
		Syntax:
		
		element.bind(event, function);
		
		Parameters:
		
		- event: Event A string representing valid event handler, such as "click".
		- function: Function A function, either named or anonymous. Note that a bound event that uses an anonymous function cannot be unbound. See last example below for how to avoid this.
		
		Example:
		
		(start code)
		var doSomething = function() {
		   console.log("I'm doing it now.");
		};
		$("#doIt").bind("click", doSomething);
		// or:
		$(".stop").bind("touchend", function() {
		   console.log("Time to put an end to this!");
		   this.remove();
		});
		(end)
		*/
		bind : function( event, callback ) {
			this.addEventListener(event, callback, false);
		},
		
		/* 
		Function: Element.unbind
		
		A method to remove events from elements.
		
		Syntax:
		
		element.unbind(event, callback);
		
		Parameters:
		
		- event: Event A string representing valid event handler, such as "click".
		- function: Function A named function executed by the event handler.
		
		Example:
		
		(start code)
		$("#doIt").unbind("click", doSomething);
		(end) 
		*/
		unbind : function( event, callback ) {
			this.removeEventListener( event, callback, false );
		},
	  
		/* 
		Function: Element.removeEvents
		
		Remove events from an element. This method uses an array of events owned by the global $ object to know which events to remove. This method is invoked before removing any nodes from a document to prevent memory leaks. This method is attached directly to the Element object.
		
		Syntax:
		
		$(selector).removeEvents();
		
		Example:
		
		(start code)
		$("#item").removeEvents();
		(end)
		*/
		removeEvents : function ( ) {
			var i = 0, len = $.events.length;
			while (i < len) {
				this[$.events[i]] = null;
				i++;
			}
		},
		
		/* 
		Function: Element.delegate
		
		A method to create event delegation. It uses the Element.ancestor method to check the ancestors of the event target to determine whether to execute the event or not.
		
		Syntax:
		
		Element.delegate(selector, event, callback);
		
		Parameters:
		
		- selector: A valid selector for the target element(s).
		- event: An event to be fired on the element.
		- function: A callback to be executed in relation to the target element.
		
		Example:
		
		(start code)
		$("body").delegate("p", "click", function(element) {
			element.css("background-color: yellow");
		});
		(end)
		
		To trap a tag with an attribute, you can use a conditional check inside your delegate assignment:
		
		(start code)
		$("app").delegate("button", "touch", function(item) {
			// Check for button with "ui-implements" attribute:
			if (item.getAttribute("ui-implements") === "back") {
				// Processing code goes here.
			}
		});
		(end)
		
		See Also:
		
		<Element.ancestor>
		<$.events>
		*/
		delegate : function ( selector, event, callback ) {
			this.addEventListener(event, function(e) {
				var target = e.target;
				$$(selector, this).forEach(function(element) {
					if (element.isSameNode(target)) {
						callback.apply(this, arguments);
					} else {
						try {
						   var ancestor = target.ancestor(selector);
						   if (element.isSameNode(ancestor)) {
						   		e.stopPropagation();
						   		callback.call(this, ancestor);
						    }
						} catch(e) {}
					}
				});
			}, false);
		},
		
		/* 
		Function: Element.trigger
		
		A method to fire events on elements.
		
		Syntax:
		
		element.trigger(event);
		
		Parameters:
		
		- event: An event to be fired on the element.
		
		Example:
		(start code)
		$("#importantButton").bind("click", function() {
			$("#link").trigger("click");
		});
		(end)
		*/
		trigger : function ( event ) {
			if( document.createEvent ) {
			  var evtObj = document.createEvent('Events');
			  evtObj.initEvent(event, true, false);
			  this.dispatchEvent(evtObj);
			}
		},
		
		/* 
		Function: Element.anim
		
		A method to implement CSS-based transition animations on elements.
		
		Syntax:
		
		element.anim(options, duration, easing);
		
		Parameters:
		
		- object literal: An object literal of key value pairs of CSS properties and values.
		- time: integer or float A valid integer or float representing time.
		- string: string A string defining an easing function for the animation.
		
		Example:
		
		(start code)
		$("#animate").bind("click", function() {
			this.anim({"-webkit-transform": "rotate3d(30, 150, 200, 180deg) scale(3) translate3d(-50%, -30%, 140%)", "opacity": .25, "-webkit-transform-style" : "preserve-3d", "-webkit-perspective": 500}, 2, "ease-in-out");
		});
		(end)
		*/
		anim : function ( options, duration, easing ) {
			var onEnd = null;
			var value = "-webkit-transition: all " + (duration + " " || ".5s ") + easing + ";" || "" + ";";
			for (prop in options) {
				if (prop === "onend") {
					onEnd = options[prop];
					this.bind("webkitTransitionEnd", function() {
						onEnd();
					});
				} else {
					value += prop + ":" + options[prop] + ";";
				}
			}
			this.css("{" + value + "}");
		}
	});
	$.extend($, {
		
		/* 
		Function: $.delay
		
		A method to delay the execution of a function.
		
		Syntax:
		
		$.delay(function, time);
		
		Parameters:
		
		- function: A function to execute.
		- time: integer or float A valid integer or float representing time in milliseconds for delay.
		
		Example:
		
		(start code)
		$.delay(function() {
			console.log("This message is delayed by two seconds.");
		}, 2000);
		(end)
		*/
		delay : function ( fnc, time ) {
			var argv = Array.prototype.slice.call(arguments, 2);
    		return setTimeout(function() { 
    			return fnc.apply(fnc, argv); 
    		}, time);
		},
		
		/* 
		Function: $.defer
		
		A method to postpone the execution of a function until the callstack is clear.
		
		Syntax:
		
		$.defer(function);
		
		Parameters:
		
		- function: A function to execute.
		
		Example:
		
		(start code)
		$.defer(function() { 
			console.log("This comes before Squawk!"); 
		});
		(end)
		*/
		defer : function ( fnc ) {
			return $.delay.apply($, [fnc, 1].concat(Array.prototype.slice.call(arguments, 1)));
		},
		
		/* 
		Function: $.enclose
		
		Method to capitalize the first letter of a words in a string. This method is attached directly to the $ object.
		
		Syntax:
		
		$.enclose(function, enclosure);
		
		Parameters:
		
		- function:function A function to enclose.
		- function:function A function with which to enclose.
		
		Returns:
		The result of the enclosed function with output for the enclosing function. 
		
		Example:
		
		(start code)
		var hello = function(name) { return "Hello, " + name + "!"; };
		hello = $.enclose(hello, function(func) {
			return "Before I said, \"" + func("Stan") + "\" I thought about it for a while.";
		});
		(end)
		*/
		enclose : function(func, enclosure) {
		  	return function() {
				var args = [func].concat(Array.prototype.slice.call(arguments));
				return enclosure.apply(enclosure, args);
		  	};
		},
		
		/* 
		Function: $.compose
		
		Method to return the composition of several functions, where each function consumes the return value of the function that follows. This method is attached directly to the $ object.
		
		Syntax:
		
		$.capitalize(string);
		
		Parameters:
		
		- function:function A function to pass as an argument.
		
		Returns:
		
		The result of the execution of each function passed as an argument. 
		
		Example:
		
		(start code)
		var greet = function(name) { return "Hi there, " + name; };
		var exclaim  = function(statement) { return statement + "!"; };
		var remark = function(remark) { return remark + " You know I'm glad to see you."; };
		var welcome = $.compose(remark, greet, exclaim);
		console.log(welcome('Jeff')); // => Hi there, Jeff! You know I'm glad to see you.
		(end)
		*/
		compose : function() {
		  	var funcs = Array.prototype.slice.call(arguments);
		  	return function() {
				var args = Array.prototype.slice.call(arguments);
				for (var i=funcs.length-1; i >= 0; i--) {
			  		args = [funcs[i].apply(this, args)];
				}
				return args[0];
		  	};
		},
		
		/* 
		Array: $.events
		
		An array of events to be removed before a node is deleted from a document. This array is attached directly to the $ object.
		
		See Also:
		
		<Element.removeEvents>
		
		*/
		events : ['onmousedown', 'onmouseup', 'onmouseover', 'onmouseout', 'onclick', 'onmousemove', 'ondblclick', 'onerror', 'onresize', 'onscroll', 'onkeydown', 'onkeyup', 'onkeypress', 'onchange', 'onsubmit', 'onload', 'ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel', 'ongesturestart', 'ongesturechange', 'ongestureend', 'onorientationchange'],
		
		/* 
		Function: $.loadEvent
		
		A method to chain load multiple functions to execute when the document finishes loading.
		
		Syntax:
		
		$.loadEvent();
		
		Parameters:
		
		- function:function A valid function to run when the document finishes loading.
		
		Example:
		(start code)
		var myFunction = function () {
			return true;
		};
		$.loadEvent(myFunction());
		(end)
		*/
		loadEvent : function ( F ) {
			var oldonload = window.onload;
			if (typeof window.onload !== 'function') {
			   window.onload = F;
			} else {
			   window.onload = function () {
				  oldonload();
				  F();
			   };
			}
		},
		
		/* 
		Array: $.DOMReadyList
		
		An array of functions to execute when the document's DOM is ready for access. This is used by $.executeWhenDOMReady.
		
		See Also:
		
		<$.executeWhenDOMReady>
		<$.ready>
		
		*/
		DOMReadyList : [],
		
		/* 
		Function: $.executeWhenDOMReady
		
		A method to executing methods stored in $.DOMReadyList. This method is called by the $.ready method for executing chained blocks of code when the document fires the DOMContentLoaded event signaling that the document's DOM is ready for access. There is never a need for the user to execute this method as it is an auxilliary method for the $.ready() function.
		
		Syntax:
		
		$.executeWhenDOMReady();
		
		See Also:
		
		<$.DOMReadyList>
		<$.ready>
		*/
		executeWhenDOMReady : function ( ) {
			var listLen = $.DOMReadyList.length;
			var i = 0;
			while (i < listLen) {
				$.DOMReadyList[i]();
				i++;
			}
			$.DOMReadyList = null;
			document.removeEventListener('DOMContentLoaded', $.executeWhenDOMReady, false);
		},
		
		/* 
		Function: $.ready
		
		Method to determine when the DOM is ready for manipulation and thereupon fire a block of code contained in an anonymous function passed to it as an argument. This method is attached directly to the $ object. If there are mulitple instances of this method, it's arguments will be chained and called sequentially with one registration of the DOMContentLoaded event.
		
		Syntax:
		
		$.ready(function);
		
		Parameters:
		
		- function:function An anonymous function or block of code to execute.
		
		Example:
		
		(start code)
		$.ready(function() { 
			console.log("The document is ready for action!"); 
		});
		(end)
		
		See Also:
		
		<$.DOMReadyList>
		<$.executeWhenDOMReady>
		*/
		ready : function ( callback ) {
			if ($.DOMReadyList.length == 0) {
				document.addEventListener('DOMContentLoaded', $.executeWhenDOMReady, false);
			}
	
			$.DOMReadyList.push(callback);
		},
		
		/* 
		Function: $.UIHideURLbar
		
		A method to hide the browser's address bar. This is used at page load time and when the user navigates to different views.
		
		Syntax:
		
		$.hideURLbar();
		
		Example:
		
		(start code)
		$.hideURLbar();
		(end)
		*/
		UIHideURLbar : function() {
			window.scrollTo(0, 1);
		},
		
		/* 
		Function: $.importScript
		
		A method to import external scripts into the document. This method is attached directly to the $ object.
		
		Syntax:
		
		$.importScript(URI);
		
		Parameters:
		
		- URI: A valid URI of the script to import into the document.
		
		Example:
		
		(start code)
		$.importScript("https://bozo.com/scripts/myScript.js");
		(end)
		*/
		importScript : function ( url ) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", url);
			$("head").appendChild(script);
		},
    
		/* 
		Variables: iphone, ipad, ipod, android, webos, blackberry, touchEndabled, online, standalone
		Properties to determine device platform, network connection and standalone status.
		
		Syntax: 
		
		$.standalone // returns true or false
		
		(start code)
		Example:
		if (!$.standalone) {
			alert("Please install this app before using.");
		}
		(end)
		*/
    	iphone : /iphone/i.test(navigator.userAgent),
    	ipad : /ipad/i.test(navigator.userAgent),
    	ipod : /ipod/i.test(navigator.userAgent),
    	android : /android/i.test(navigator.userAgent),
    	webos : /webos/i.test(navigator.userAgent),
    	blackberry : /blackberry/i.test(navigator.userAgent),
    	touchEnabled : ($.iphone || $.ipod || $.ipad || $.android),
    	online :  navigator.onLine,
    	standalone : navigator.standalone
    });
    
	$.extend(HTMLElement.prototype, {
		/* 
		Function: Element.xhr
		
		A method to insert content into a node using The XMLHttpRequest object. This method is attached directly to the Element object.
		
		Syntax:
		
		Element.xhr(URI);
		
		Parameters:
		
		- URI: A valid URI to import into the document and fill an element.
		- Callback: A function to execute when the HTTPRequest is successful.
		
		Example:
		
		(start code)
		$('#content').xhr('/data/customers.html');
		(end)
		*/
		xhr : function ( url, options ) {
			var o = options ? options : {};
			if (!!options) {
				if (!!options.successCallback) {
					o.callback = options.successCallback;
				}
			}
			var that   = this,
				request    = new XMLHttpRequest(),
				method = o.method || 'get',
				async  = o.async || false,           
				params = o.data || null,
				i = 0;
			request.queryString = params;
			request.open(method, url, async);
	 
			if (o.headers) {
				for (; i<o.headers.length; i++) {
				  request.setRequestHeader(o.headers[i].name, o.headers[i].value);
				}
			}
			request.handleResp = (o.callback != null) ? o.callback : function() { 
				that.insert(this.responseText); 
			}; 
			function hdl(){ 
				if(request.status===0 || request.status==200 && request.readyState==4) { 	
					$.responseText = request.responseText;
					request.handleResp(); 
				} else {
					options.errorCallback();
				}
			}
			if(async) req.onreadystatechange = hdl;
			request.send(params);
			if(!async) hdl();
			return this;
		},
		
		/* 
		Function: Element.xhrjson
		
		A method to insert content into a node using The XMLHttpRequest object. This method is attached directly to the Element object.
		
		Syntax:
		
		Element.xhrjson(URI);
		
		Parameters:
		
		- URI: A valid URI to import into the document and fill an element.
		- options: An object literal mapping elements to json data.
		
		Example:
		
		(start code)
		$('#content').xhrjson('/data/customers.js');
		(end)
		*/
		xhrjson : function ( url, options ) {
			if (options === "undefined") {
				return this;
			}
			var c = options.callback;
			if (typeof c != 'function') {
				c = function (x) {
					return x;
				};
			}
			var callback = function () {
				var o = eval('(' + this.responseText + ')');
				for (var prop in o) {
					$(options[prop]).fill(c(o[prop]));
				}
			};
			options.successCallback = callback;
			this.xhr(url, options);
			return this;
		},
		
		/* 
		Function: Element.data
		
		A method to get and set a dataset value on an element.
		
		Syntax:
		
		 element.data(key);
		 element.data(key, value);
		
		Parameters:
		
		- key: A string defining the dataset key to access.
		- value: A string defining the value to set the dataset key to.
		
		Example:
		
		(start code)
		var customer = $('#customer').data('customer-name'); 
		$$(".customers").forEach(function(customer) {
			console.log(customer.data("customer-name"));
		}
		$("#shirt).data("shirt-size", "XXL"); // outputs data-shirt-size="XXL" on #shirt
		(end)
		*/
		data : function ( key, value ) {
			if (!!document.documentElement.dataset) {
				if (!value) {
					return this.dataset[key];
				} else {
					this.dataset[key] = value;
				}
			// Fallback for earlier versions of Webkit:
			} else {
				if (!value) {
					return this.getAttribute("data-" + key);
				} else {
					this.setAttribute("data-" + key, value);
				}
			}
		},
		
		/* 
		Function: Element.removeData
		
		A method to remove a dataset from an element.
		
		Syntax:
		
		Element.removeData(key);
		
		Parameters:
		
		- key: A string defining the dataset key to remove.
		
		Example:
		
		(start code) 
		$("#shirt).removeData("shirt-size"); // removes data-shirt-size from #shirt
		(end)
		*/
		removeData : function ( key ) {
			if (!!document.documentElement.dataset) {
				this.dataset[key] = null;
			// Fallback for earlier versions of Webkit:
			} else {
				this.removeAttribute("data-" + key);
			}
		}
    });

	$.extend($, {	
		/*
		Function: $.setLocalStorage
		
		Set a key/value pair to the browser's localstorage.
		
		Syntax: 
		
		$.setLocalStorage(key, value)
		
		Parameters:
		
		- key: A key to add to the browser's localStorage.
		- value: A value to set to the key of the browser's localStorage.
		
		Example:
		
		(start code)
		$.setLocalStorage("clientFirstName", "Robert");
		(end)
		*/
		setLocalStorage : function ( key, value ) {
			try {
				localStorage.setItem(key, value);
			} catch(e) {}
		},

		/*
		Function: $.getLocalStorage
		
		Get the value of a key in the browser's localstorage.
		
		Syntax: 
		
		$.getLocalStorage(key)
		
		Parameters:
		
		- key: The key to retrieve from the browser's localStorage.
		
		Example:
		
		(start code)
		var clientFirstName = $.getLocalStorage("clientFirstName");
		(end)
		*/		
		getLocalStorage : function ( key ) {
			try {
				localStorage.getItem(key);
			} catch(e) {}
		},
		
		/*
		Function: $.deleteLocalStorage
		
		Set a key/value pair to the browser's localstorage.
		
		Syntax: 
		
		$.deleteLocalStorage(key)
		
		Parameters:
		
		- key: The key to remove from the browser's localStorage.
		
		Example:
		
		(start code)
		$.deleteLocalStorage("clientFirstName");
		(end)
		*/		
		deleteLocalStorage : function ( key ) {
			try {
				localStorage.removeItem(key);
			} catch(e) {}
		},
		
		/* 
		// JavaScript Micro Template
		// John Resig - http://ejohn.org/ - MIT Licensed
		
		Variable: $.jsmtCached
		
		A cache for templates to be used later. 
		
		See Also:
		
		<$.template>
		*/
		jsmtCache : {},
		
		/* 
		Function: $.template
		
		A method to parse a JavaScript Micro Template and populate it with JSON data.
		
		Syntax:
		
		$.template(str, data);
		
		Parameters:
		
		- string: A string defining the template to use.
		- data: JSON data to be mapped to elements in the template.
		
		Example:
		
		(start code)
		var result = $.template("tpl_1", data);
		$.ready(function() {
			$("#tpl_1_output").insert(result);
		});
		(end)
		 
		See Also:
		
		<$.jsmtCached>
		*/
        template : function tmpl(str, data) {
        	var err = "";
        	try {
				var fn = !/\W/.test(str) ?
				$.jsmtCache[str] = $.jsmtCache[str] ||
				$.template(document.getElementById(str).innerHTML) : 
				new Function("obj", "var p = [];" +
				"with (obj) { p.push('" +
				str.replace(/[\r\t\n]/g, " ")
				.replace(/'(?=[^#]*#>)/g, "\t")
				.split("'").join("\\'")
				.split("\t").join("'")
				.replace(/<%=(.+?)%>/g, "',$1,'")
				.split("<%").join("');")
				.split("%>").join("p.push('")
				+ "');}return p.join('');");
				return data ? fn(data) : fn;
			} catch (e) {
				err = e.message;
			}
		}
	});
    
	/*
	Make the ChocolateChip $() and $.$$() methods available globally.
	If there is already a $() variable in the global space, ChocolateChip
	aliases them as __$(). To make it easier to use the $.$$() method, we 
	alias it as $$().
	*/
    if (window.$ === undefined) {
    	window.$ = $;
    	window.$$ = $.$$;
    } else {
    	window.__$ = $;
    	window.__$$ = $.$$;
    }
})(); 
$.ready(function() {

	$.body = $("body");
	$.app = $("app");
	
	$.extend($, {
		UIUpdateOrientationChange : function ( ) {
			document.addEventListener("orientationchange", function() {
				if (window.orientation === 0 || window.orientation === 180) {
					$.body.removeClass("landscape");
					$.body.addClass("portrait");
					$.UIHideURLbar();
				} else {
					$.body.removeClass("portrait")
					$.body.addClass("landscape");
					$.UIHideURLbar();
				}
				$.UIHideURLbar();
			}, false);		
		},
		UIListenForWindowResize : function ( ) {
			window.addEventListener("resize", function() {
				if (window.innerHeight > window.innerWidth) {
					$.body.removeClass("landscape");
					$.body.addClass("portrait");
					$.UIHideURLbar();
				} else {
					$.body.removeClass("portrait");
					$.body.addClass("landscape");
					$.UIHideURLbar();
				}
			}, false);
		}
	});
	$.UIUpdateOrientationChange();
	$.UIListenForWindowResize();
});

/*
Function: Function.bind

Add bind capability to the Function object for versions of Webkit that don't support it.

Syntax: 

Function.bind(function, object);

Example:

(start code)
var greeter = {
	name: "greeter object",
	speaks: function() {
	contructGreeting = function(greeting) {
		console.log(greeting + " " + this.name);
	}.bind(this) // Bound to "greeter"
	contructGreeting("hello");
	}
};
greeter.speaks("hello");
(end)
*/
if (!Function.prototype.bind) {
  	Function.prototype.bind = function(func, obj) {
    	var args = Array.prototype.slice.call(arguments, 2);
    	return function() {
      	return func.apply(obj || {}, args.concat(Array.prototype.slice.call(arguments)));
    	};
  	};
}

/*
##Contants: Values indicating support for touch or mouse interaction.

- UISupportsTouch \(true or false\)
- UIStartEvent \(touchstart or mousedown\)
- UIMoveEvent \(touchmove or mousemove\)
- UIEndEvent \(touchend or mouseup\)

*/
const UISupportsTouch = ("createTouch" in document);
const UIStartEvent = UISupportsTouch ? "touchstart" : "mousedown";
const UIMoveEvent = UISupportsTouch ? "touchmove" : "mousemove";
const UIEndEvent = UISupportsTouch ? "touchend" : "mouseup";

/* 
##Function: Element.UICheckForOverflow

Determines whether an element has content overflowing its bounds or not.

##Example:

    $("tableview:first-of-type").UICheckForOverflow();
*/
$.extend(HTMLElement.prototype, {
	UICheckForOverflow : function (){
   		var origOverflow = this.css("overflow");
   		if ( !origOverflow || origOverflow === "visible" ) {
      		this.style.overflow = "hidden";
      	}
		var overflow = this.clientWidth < this.scrollWidth || 
		   this.clientHeight < this.scrollHeight;
		this.css("overflow", origOverflow);

   		return overflow;
	}
});

