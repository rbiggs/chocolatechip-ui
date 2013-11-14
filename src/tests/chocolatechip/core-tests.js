module('Core Tests');
// 1
test('Returns version of ChocolateChip', function() {
   equal($.version, '3.0.5', 'Should be 3.0.5')
});
// 2
test('Returns name of library (ChocolateChip)', function() {
   equal($.libraryName, 'ChocolateChip', 'Should be ChocolateChip')
});
// 3
test('$.slice should equal Array.prototype.slice', function() {
   equal($.slice, Array.prototype.slice, 'Should be the same.');
});
// 4
test('$.make("<div></div>") should return div node in an array.', function() {
   var div = $.make('<div></div>');
   equal(div[0].nodeName, 'DIV', 'Should be a DIV element.');
});
// 5
test('$.make("<ul><li>one</li><li>two</li><li>three</li></ul>") should return ul node with three lis in an array.', function() {
   var ul = $.make('<ul><li>one</li><li>two</li><li>three</li></ul>');
   var lastChildOfUl = ul[0].lastElementChild.innerHTML;
   equal(ul[0].nodeName, 'UL', 'Should be a UL element.');
   equal(ul[0].children.length, 3, 'Should have three child nodes.');
   equal(lastChildOfUl, 'three', 'InnerHTML should be three');
});
// 6
test('Returns a text node in an array: $.make("some text")', function(){
   var text = $.make('some text');
   equal(text[0].nodeType, 3, 'Should return a text node in an array.');
});
// 7
test('$.html() should work the same as $.make().', function() {
   var div = $.make('<div></div>');
   equal(div[0].nodeName, 'DIV', 'Should be a DIV element.')
});
// 8
test('$.html("<ul><li></li><li></li><li></li></ul>") should return ul node with three lis in an array.', function() {
   var ul = $.make('<ul><li></li><li></li><li></li></ul>');
   equal(ul[0].nodeName, 'UL', 'Should be a UL element.');
   equal(ul[0].children.length, 3, 'Should have three child nodes.')
});
// 9
test( "Replace one div with another: $.replace().", function() {
   stop();
   $.replace($('#toReplace'), $('#toBeReplaced'));
   equal($('#toReplace')[0].nodeName, 'DIV', 'Replacing node is present.');
   equal($('#toBeReplaced')[0], undefined, 'Replaced node not present.');
   start();
});
// 10
test('$.noop is a function.', function(){
   equal($.isFunction(toString), true, 'Shoud return true.');
});
// 11
test('$.noop returns undefined', function(){
   equal($.noop(), undefined, 'Shoud return undefined.');
});
// 12
test('$.concat joins array of strings into one string.', function(){
   var arrayOfStrings = ['this','is','text'];
   var string = $.concat(arrayOfStrings);
   equal(string, 'thisistext','Should return "thisistext"')
});
// 13
test('$.concat joins array of numbers into one string.', function(){
   var arrayOfStrings = [1,2.0,3];
   var string = $.concat(arrayOfStrings);
   equal(string, '123','Should return "123"');
});
// 14
test('$.concat joins string arguments into one string.', function(){
   var string = $.concat('this','is','text');
   equal(string, 'thisistext','Should return "thisistext"');
});
// 15
test('$.concat joins number arguments into one string.', function(){
   var string = $.concat(1,2.0,3);
   equal(string, '123','Should return "thisistext"');
});
// 16
test('$.concat with objct returns undefined.', function(){
   var string = $.concat({name: 'Joe', age: 100});
   equal(string, undefined, 'Should return undefined.');
});
// 17
test('$.w("This is text."): convert a string of space separated words into an array.', function() {
   var array = $.w('This is text.');
   var string = array.join('');
   equal(array.length, 3, 'Should be array of three items.');
   equal(array[0], 'This', 'First item should be "This"');
   equal(array[1], 'is', 'Second item should be "is"');
   equal(array[2], 'text.', 'Third item should be "text."');
   equal(string, "Thisistext.",'Should return "Thisistext."');
});
// 18
test('Test if data is a String', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   var emptyString = '';
   equal($.isString(string), true, 'Should return true.');
   equal($.isString(emptyString), true, 'Should return true');
   equal($.isString([1,2,3]), false, 'Should return false.');
   equal($.isString(100), false, 'Should return false.');
   equal($.isString({name: "John", age: 100}), false, 'Should return false.');
   equal($.isString($.noop), false, 'Should return false.');
   equal($.isString(undefined), false, 'Should return false.');
   equal($.isString(null), false, 'Should return false.');
});
// 19
test('Test if data is an Array.', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   equal($.isArray(array), true, 'Should return true.');
   equal($.isArray(string), false, 'Should return false.');
   equal($.isArray($.noop), false, 'Should return false.');
   equal($.isArray(obj), false, 'Should return false.');
   equal($.isArray(null), false, 'Should return false.');
   equal($.isArray(undefined), false, 'Should return false.');
   equal($.isArray(123), false, 'Should return false.');
});
// 20
test('Test if data is a Function.', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   equal($.isFunction(array), false, 'Should return false.');
   equal($.isFunction(string), false, 'Should return false.');
   equal($.isFunction($.noop), true, 'Should return true.');
   equal($.isFunction(obj), false, 'Should return false.');
   equal($.isFunction(null), false, 'Should return false.');
   equal($.isFunction(undefined), false, 'Should return false.');
   equal($.isFunction(123), false, 'Should return false.');
});
// 21
test('Test if data is an Object.', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   equal($.isObject(array), false, 'Should return false.');
   equal($.isObject(string), false, 'Should return false.');
   equal($.isObject($.noop), false, 'Should return false.');
   equal($.isObject(obj), true, 'Should return true.');
   equal($.isObject(null), false, 'Should return false.');
   equal($.isObject(undefined), false, 'Should return false.');
   equal($.isObject(123), false, 'Should return false.');
});
// 22
test('Test if data is a Number.', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   equal($.isNumber(array), false, 'Should return false.');
   equal($.isNumber(string), false, 'Should return false.');
   equal($.isNumber($.noop), false, 'Should return false.');
   equal($.isNumber(obj), false, 'Should return false.');
   equal($.isNumber(null), false, 'Should return false.');
   equal($.isNumber(undefined), false, 'Should return false.');
   equal($.isNumber(123), true, 'Should return true.');
   equal($.isNumber(123.123), true, 'Should return true.');
   equal($.isNumber(-123.123), true, 'Should return true.');
   equal($.isNumber(0), true, 'Should return true.');
});
// 23
test('Test if data is an Integer.', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   equal($.isInteger(array), false, 'Should return false.');
   equal($.isInteger(string), false, 'Should return false.');
   equal($.isInteger($.noop), false, 'Should return false.');
   equal($.isInteger(obj), false, 'Should return false.');
   equal($.isInteger(null), false, 'Should return false.');
   equal($.isInteger(undefined), false, 'Should return false.');
   equal($.isInteger(123), true, 'Should return true.');
   equal($.isInteger(123.123), false, 'Should return false.');
   equal($.isInteger(-123.123), false, 'Should return false.');
   equal($.isInteger(0), true, 'Should return true.');
});
// 24
test('Test if data is a Float.', function() {
   var array = [1,2,3];
   var string = '123';
   var obj = {name: 'Joe', age: 100};
   equal($.isFloat(array), false, 'Should return false.');
   equal($.isFloat(string), false, 'Should return false.');
   equal($.isFloat($.noop), false, 'Should return false.');
   equal($.isFloat(obj), false, 'Should return false.');
   equal($.isFloat(null), false, 'Should return false.');
   equal($.isFloat(undefined), false, 'Should return false.');
   equal($.isFloat(123), false, 'Should return false.');
   equal($.isFloat(123.123), true, 'Should return true.');
   equal($.isFloat(-123.123), true, 'Should return true.');
   equal($.isFloat(0), false, 'Should return false.');
});
// 25
test('$.UuidNum should return 10 digit integer.', function() {
   var uid = $.uuidNum();
   equal($.isInteger(uid), true, 'Should be an integer.');
   equal(uid.toString().length, 10, 'Should have 10 digits.')
});
// 26
test('$.makeUuid() should return uid prefixed by "chch_', function() {
   var uid = $.makeUuid();
   var prefix = uid.split('_')[0];
   var integer = Number(uid.split('_')[1]);
   equal(/chch_/.test(uid.toString()), true, 'Should contain the string "chch_');
   equal(prefix + '_', 'chch_', 'Prefix should be "chch_"');
   equal($.isInteger(integer), true, 'Should be an integer.');
   equal(integer.toString().length, 10, 'Should be 10 digits.');
});
// 27
test('$.uuid should be 10 digit integer.', function(){
   equal($.isInteger($.uuid), true, 'Should be an integer.');
   equal($.uuid.toString().length, 10, 'Should be 10 digit integer.')
});
// 28
test('$.chch_cache, an object to hold ChUI cache.', function(){
   equal($.isObject($.chch_cache), true, 'Should be an object.');
});
// 29
test('$.fn is object used for extending ChocolateChip.', function(){
   equal($.isObject($.fn), true, 'Should be an object');
   equal(Object.keys($.fn)[0], 'extend', 'Should be the extend method.');
});
