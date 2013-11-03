module('Collection-Traversal Tests');

// 1
test('[].each:', function() {
   equal($.isFunction([].each), true, 'Should be a function.');
   var total = 0;
   var a = [1,2,3,4,5];
   var b = [];
   var result;
   var lastValue = 0;
   var lastIndex = 0;
   a.each(function(ctx, idx) {
      total += idx;
      if (idx === a.length -1) {
         lastValue = a[idx];
         lastIndex = idx;
      }
      equal(a[idx], idx+1, 'Should return correct context.');
   });
   result = b.each(function(ctx, idx) {
      console.log('Nothing in this array!');
   });
   equal([].each(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].each(function(ctx) {})), true, 'Should return an array.');
   equal(lastValue, 5, 'Last value should be 5');
   equal(lastIndex, 4, 'Last index should be 4.');
   equal($.isArray(b), true, 'Loop on empty array should return an array.');
   equal(b.length, 0, 'Attempt to iterate empty array should return empty array.');
});
// 2
test('[].unique:', function() {
   var a = [1,2,3,1,1,2,2,3,3];
   var b = a.unique();
   equal([].unique(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].unique(function(ctx) {})), true, 'Should return an array.');
   equal(a.length, 9, 'Array should initally have a length of 9.');
   equal(b.length, 3, 'Array should have a length of 3');
   equal(b[0], 1, 'Array\'s first index should be 1.');
   equal(b[1], 2, 'Array\'s second index should be 2.');
   equal(b[2], 3, 'Array\'s third index should be 3.');
});
// 3
test('[].eq:', function() {
   var a = [1,2,3];
   equal([].eq(0).length, 0, 'Should have length of 0.');
   equal($.isArray([].each(0)), true, 'Should return an array.');
   equal(a.eq(0), 1, 'eq(0) should return value of 1.');
   equal(a.eq(1), 2, 'eq(1) should return value of 2.');
   equal(a.eq(2), 3, 'eq(2) should return value of 3.');
   equal(a.eq(-1), 3, 'eq(-1) should return last value: 3.');
   equal(a.eq(-2), 2, 'eq(-2) should return next to last value: 2.');
   equal(a.eq(-3), 1, 'eq(-3) should return first value: 1.');
   equal($.isArray(a.eq(6)), true, 'Should return an array.');
   equal(a.eq(6).length, 0, 'Should return empty array.');
});
// 4
test('[].index:', function() {
   var haystack = $('div');
   var needle = $('#setEvent2');
   var a = ['a','b','c'];
   equal([].index().length, 0, 'Should have length of 0.');
   equal($.isArray([].index()), true, 'Should return an array.');
   equal(haystack.index(needle), 4, 'Needle should have an index of 4.');
   equal(haystack.index(), 1, 'If no index value provided, should return the index of first node in relation to its siblings, which in this case is 1.');
   equal($('span').index(), 0, 'Should return position of first span as 0.')
   equal(a.index('a'), 0, '"a" should have index of 0.');
   equal(a.index('b'), 1, '"a" should have index of 1.');
   equal(a.index('c'), 2, '"a" should have index of 2.');
});
// 5
test('[].is:', function() {
   var d = $('div');
   equal([].is().length, 0, 'Should have length of 0.');
   equal($.isArray([].is()), true, 'Should return an array.');
   equal(d.is().length, 0, 'Should return empty array because no argument was provided.');
   equal(d.is('#setEvent2')[0].id, 'setEvent2', 'Should return true.');
   equal($.isArray(d.is('#setEvent2')), true, 'Should return an array.');
   equal(d.is('.whatever')[0].nodeName, 'DIV', 'Should return true.');
   equal($.isArray(d.is('.whatever')), true, 'Should return an array.');
   equal(d.is('.whatever')[0].id, 'setEvent', 'Should return true.');
   equal($.isArray(d.is('div')), true, 'Should return an array.');
   equal(d.is('div').eq(0)[0].id, 'qunit', 'Should return true.');
   equal(d.is('div').eq(4)[0].id, 'setEvent2', 'Should return true.');
   equal(d.is('[disabled]')[0].id, 'setEvent', 'Should return true.');
   equal(d.is('[data-myAttr]')[0].id, 'setEvent2', 'Should return true.');
});
// 6
test('[].isnt:', function() {
   var d = $('div');
   equal([].isnt().length, 0, 'Should have length of 0.');
   equal($.isArray([].isnt()), true, 'Should return an array.');
   equal(d.isnt('#qunit').length, 4, 'Should return a length of 4.');
   equal($.isArray(d.isnt('div')), true , 'Should return empty array.');
   equal(d.isnt('div').length, 0 , 'Should return empty array.');
   equal(d.isnt('li').length, 5, 'Should return length of 5.')
   equal(d.isnt('.whatever').length, 4, 'Should return a length of 4.');
   equal(d.isnt('.silly').length, 5, 'Should return length of 5.')
   equal(d.isnt('[disabled]').length, 4, 'Should return a length of 4.');
   equal(d.isnt('[nothing]').length, 5, 'Should return a length of 5.')
});
// 7
test('[].has:', function() {
   var list = $('#ul');
   equal([].has().length, 0, 'Should have length of 0.');
   equal($.isArray([].has()), true, 'Should return an array.');
   equal(list.has('li').length, 1, 'Should have a length of 3.');
   equal(list.has('#listitem').length, 1, 'Should have a length of 3.');
   equal($.isArray(list.has('#listitem')), true, 'Should return empty array.');
   equal(list.has('.listitem').length, 1, 'Should have a length of 3.');
   equal($.isArray(list.has('.listitem')), true, 'Should return empty array.');
   equal(list.has('[disabled]').length, 1, 'Should have a length of 3.');
   equal($.isArray(list.has('[disabled]')), true, 'Should return empty array.');
   equal($.isArray(list.has('a')), true, 'Should return empty array.');
   equal(list.has('a').length, 0, 'Should return empty array.');
});
// 8
test('[].hasnt:', function() {
   var list = $('#ul');
   equal([].hasnt().length, 0, 'Should have length of 0.');
   equal($.isArray([].hasnt()), true, 'Should return an array.');
   equal(list.hasnt('li').length, 0,'Should return empty array.');
   equal($.isArray(list.hasnt('li')), true, 'Should return empty array.');
   equal(list.hasnt('a').length, 1, 'Should have a length of 1.');
   equal(list.hasnt('#listitem').length, 0, 'Should have length of 0.');
   equal(list.hasnt('#whatever').length, 1, 'Should have length of 1.');
   equal(list.hasnt('.listitem').length, 0, 'Should have length of 0.');
   equal(list.hasnt('.whatever').length, 1, 'Should have length of 1.');
   equal(list.hasnt('[disabled]').length, 0, 'Should have length of 0.');
   equal(list.hasnt('[enabled]').length, 1, 'Should have length of 1.');
});
// 9
test('[].find:', function() {
   var list = $('#ul');
   equal([].find().length, 0, 'Should have length of 0.');
   equal($.isArray([].find()), true, 'Should return an array.');
   equal(list.find('li').length, 3,'Should have length of 3.');
   equal($.isArray(list.find('li')), true, 'Should be an array.');
   equal(list.find('a').length, 0, 'Should be empty array.');
   equal($.isArray(list.find('a')), true, 'Should be an array.');
   equal(list.find('#listitem').length, 1, 'Should have length of 1.');
   equal(list.find('.listitem').length, 1, 'Should have length of 1.');
   equal(list.find('[disabled]').length, 1, 'Should have length of 1.');
});
// 10
test('[].prev:', function() {
   var item = $('.listitem');
   equal([].prev().length, 0, 'Should have length of 0.');
   equal($.isArray([].prev()), true, 'Should return an array.');
   equal($.isArray(item.prev()), true, 'Should return true.');
   equal(item.prev().length, 1, 'Should have length of 1.');
   equal($.isArray(item.prev().prev()), true, 'Should return an array.');
   equal(item.prev().prev().length, 0, 'Should have length of 0.');
});
// 11
test('[].next:', function() {
   var item = $('.listitem');
   equal([].next().length, 0, 'Should have length of 0.');
   equal($.isArray([].next()), true, 'Should return an array.');
   equal($.isArray(item.next()), true, 'Should return true.');
   equal(item.next().length, 1, 'Shoulld have length of 1.');
   equal($.isArray(item.next().next()), true, 'Should return an array.');
   equal(item.next().next().length, 0, 'Should hav length of 0.');
});
// 12
test('[].first:', function() {
   var elem = $('#ul');
   equal([].first().length, 0, 'Should have length of 0.');
   equal($.isArray([].first()), true, 'Should return an array.');
   equal($.isArray(elem.first()), true, 'Should return an array.');
   equal(elem.first().length, 1, 'Should have a length of 1.');
   equal($.isArray(elem.first().first()), true, 'Should return an array.');
   equal(elem.first().first().length, 0, 'Should return an empty array.');
});
// 13
test('[].last:', function() {
   var elem = $('#ul');
   equal([].last().length, 0, 'Should have length of 0.');
   equal($.isArray([].last()), true, 'Should return an array.');
   equal($.isArray(elem.last()), true, 'Should return an array.');
   equal(elem.last().length, 1, 'Should have a length of 1.');
   equal($.isArray(elem.last().last()), true, 'Should return an array.');
   equal(elem.last().last().length, 0, 'Should return an empty array.');
});
// 14
test('[].children:', function() {
   var elem = $('#ul');
   equal([].children().length, 0, 'Should return length of 0.');
   equal($.isArray([].children()), true, 'Should return an array.');
   equal($.isArray(elem.children()), true, 'Should return an array.')
   equal(elem.children().length, 3, 'Should return length of 3.');
   equal(elem.children()[0].id, 'listitem', 'Should have an id of "listitem".');
   equal(elem.children()[1].className, 'listitem', 'Should have class name "listitem".');
   equal(elem.children()[2].hasAttribute('disabled'), true, 'Should have attribute "disabled".');
   equal($.isArray(elem.children().children()), true, 'Should return an array.');
   equal(elem.children().children().length, 0, 'Array should have lenght of 0.');
   equal($.isArray($('body').children('span')), true, 'Should return an array.');
   equal($('body').children('span').length, 1, 'Array should have a length of 1.');
   equal($.isArray(elem.children('li')), true, 'Should return an array.');
   equal(elem.children('li').length, 3, 'Should return array with length of 3.');
});
// 15
test('[].parent:', function() {
   equal([].parent().length, 0, 'Should return length of 0.');
   equal($.isArray([].parent()), true, 'Should return an array.');
   equal($.isArray($('#listitem').parent()), true, 'Should return an array.');
   equal($('#listitem').parent().length, 1, 'Should return an array with length of 1.');
   equal($('#listitem').parent()[0].id, 'ul', 'Should return parent id: ul');
   equal($('#listitem').parent()[0].className, 'ul', 'Should return parent class name: ul');
   equal($('#listitem').parent()[0].hasAttribute('title'), true, 'Should return true.');
   equal($('#listitem').parent()[0]['title'], 'list', 'Should return title "list".');
});
// 16
test('[].ancestor:', function() {
   var item = $('.listitem');
   equal([].parent().length, 0, 'Should return length of 0.');
   equal($.isArray([].parent()), true, 'Should return an array.');
   equal($.isArray(item.ancestor()), true, 'Should return an array.');
   equal(item.ancestor().length, 0, 'Should return an empty array.');
   equal($.isArray(item.ancestor('ul')), true, 'Should return an array.');
   equal(item.ancestor('ul')[0].id, 'ul', 'Should return id of ancestor: "ul".');
   equal(item.ancestor('ul')[0].className, 'ul', 'Should return class name of ancestor: "ul".');
   equal(item.ancestor('ul')[0]['title'], 'list', 'Should return title of ancestor: "list".');
   equal($.isArray(item.ancestor('div')), true, 'Should return an array.');
   equal(item.ancestor('div')[0].id, 'qunit-fixture', 'Should return id of ancestor: "qunit-fixture".');
   equal(item.ancestor('div')[0].nodeName, 'DIV', 'Should return ancestor: "DIV".');
   equal(item.ancestor(1)[0].nodeName, 'UL', 'Should return ancestor of type "UL".');
   equal(item.ancestor(2)[0].nodeName, 'DIV', 'Should return ancestor of type "DIV".');
   equal(item.ancestor(3)[0].nodeName, 'BODY', 'Should return ancestor of type "BODY".');
});
// 17
test('[].siblings:', function() {
   var item = $('.listitem');
   var elem = $('#ul');
   var div = $('#setEvent');
   equal([].siblings().length, 0, 'Should return length of 0.');
   equal($.isArray([].siblings()), true, 'Should return an array.');
   equal($.isArray(item.siblings()), true, 'Should return an array.');
   equal($.isArray(elem.siblings()), true, 'Should return an array.');
   equal(item.siblings().length, 2, 'Should return an array with length of 2.');
   equal(elem.siblings().length, 2, 'Should return an array with length of 2.');
   equal(div.siblings().length, 2, 'Should return an array with length of 2.');
   equal(div.siblings('ul').length, 1, 'Should return an array with length of 1.');
   equal(div.siblings('div').length, 1, 'Should return an array with length of 1.');
   equal(item.siblings('[disabled]').length, 1, 'Should return an array with length of 1.');
});