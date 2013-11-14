module('Collection-Data Tests');

// 1
test('[].dataset:', function() {
   var list = $('#ul');
   equal([].dataset(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].dataset(function(ctx) {})), true, 'Should return an array.');
   var result = list.dataset('fruits');
   equal(result, undefined, 'Should return undefined.');
   list.dataset('fruits', 'apples');
   equal(list[0].dataset.fruits, 'apples', 'Should be apples.');
   equal(list.dataset('fruits'), 'apples', 'Should return apples.');
   list.dataset('fruits',['apples','oranges','bananas'].join(' '));
   equal(list[0].dataset.fruits, 'apples oranges bananas', 'Should return apples oranges bananas.');
   equal(list.dataset('fruits'), 'apples oranges bananas', 'Should return "apples oranges bananas".');
   var person = {"firstName": "John", "lastName": "Doe", "age":32};
   list.dataset('person', JSON.stringify(person));
   equal(list.dataset('person'), '{"firstName":"John","lastName":"Doe","age":32}', 'Should return {"firstName":"John","lastName":"Doe","age":32}.');
});
// 2
test('[].data:', function() {
   var list = $('#ul');
   var string = 'Apples, orange and bananas.';
   var array = ['apples','oranges','bananas'];
   var obj = {name: 'John', age: 100};
   equal([].data(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].data(function(ctx) {})), true, 'Should return an array.');
   var result = list.data('whatever');
   equal(result, undefined, 'Should return undefined.');
   //equal(result.length, 1, 'Should return array with length 1.');
   list.data('fruits', 'apples');
   equal($.isString(list.data('fruits')), true, 'Should return true.');
   equal(list.data('fruits'), 'apples', 'Should return "apples".');
   var result = list.data('fruits', string);
   equal($.isArray(result), true, 'Should return an array.');
   equal(result.length, 1, 'Should return array length 1.')
   equal(list.data('fruits'), 'Apples, orange and bananas.', 'Should return "Apples, orange and bananas."');
   list.data('fruits', array);
   result = list.data('fruits');
   equal($.isArray(result), true, 'Should return an array.');
   equal(result.length, 3, 'Should return array length 3.');
   equal(result.join(' '), 'apples oranges bananas', 'Should return "apples oranges bananas".');
   list.data('fruits', obj);
   result = list.data('fruits');
   equal($.isObject(result), true, 'Should return true.');
   equal(result.name, 'John', 'Should return "John".');
   equal(result.age, 100, 'Should return 100.');
   list.data('fruits', undefined);
   result = list.data('fruits');
   equal($.isObject(result), true, 'Should return previous Object.');
   list.data('fruits', null);
   result = list.data('fruits');
   equal($.isObject(result), true, 'Should return previous Object.');
   list.data('fruits', '');
   result = list.data('fruits');
   equal($.isObject(result), true, 'Should not return Object.');
   equal(result.fruits, undefined, 'Should return empty undefined.');
   list.data('fruits', 1);
   result = list.data('fruits');
   equal(result, 1, 'Should return 1.');
   list.data('zero', '0');
   result = list.data('zero');
   equal(result,  $.chch_cache.data['ul'].zero, 'Should return "0".');
   equal(result, '0', 'Should return "0".');
   list.data('zero', '0.0');
   result = list.data('zero');
   equal(result, '0.0', 'Should return "0".');
   list.data('zero', ['0']);
   result = list.data('zero');
   equal(result, $.chch_cache.data['ul'].zero, "Should return ['0'].");
   equal(result[0], '0', 'Should return "0".');
   equal(result.length, 1, 'Should return length 1.');
});
// 3
test('[].removeData:', function() {
   var list = $('#ul');
   var string = 'Apples, orange and bananas.';
   var array = ['apples','oranges','bananas'];
   var obj = {name: 'John', age: 100};
   equal([].data(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].data(function(ctx) {})), true, 'Should return an array.');
   list.data('fruits', 'apples');
   equal(list.data('fruits'), 'apples', 'Should return "apples".');
   list.removeData('fruits');
   equal(list.data('fruits'), undefined, 'Should return undefined.');
   list.data('person', {name: 'John', age: 100});
   equal(list.data('person').name, 'John', 'Should return John.');
   list.removeData('person');
   equal(list.data('person'), undefined, 'Should return undefined.');
   list.data('fruits', ['apples','oranges','bananas']);
   equal(list.data('fruits')[1], 'oranges', 'Should return "oranges".');
   list.removeData('fruits');
   equal(list.data('fruits'), undefined, 'Should return undefined.');
});




