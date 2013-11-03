module('Selector Tests');
// 1
test('$ is valid', function() {
   ok( $, '$', '$ exists in global space.');
});
// 2
test('Get element by tag', function() {
   equal($('ul').length, 1, 'Got a ul tag!');
});
// 3
test('Get element by id', function() {
   equal($('#ul').length, 1, 'Got an id ul!');
});
// 4
test('Get element by class', function() {
   equal($('.ul').length, 1, 'Got a class ul!');
});
// 5
test('Get element by attribute', function() {
   equal($('[title=list]').length, 1, 'Got an attribute [title=list] ul!');
});
// 6
test('Get element by tag with context', function() {
   equal($('.ul', '#qunit-fixture').length, 1, 'Got a class ul!');
});
// 7
test('Get element by class with context', function() {
   equal($('.ul', '#qunit-fixture').length, 1, 'Got a class ul!');
});
// 8
test('Get element by tag when context is node', function() {
   var context = document.getElementById('ul');
   equal($('li:first-child', context).length, 1, 'Got a node whose context was a node');
});
// 9
test('Return context as array if it is a node', function() {
   var context = document.getElementById('ul');
   var testContext = function(context) {
      if (context && context.nodeType === 1) {
         return [context];
      } else {
         return;
      }
   };
   var node = testContext(context);
   ok(node.constructor === Array), true, 'The context was converted to an array';
});
// 10
test('Get element by class with context', function() {
   equal($('.ul', '#qunit-fixture').length, 1, 'Got a class ul!');
});
// 11
test('CSS3 selector: first-of-type', function() {
   equal($('ul:first-of-type').length, 1, 'Got a ul tag that is first of type.')
});
// 12
test('Get first child', function() {
   var firstChild = document.getElementById('ul').firstElementChild;
   equal($('#ul > li:first-child')[0], firstChild, 'Got the first child');
});
// 13
test('Pass in a node', function() {
   var ul = document.getElementsByTagName('ul')[0];
   equal($(ul).length, 1, 'Returned a node.')
});
// 14
test('Pass in array of nodes', function() {
   var listItems = $('li', '#qunit-fixture');
   equal($(listItems).length, 3, 'Returned array of nodes');
});
// 15
test('$(undefined) returns document root', function() {
   equal($(undefined)[0], document, 'Returned the document')
});
// 16
test('$() returns document root', function() {
   equal($()[0], document, 'Returned the document')
});
// 17
test('$(null) returns empty array', function() {
   equal($(null).length, 0, 'Returned an empty arrray')
});
// 18
test('$("text here!") returns empty array', function() {
   equal($('text here!').length, 0, 'Returned an empty array.');
});
// 19
test('$(document) returns document root', function() {
   equal($(document).length, 1, 'Returned the document root')
});
// 20
test('$(window) returns empty array', function() {
   equal($(window).length, 0, 'Returned the window object')
});
// 21
test('$("#nonExistingElement") returns empty array.', function() {
   equal($('#nonExistingElement')[0], undefined, 'No node was found.');
   equal($('#nonExistingElement').length, 0, 'Array is empty.')
});
// 22
test('Create div from markup', function() {
   equal($('<div></div>')[0].nodeName, 'DIV', 'Created a div')
});
// 23
test('Create a node with child nodes', function() {
   var nodes = $('<ul id="bozo"><li>one</li><li>two</li><li>three</li></ul>');
   equal(nodes[0].children.length, 3, 'Node has three child nodes');
});
// 24
test('Passing empty string, returns empty array', function() {
   equal($('').length, 0, 'Returns empty array');
});
// 25
test('Passing a callback executes it', function() {
   var callback = function() {
      1 + 1;
   };
   ok($(callback()), 'Executed callback')
});
