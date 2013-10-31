module('returnResults Tests');
// 1
test('Check for array with just "undefined" as value.', function() {
   var a = [undefined];
   var returnResult = function ( result ) {
      if (result.length && result[0] === undefined) return [];
   };
   var result = returnResult(a);
   equal(result.length, 0, 'Array contains only "undefined"');
});
// 2
test('Returns an array when one is passed', function() {
   var a = [1,2,3];
   var returnResult = function ( result ) {
      if (result.length) return result;
   };
   var result = returnResult(a);
   equal(result.length, 3, 'Should return array with three indices.')
});
// 3
test('Passing null should return an empty array.', function() {
   var a = null;
   var returnResult = function ( result ) {
      if (result && result.length && result[0] === undefined) return [];
      if (result && result.length) return result;
      else return [];
   };
   var result = returnResult(a);
   equal(result.length, 0, 'Returned an empty array.')
});
// 4
test('Passing undefined should return an empty array.', function() {
   var a = undefined;
   var returnResult = function ( result ) {
      if (result && result.length && result[0] === undefined) return [];
      if (result && result.length) return result;
      else return [];
   };
   var result = returnResult(a);
   equal(result.length, 0, 'Returned an empty array.')
});
// 5
test('Passing a string should return an empty array.', function() {
   var str = 'string';
   var returnResult = function ( result ) {
      if (typeof result === 'string') return [];
      if (result && result.length && result[0] === undefined) return [];
      if (result && result.length) return result;
      else return [];
   };
   var result = returnResult(str);
   equal(result.length, 0, 'Returned an empty array.')
});
// 6
test('Passing an object should return an empty array.', function() {
   var obj = {name: 'Joe', age: 100};
   var returnResult = function ( result ) {
      if (typeof result === 'string') return [];
      if (result && result.length && result[0] === undefined) return [];
      if (result && result.length) return result;
      else return [];
   };
   var result = returnResult(obj);
   equal(result.length, 0, 'Returned an empty array.')
});