module('Strings Tests');
// 1
test('$.camelize("this-is-a-string")', function() {
   equal($.camelize('this-is-a-string'), 'thisIsAString', 'Returns "thisIsAString"');
});
// 2
test('$.decamelize("thisIsAString")', function() {
   equal($.deCamelize('thisIsAString'),'this-is-a-string', 'Returns "this-is-a-string"');
});
// 3
test('Capitalize first word: $.capitalize("we are doing this.")', function() {
   equal($.capitalize('we are doing this.'),'We are doing this.', 'Returns "We are doing this."');
});
// 4
test('Capitalize all words: $.capitalize("we are doing this.", "all")', function() {
   equal($.capitalize('we are doing this.', 'All'),'We Are Doing This.', 'Returns "We Are Doing This."');
});
// 5
test('Returns undefined: $.camelize(node)', function() {
   var node = $('#ul');
   equal($.camelize(node), undefined, 'Should return undefined');
});
// 6
test('Returns undefined: $.deCamelize(node)', function() {
   var node = $('#ul');
   equal($.deCamelize(node), undefined, 'Should return undefined');
});
// 7
test('Returns undefined: $.capitalize(node)', function() {
   var node = $('#ul');
   equal($.capitalize(node), undefined, 'Should return undefined');
});
// 8
test('Returns undefined: $.capitalize(node, "all")', function() {
   var node = $('#ul');
   equal($.capitalize(node, "all"), undefined, 'Should return undefined');
});
// 9
test('Returns undefined: $.camelize(Object)', function() {
   var obj = {name: 'Joe', age: 100};
   equal($.camelize(obj), undefined, 'Should return undefined');
});
// 10
test('Returns undefined:$.decamelize(Object)', function() {
   var obj = {name: 'Joe', age: 100};
   equal($.deCamelize(obj), undefined, 'Returns undefined');
});
// 11
test('Returns undefined:$.capitalize(Object)', function() {
   var obj = {name: 'Joe', age: 100};
   equal($.capitalize(obj), undefined, 'Returns undefined');
});
// 12
test('Returns undefined:$.capitalize(Object, "all")', function() {
   var obj = {name: 'Joe', age: 100};
   equal($.capitalize(obj, 'all'), undefined, 'Returns undefined');
});
// 13
test('Returns undefined: $.camelize(111)', function() {
   equal($.camelize(1111), undefined, 'Should return undefined');
});
// 14
test('Returns undefined: $.deCamelize(111)', function() {
   equal($.deCamelize(1111), undefined, 'Should return undefined');
});
// 15
test('Returns undefined: $.capitalize(111)', function() {
   equal($.capitalize(1111), undefined, 'Should return undefined');
});
// 16
test('Returns undefined: $.capitalize(111, "all")', function() {
   equal($.capitalize(1111, 'all'), undefined, 'Should return undefined');
});