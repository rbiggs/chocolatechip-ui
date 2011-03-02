#ChocolateChip.js
    
	   pO\     
	  6  /\
		/OO\
	   /OOOO\
	 /OOOOOOOO\
	((OOOOOOOO))
	 \:~=++=~:/ 
    
    ChocolateChip.js: It's tiny but delicious
    A JavaScript library for mobile Web app development.
    
    Copyright 2011 Robert Biggs: www.choclatechip-ui.com
    License: BSD
    Version 1.1.2



&nbsp;

##Function: $

This method uses JavaScript's document.querySelector() method to get the designated node. It will always return the first match. To get more a collection of nodes, use the [$$](#$$) method. A selector is required as the main argument. A second optional argument may be passed as a context for the selector. This is useful where you want to limit where ChococlateChip searches for a node, such as only as a descendant of a particular document node, avoiding possible matches outside that node.

**Syntax:**

    $(selector);
    $(selector, context);

**Parameters:**

- selector: A string defining a valid CSS selector.
- context: A string defining a valid CSS selector or an actual node.

**Returns:** 

A valid document node.

**Example:**

    var item = $("#item");
    var menuItems = $(".menu > li"); // Will return the first list item only.
    $("section > p:first-of-type").css("color: red; background-color: yellow; padding: 10px;");
    var list = $("ul", mainList);




&nbsp;

##Function: $.extend

A method to extend the ChocolateChip's $ method. This uses EC5's Object.defineProperty to extend objects without polluting the object's prototype. For older browsers that don't support this feature of ECMAScript5, ChocolateChip uses a simpler method of object prototype chaining for compatibility.

**Syntax:**

    $.extend(object, {
        // object literal here.
    });

**Parameters:**

- The object to extend. In most cases this will be $ or HTMLElement.prototype.
- An object literal of properties to add to the object. These can be variables, array or methods.

**Example:**

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




&nbsp;

##Variable: $.version

Version: 1.1.2

**Example:**

    console.log("The version is: " + $.version);



<a name="collectionToArray"></a>


&nbsp;

##Function: $.collectionToArray

This is a function to convert an DOM node collection into an array. This is so you can use array extras like, forEach, map, slice, etc.

**Syntax:**

    $.collectionToArray(NodeList);

**Parameters:**

- The node collection to convert into an array.

**Returns**

An array of nodes in an HTMLElement collection. 

**Example:**

    var p = document.getElementsByTagName("p");
    var pArray = $.collectionToArray(p);
    
    var elem = $("#myList");
    var listitems = $.collectionToArray(elem.children);
        listitems.forEach(function(item) {
        // Process code here.
    }

**See Also:**

[$.$$](#$$)



<a name="$$"></a> 


&nbsp;

##Function: $.$$ 

This method uses document.querySelectorAll to return a DOM collection as an array. It employs the method $.collectionToArray to convert the collection of nodes into an array. This will later be passed out as a global object. It also uses the $.collectionToArray method to convert and HTMLCollection into an array. $.$$() gets aliased as window.$$() so that you can uses it as just $$() instead of $.$$(). A second optional argument may be passed as a context for the selector. This is useful where you want to limit where ChococlateChip searches for nodes, such as only as a descendant of a particular document node, avoiding possible matches outside that node.

**Syntax:**

    $$(selector);
    $$(selector, context);
	
**Parameters:**

- A string defining a valid CSS selector.
- Context: A string defining a valid CSS selector or an actual node.

**Returns:**

An array of nodes comprising an element collection.

**Example:**

    var sections = $$("section");
    $$("section > p").forEach(function(p) {
        p.css("color: red; background-color: yellow; padding: 10px;");
    });

**See Also:**
 
[$.collectionToArray #collectionToArray]


&nbsp;

##Variable: $.body

This variable holds a reference to the body tag. This is a shortcut for accessing the body tag so you don't have to waste processing time getting the body tag with *$.("body")*. See below.

**Example:**

    $.body.toggleClass("portrait", "landscape");
    console.log($.body.className);


&nbsp;

##Variable: $.app

This variable holds a reference to the app tag. It is a shortcut for accessing the app tag so you don't have to waste processing time getting the body tag with *$.("app")*. See below:

**Example:**

    $.app.delegate("uibutton", "touchstart", executeMyFavFunc);


&nbsp;

##Function: Element.previous

This method returns the previous sibling of the element upon which it executes. This method is attached directly to the Element object.

**Syntax:**

    Element.previous();

**Returns:**

The previous sibling node. 

**Example:**

    var previousItem = $("#item").previous();

 


&nbsp;

##Function: Element.next

This method returns the next sibling of the element upon which it executes. This method is attached directly to the Element object.

**Syntax:**

    Element.next();

**Returns:**

The next sibling node. 

**Example:**

    var nextItem = $("#item").next();


 

&nbsp;

##Function: Element.first

A method to get the first child of an element while avoiding empty text nodes. This method is attached directly to the Element object.

**Syntax:**

    Element.first();

**Example:**

(start code)
$("#menu").first();
(end)


 

&nbsp;

##Function: Element.last

A method to get the last child of an element, while avoiding empty text nodes. This method is attached directly to the Element object.

**Syntax:**

    Element.last();

**Example:**

    $("#menu").last();


<a name="elementAncestor"></a>


&nbsp;

##Function: Element.ancestor

A method to retrieve an ancestor of a node. It can find an ancestor by numeric postion, tag, class or id. Besides class and id, no other attributes can be parsed and will throw an exception.

**Parameters:**

- value: Either a number, a class, an id or a tag.

**Syntax:** 

    Element.ancestor(selector)

**Returns:**

A matched ancestor node. 

**Example:**

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


 

&nbsp;

##Function: Element.ancestorByTag

This is an alias to Element.ancestor included for backwards compatibility with earlier versions of ChocolateChip (1.1.0 or less).

**Syntax:**

    Element.ancestorByTag(selector);

**Returns:**

A matched ancestor node. 

**Example:**

(start code)
var ancestor = $("#item").ancestorByTag("article");
(end)

See Also:

[Element.ancestor](#elementAncestor)



<a name="elementAncestor"</a>
	

&nbsp;

##Function: Element.ancestorByClass

This is an alias to Element.ancestor included for backwards compatibility with earlier versions of ChocolateChip (1.1.0 or less).

**Syntax:**

    Element.ancestorByClass(selector);

**Returns:**

A matched ancestor node. 

**Example:**

    var ancestor = $("#item").ancestorByClass("generic class");

**See Also:**

[Element.ancestor](#elementAncestor)


 

&nbsp;

##Function: Element.ancestorByPosition

This is an alias to Element.ancestor included for backwards compatibility with earlier versions of ChocolateChip (1.1.0 or less).

**Parameters:** 

An integer indicating the position of the ancestor to find.

**Syntax:**

    Element.ancestorByPosition(position);

**Returns:**

A matched ancestor node. 

**Example:**

    // Returns the third ancestor
    var ancestor = $("#item").ancestorPosition(3);

**See Also:**

[Element.ancestor](#elementAncestor)
	
			
			 

&nbsp;

##Function: $.make

This method creates nodes from a string of valid HTML passed as an argument. The result is an array of one or more nodes. By iterating this array you can insert them into a document. This method is attached directly to the $ object.

**Parameters:**

- A string defining nodes to create.
- An array of valid nodes existing in memory.

**Syntax:**

    $.make(string);

**Returns:**

A collection of new nodes. 

**Example:**

    var paragraph = $.make("<p>This is a paragraph</p>");


 

&nbsp;

##Function: $.replace

A method to clone a node. If a boolean value that evaluates to true is passed as an argument, the method will clone the node and all its child nodes, otherwise it clones only the node itself. This method is attached directly to the Element object.

**Syntax:**

    $.replace(newNode, oldNode);

**Parameters:**

- newNode: A a node to with which to replace.
- oldNode: The node to be replaced.

**Example:**

    var newNode = $.make("<div>A new div</div>");
    $.replace(newNode, $("#menu"));
	
				
					 

&nbsp;

##Function: Element.empty

Remove all child nodes of an element. This method invokes the removeEvents method first to remove any attached events and thereby prevent memory leaks. This method is attached directly to the Element object.

**Syntax:**

    Element.empty();

**Example:**

    $("#item").empty();


 

&nbsp;

##Function: Element.clone

A method to clone a node. If a boolean value that evaluates to true is passed as an argument, the method will clone the node and all its child nodes, otherwise it clones only the node itself. This method is attached directly to the Element object.

**Syntax:**

    Element.clone();

**Parameters:**

- Any boolean value.

**Returns:** 

The clone of an element. 

**Example:**

    var menu = $("#menu").clone(true);


 

&nbsp;

##Function: Element.wrap

A method to wrap a node in markup. This method is attached directly to the Element object.

**Syntax:**

    Element.wrap(string);

**Parameters:**

- string: A string of valid HTML markup in which to encase the element.

**Example:**

    $("#menu").wrap("<nav id='main'></nav>");

							
							 

&nbsp;

##Function: Element.unwrap

A method to unwrap a node by removing its parent node. It has a failsafe to stop removing nodes when it reaches the body tag.

**Syntax:**

    Element.unwrap();

**Example:**

    $("#menu").unwrap();


 

&nbsp;

##Function: Element.text

This method adds text to the target element, replacing whatever child nodes it might have. If no value is passed as an argument, the method returns the text value of all child nodes of the target element. This method is attached directly to the Element object.

**Syntax:**

    $(selector).text(string);
    $(selector).text(variable);
    $(selector).text();

**Parameters:**

- string: A string of text to add to an element.
- variable: A string of text to add to an element.

**Returns:**

The text nodes of the element. 

**Example:**

    $("#item").text("This is an example of added text.");
    var textValue = $("#item").text();


 

&nbsp;

##Function: Element.fill

Replace element's childNodes with content. This method is attached directly to the Element object.

**Syntax:**

    Element.fill(content);

**Example:**

    $("#item").fill("Something to say here.");


 

&nbsp;

##Function: Element.empty

Remove all child nodes of an element. This method invokes the removeEvents method first to remove any attached events and thereby prevent memory leaks. This method is attached directly to the Element object.

**Syntax:**

    Element.empty();

**Example:**

    $("#item").empty();


 

&nbsp;

##Function: Element.remove

Remove an element from the document. This method is attached directly to the Element object.

**Syntax:**

    Element.remove();

**Example:**

    $("#item").remove();


 

&nbsp;

##Function: Element.insert

A method to insert a node or nodes at nth position in the child node collection of the element on which the method is being called. This can be the first position, the last position, or anywhere in between these. If no position is passed as an argument it defaults to last position. If the parent element has no child nodes, the method inserts the new element as the first child of the parent element. This method is attached directly to the Element object.

**Syntax:**

    $.insert( content, position );

**Parameters:**

- A valid node to insert into the child node collection of another node.
- A string with a value for first or last position for insertion.
- An integer indicating the position in the target element's child node collection at which to insert.

**Example:**

    $.itemNumber = 1;
    $$("p").forEach(function(item) { 
        item.insert( $.make("<span>Introductory Matter: " + $.itemNumber + " .</span>"), "first");
        ++$.itemNumber;
    });
    $.itemNumber = null;


 

&nbsp;

##Function: Element.before

A method to insert content before the node upon which it operates. This method is attached directly to the Element object.

**Syntax:**

    Element.before(node);

**Parameters:**

- node: A valid node to insert before another node.

**Example:**

    $.itemNumber = 1;
    $$("p").forEach(function(item) { 
        item.before( $.make("<h1>Title " + $.itemNumber + "</h1>"));
        ++$.itemNumber;
    });
    $.itemNumber = null;


 

&nbsp;

##Function: Element.after

A method to insert content consisting of a node or nodes before the node upon which it operates. This method is attached directly to the Element object.

**Syntax:**

    Element.after(node);

**Parameters:**

- node: A valid node to insert before another node.

**Example:**

    $.itemNumber = 1;
    $$("p").forEach(function(item) { 
        item.after( $.make("<p>Addendum " + $.itemNumber + "</p>"));
        ++$.itemNumber;
    });
    $.itemNumber = null;


 

&nbsp;

##Function: Element.hasClass

Check an element to see if it has a particular class. This method is attached directly to the Element object.

**Syntax:**

    Element.hasClass(className);

**Parameters:**

- className: The name of the CSS class to check for.

**Example:**

    Element.hasClass("hover");


 

&nbsp;

##Function: Element.addClass

Add a class to an element. This method is attached directly to the Element object.

**Syntax:**

    Element.addClass(className);

**Parameters:**

- className: The name of the CSS class to add.

**Example:**

    $("#item").addClass("hover");


 

&nbsp;

##Function: Element.removeClass

Remove a class from an element. This method is attached directly to the Element object.

**Syntax:**

     Element.removeClass(className);

**Parameters:**

- className: The name of the CSS class to remove.

**Example:**

    $("#item").removeClass("hover");

									
									

&nbsp;

##Function: Element.disable

A method to disable an element by adding the "disable" class and preventing mouse or touch interaction.

**Example:**

    $("#myItem").disabled();




&nbsp;

##Function: Element.enable

A method to facilitate re-enabling an element that was disabled by removing the "disabled" class and allow mouse and touch interaction.

**Example:**

    $("#myItem").enable();


 

&nbsp;

##Function: Element.toggleClass

Toggle a class on and off an element, or toggle between two classes. This method is attached directly to the Element object.

**Syntax:**

    Element.toggleClass(className);
    Element.toggleClass(className, className);

**Parameters:**

- firstClassName: The name of the first class to toggle.
- secondClassName: The name of the second class to toggle.

**Example:**

    $("#item").toggleClass("hover");
    $("#item").toggleClass("selected", "unselected");


 

&nbsp;

##Function: Element.getTop

Get the precise top position of an element in relation to the top viewport.

**Syntax:**

    $(selector).getTop();

**Example:**

    $("#item").getTop();
    var button = $(".button");
    var buttonTop = button.getTop();

 

&nbsp;

##Function: Element.getLeft

Get the precise left position of an element in relation to the left viewport.

**Syntax:**

    $(selector).getLeft();

**Example:**

    $("#item").getLeft();
    var button = $(".button");
    var buttonTop = button.getLeft();


 

&nbsp;

##Function: Element.css

Add a CSS declaration directly to an element. If a boolean value that equates to true is passed as a second, optional argument, the method will replace whatever inline CSS values are presently existing on the element, otherwise it appends the CSS declaration to whatever is already there. This method is attached directly to the Element object.

**Syntax:**

    Element.css(style declaration, property, value);

**Parameters:**

- style declaration:string A string of valid CSS property/values enclosed in curly braces and quotes.
- property:string A string defining a CSS property.
- value:string A string defining a CSS property value to set on an element.
- A true value will cause any existing inline styles to be replace by the string of CSS styles. This is optional.

**Returns:**

CSS property value pairs as inline cssText or the computed value of a CSS property.

**Example:**

    $("#item").css("font", "bold 12pt/14pt Arial, Helvetica, Sans-serif");
    console.log($("#item").css("font-size"));
    $("#item").css("{font-size: 24px; color: blue; background-color: red;}");

You can use Element.css to get the value of a CSS property by passing the quoted property as an argument. You simply pass in the normal CSS property. If it is a hyphenated property, pass it in like that. 

**Example:**
	
    var bkcolor = $("#item").css("background-color");
    console.log("This item's background color is: " + bkcolor);
    
**Note:** Be aware that all values returned in this way are strings, even if they appear to be numerical values, such as height, margin, etc. So, if you need to do arithmetic with a returned value, you'll need to convert it from a string to a number. You can do this using parseInt:

    var itemWidth = $("#item).css("width");
    itemWidth = parseInt(itemWidth);
    var leftPos = $.getLeft("#item");
    var distance = itemWidth + leftPos;
    console.log("The item has a total distance of: " + distance);


&nbsp;

##Function: String.capitalize

Method to capitalize the first letter of a string. This method is attached directly to the $ object.

**Syntax:**

    $.capitalize(string);

**Parameters:**

- string: A string to capitalize.

**Returns:**

A string with the first word capitalized, if a single word then its first letter is capitalized. 

**Example:**

    var name = $.capitalize("robert"); // returns Robert


 

&nbsp;

##Function: String.capitalizeAll

Method to capitalize the first letter of a words in a string. This method is attached directly to the $ object.

**Syntax:**

    $.capitalizeAll(string);

**Parameters:**

- string: A string to capitalize.

**Returns:**

A string with all words capitalized. 

**Example:**

    var name = $.capitalize("get out now"); // returns Get Out Now


 

&nbsp;

##Function: Element.bind

A method to attach events to elements.

**Syntax:**

    Element.bind(event, function);

**Parameters:**

- event: A string representing valid event handler, such as "click".
- function: A function, either named or anonymous. Note that a bound event that uses an anonymous function cannot be unbound. See last example below for how to avoid this.

**Example:**

    var doSomething = function() {
        console.log("I'm doing it now.");
    };
    $("#doIt").bind("click", doSomething);
    // or:
    $(".stop").bind("touchend", function() {
    console.log("Time to put an end to this!");
        this.remove();
    });


 

&nbsp;

##Function: Element.unbind

A method to remove events from elements.

**Syntax:**

    Element.unbind(event, callback);

**Parameters:**

- event: Event A string representing valid event handler, such as "click".
- function: Function A named function executed by the event handler.

**Example:**

    $("#doIt").unbind("click", doSomething);


<a name="elementRemoveEvents"></a>


&nbsp;

##Function: Element.removeEvents

Remove events from an element. This method uses an array of events owned by the global $ object to know which events to remove. This method is invoked before removing any nodes from a document to prevent memory leaks. This method is attached directly to the Element object.

**Syntax:**

    Element.removeEvents();

**Example:**

    $("#item").removeEvents();


 

&nbsp;

##Function: Element.delegate

A method to create event delegation. It uses the Element.ancestor method to check the ancestors of the event target to determine whether to execute the event or not.

**Syntax:**

    Element.delegate(selector, event, callback);

**Parameters:**

- selector: A valid selector for the target element(s).
- event: An event to be fired on the element.
- function: A callback to be executed in relation to the target element.

**Example:**

    $("body").delegate("p", "click", function(element) {
        Element.css("background-color: yellow");
    });


To trap a tag with an attribute, you can use a conditional check inside your delegate assignment:

    $("app").delegate("button", "touch", function(item) {
        // Check for button with "ui-implements" attribute:
        if (item.getAttribute("ui-implements") === "back") {
            // Processing code goes here.
        }
    });

**See Also:**

[Element.ancestor](#elementAncestor)

[$.events](#$events)


 

&nbsp;

##Function: Element.trigger

A method to fire events on elements.

**Syntax:**

    Element.trigger(event);

**Parameters:**

- event: An event to be fired on the element.

**Example:**

    $("#importantButton").bind("click", function() {
        $("#link").trigger("click");
    });


 

&nbsp;

##Function: Element.anim

A method to implement CSS-based transition animations on elements.

**Syntax:**

    Element.anim(options, duration, easing);

**Parameters:**

- object literal: An object literal of key value pairs of CSS properties and values.
- time: integer or float A valid integer or float representing time.
- string: string A string defining an easing function for the animation.

**Example:**

    $("#animate").bind("click", function() {
        this.anim({"-webkit-transform": "rotate3d(30, 150, 200, 180deg) 
           scale(3) translate3d(-50%, -30%, 140%)", "opacity": .25, 
           "-webkit-transform-style" : "preserve-3d", "-webkit-perspective": 500}, 
           2, "ease-in-out");
    });


 

&nbsp;

##Function: $.delay

A method to delay the execution of a function.

**Syntax:**

    $.delay(function, time);

**Parameters:**

- function: A function to execute.
- time: integer or float A valid integer or float representing time in milliseconds for delay.

**Example:**

    $.delay(function() {
        console.log("This message is delayed by two seconds.");
    }, 2000);


 

&nbsp;

##Function: $.defer

A method to postpone the execution of a function until the callstack is clear.

**Syntax:**

    $.defer(function);

**Parameters:**

- function: A function to execute.

**Example:**

    $.defer(function() { 
        console.log("This comes before Squawk!"); 
    });


 

&nbsp;

##Function: $.enclose

Method to capitalize the first letter of a words in a string. This method is attached directly to the $ object.

**Syntax:**

    $.enclose(function, enclosure);

**Parameters:**

- function:function A function to enclose.
- function:function A function with which to enclose.

**Returns:**

The result of the enclosed function with output for the enclosing function. 

**Example:**

    var hello = function(name) { return "Hello, " + name + "!"; };
    hello = $.enclose(hello, function(func) {
        return "Before I said, \"" + func("Stan") + "\" I thought about it for a while.";
    });


 

&nbsp;

##Function: $.compose

Method to return the composition of several functions, where each function consumes the return value of the function that follows. This method is attached directly to the $ object.

**Syntax:**

    $.capitalize(string);

**Parameters:**

- function:function A function to pass as an argument.

**Returns:**

The result of the execution of each function passed as an argument. 

**Example:**

    var greet = function(name) { return "Hi there, " + name; };
    var exclaim  = function(statement) { return statement + "!"; };
    var remark = function(remark) { return remark + " You know I'm glad to see you."; };
    var welcome = $.compose(remark, greet, exclaim);
    console.log(welcome('Jeff')); // => Hi there, Jeff! You know I'm glad to see you.



<a name="$events"></a>


&nbsp;

##Array: $.events

An array of events to be removed before a node is deleted from a document. This array is attached directly to the $ object.

**See Also:**

[Element.removeEvents](#elementRemoveEvents)


 

&nbsp;

##Function: $.loadEvent

A method to chain load multiple functions to execute when the document finishes loading.

**Syntax:**

    $.loadEvent(callback);

**Parameters:**

- function:function A valid function to run when the document finishes loading.

**Example:**

    var myFunction = function () {
        return true;
    };
    $.loadEvent(myFunction());


<a name="$DOMReadyList"></a>


&nbsp;

##Array: $.DOMReadyList

An array of functions to execute when the document's DOM is ready for access. This is used by $.executeWhenDOMReady.

**See Also:**

[$.executeWhenDOMReady](#$executeWhenDOMReady)

[$.ready](#$ready)



<a name="$executeWhenDOMReady"></a>


&nbsp;

##Function: $.executeWhenDOMReady

A method to executing methods stored in $.DOMReadyList. This method is called by the $.ready method for executing chained blocks of code when the document fires the DOMContentLoaded event signaling that the document's DOM is ready for access. It readys the $.DOMReadyList array to see what code is stored there and executes it item by item. There is never a need for the user to execute this method as it is an auxilliary method for the $.ready() function.

**Syntax:**

    $.executeWhenDOMReady();

**See Also:**

[$.DOMReadyList](#$DOMReadyList)

[$.ready](#$ready)


<a name="$ready"></a>


&nbsp;

##Function: $.ready

Method to determine when the DOM is ready for manipulation and thereupon fire a block of code contained in an anonymous function passed to it as an argument. This method is attached directly to the $ object. If there are mulitple instances of this method, it's arguments will be chained and called sequentially with one registration of the DOMContentLoaded event.

**Syntax:**

    $.ready(function);

**Parameters:**

- function:function An anonymous function or block of code to execute.

**Example:**

    $.ready(function() { 
        console.log("The document is ready for action!"); 
    });

**See Also:**

[$.DOMReadyList](#$DOMReadyList)

[$.executeWhenDOMReady](#$executeWhenDOMReady)


 

&nbsp;

##Function: $.UIHideURLbar

A method to hide the browser's address bar. This is used at page load time and when the user navigates to different views. This is for use when a Web app is running in the mobile browser with an address bar. It's not necessary for Web apps installed on the mobile device's home screen.

**Syntax:**

    $.UIHideURLbar();

**Example:**

    $.UIHideURLbar();


 

&nbsp;

##Function: $.importScript

A method to import external scripts into the document. This method is attached directly to the $ object.

**Syntax:**

    $.importScript(URI);

**Parameters:**

- URI: A valid URI of the script to import into the document.

**Example:**

    $.importScript("https://bozo.com/scripts/myScript.js");


 
**Variables: iphone, ipad, ipod, android, webos, blackberry, touchEndabled, online, standalone**

Properties to determine device platform, network connection and standalone status.

**Syntax:**

    $.standalone // returns true or false

**Example:**

    if (!$.standalone) {
        alert("Please install this app before using.");
    }
    if($.iphone) {
        // Code for iPhone here
    } else if ($.ipad) {
        // Code for iPad here
    }
											
					


&nbsp;

##Function: Element.xhr

A method to insert content into a node using The XMLHttpRequest object. This method is attached directly to the Element object.

**Syntax:**

    Element.xhr(URI);

**Parameters:**

- URI: A valid URI to import into the document and fill an element.
- Callback: A function to execute when the HTTPRequest is successful.

**Example:**

    $('#content').xhr('/data/customers.html');


 

&nbsp;

##Function: Element.xhrjson

A method to insert content into a node using The XMLHttpRequest object. This method is attached directly to the Element object.

**Syntax:**

    Element.xhrjson(URI);

**Parameters:**

- URI: A valid URI to import into the document and fill an element.
- options: An object literal mapping elements to json data.

**Example:**

    $('#content').xhrjson('/data/customers.js');


 

&nbsp;

##Function: Element.data

A method to get and set a dataset value on an element.

**Syntax:**

    Element.data(key);
    Element.data(key, value);

**Parameters:**

- key: A string defining the dataset key to access.
- value: A string defining the value to set the dataset key to.

**Example:**

    var customer = $('#customer').data('customer-name'); 
    $$(".customers").forEach(function(customer) {
        console.log(customer.data("customer-name"));
    }
    $("#shirt).data("shirt-size", "XXL"); // outputs data-shirt-size="XXL" on #shirt


 

&nbsp;

##Function: Element.removeData

A method to remove a dataset from an element.

**Syntax:**

    Element.removeData(key);

**Parameters:**

- key: A string defining the dataset key to remove.

**Example:**

    $("#shirt).removeData("shirt-size"); // removes data-shirt-size from #shirt

													
													

&nbsp;

##Function: $.localItem

Set a key/value pair to the browser's localStorage, or retrieve a key value. If you pass only a key, it returns the key's value if that key is present in localStorage. Otherwise, passing a key and a value will set these on localStorage.

**Syntax:**

    $.localItem(key, value)
    $.localItem(key)

**Parameters:**

- key: The key to retrieve from the browser's localStorage.
- key: A key to add to the browser's localStorage.
- value: A value to set to the key of the browser's localStorage.

**Example:**

    $.localItem("clientFirstName", "Robert");
    var clientFirstName = $.localItem("clientFirstName");
    console.log("The client's name is: " + clientFirstName");


&nbsp;

##Function: $.deleteLocalItem

Set a key/value pair to the browser's localstorage.

**Syntax:**

    $.deleteLocalItem(key)

**Parameters:**

- key: The key to remove from the browser's localStorage.

**Example:**

    $.deleteLocalItem("clientFirstName");


&nbsp;

##Function: $.clearLocalItems

A method to delete the localStorage. This requires no parameters and will completely remove the browser's localStorage for that domain. A new one can be create again at any time.

**Example:**

	$.clearLocalItem();


<a name="$jsmtCached"></a>


&nbsp;

##Variable: $.jsmtCached

A cache for templates to be used later. This is used by $.template

See Also:

[$.template](#$template)


<a name="$template"></a>


&nbsp;

##Function: $.template

A method to parse a JavaScript Micro Template and populate it with JSON data. This is based on John Residg's JavaScript micro template: [ejohn.org](http://ejohn.org/)

**Syntax:**

    $.template(str, data);

**Parameters:**

- string: A string defining the template to use.
- data: JSON data to be mapped to elements in the template.

**Example:**

    var result = $.template("tpl_1", data);
    $.ready(function() {
        $("#tpl_1_output").insert(result);
    });

See Also:

[$.jsmtCached](#$jsmtCached)


&nbsp;

##Function: $.UIUpdateOrientationChange

A method for outputting a class on the body tag to identify the orientation of the mobile device when the device's orientation changes. In landscape mode it puts the class "landscape" on the body tag and in portrait mode it puts the "portrait" on the body tag. There can only be one or the other on the body tag at any given time. This class is to enable the use of styles based on the orientation of the device. You can create styles using these class as in the example below.

**Example:**

    body.portrait app > view {
        background-color: green;
    }
    body.landscape app > view {
        background-color: orange;
    }
    

&nbsp;

##Function: $.UIListenForWindowResize

A method for outputting a class on the body tag to identify the orientation of the mobile device when the window is resized. If in window is wider than it is tall, it outputs the class "landscape" on the body tag, and when it is taller than it is wide, it outputs "portrait" on to the body tag. This allows you to testing for orientation change on the desktop for landscape and portrait modes.

**Example:**

    body.portrait > view {
    	background-color: green;
    }
    body.landscape > view {
    	background-color: red;
    }
								
																

&nbsp;

##Function: Function.bind

Add bind capability to the Function object for versions of Webkit that don't support it.

**Syntax:**

    Function.bind(function, object);

**Example:**

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


 

&nbsp;

##Function: Element.UICheckForOverflow

Determines whether an element has content overflowing its bounds or not.

**Syntax:**
    Element.UICheckForOverflow();

**Returns:**

A boolean true or false.

**Example:**
																        
    if($("tableview:first-of-type").UICheckForOverflow();) {
        // Handle scrolling.
    }
