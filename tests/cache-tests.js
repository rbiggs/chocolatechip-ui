module('Cache Tests');

// 1
test('$.uuid should be a 10 digit number', function() {
   equal($.isNumber($.uuid), true, 'Should be a number.');
   equal($.isInteger($.uuid), true, 'Should be an integer.');
   equal($.uuid.toString().length, 10, 'Should have 10 digits.');
});
// 2
test('$.chch_cache.data should be an object', function() {
   equal($.isObject($.chch_cache.data), true, 'Should be an object.');
});
// 3
test('$.chch_cache.events should be an object', function() {
   equal($.isObject($.chch_cache.events), true, 'Should be an object.');
});
// 4
test('$.chch_cache.events.keys should be an array.', function() {
   equal($.isArray($.chch_cache.events.keys), true, 'Should be an array.');
});
// 5
test('$.chch_cache.events.values should be an array.', function() {
   equal($.isArray($.chch_cache.events.values), true, 'Should be an array.');
});
// 6
test('$.chch_cache.events.set should be a function.', function() {
   equal($.isFunction($.chch_cache.events.set), true, 'Should be a function.');
});
// 7
test('Testing $.chch_cache.events.set method', function() {
   var setEvent = $('#setEvent')[0];
   var someFunction = function() {
      return 'This does something.'
   };
   $.chch_cache.events.set(setEvent, 'click', someFunction, false );
   equal($.chch_cache.events.keys.indexOf('setEvent'), 0, 'Should have a key of setEvent.');
   equal($.chch_cache.events.keys[0], 'setEvent', 'Should have a key of setEvent.');
   equal($.chch_cache.events.values.length, true, 'Should have a length.');
   equal($.isArray($.chch_cache.events.values[0]), true, 'Should have an array.');
   equal($.isArray($.chch_cache.events.values[0][0]), true, 'Should have an array.');
   equal($.chch_cache.events.values[0][0].length, 3, 'Should have a length of 3.');
   equal($.chch_cache.events.values[0][0][0], 'click', 'Should be "click".');
   equal($.isFunction($.chch_cache.events.values[0][0][1]), true, 'Should be a function.');
   equal($.chch_cache.events.values[0][0][2], false, 'Should be false.');
});
// 8
test('$.chch_cache.events.hasKey should be a function and return a key.', function() {
   equal($.isFunction($.chch_cache.events.hasKey), true, 'Should be a function.');
   equal($.chch_cache.events.hasKey('setEvent'), true, 'Key should contain "setEvent"');
});
// 9
test('$.chch_cache.events.set (set second event):', function() {
   var setEvent2 = $('#setEvent2')[0];
   $.chch_cache.events.set(setEvent2, 'click', $.noop, false );
   equal($.chch_cache.events.keys[0], 'setEvent', 'Should have a key of setEvent.');
   equal($.chch_cache.events.keys[1], 'setEvent2', 'Should have a key of setEvent2.');
   equal($.chch_cache.events.values.length, 2, 'Should have a length of 2 (2 registered events).');
});
// 10
test('$.chch_cache.events._delete:', function() {
   var setEvent2 = $('#setEvent2')[0];
   equal($.isFunction($.chch_cache.events._delete), true, 'Is a function.')
   stop();
   $.chch_cache.events._delete('setEvent2', 'click',$.noop);
   setTimeout(function() {
      start();
      equal($.chch_cache.events.keys[0], 'setEvent', 'Should have a key of setEvent.');
   }), 1000;
});
// 11
$(function() {
   setTimeout(function() {
      var setEvent2 = $('#setEvent2')[0];
      $.chch_cache.events.set(setEvent2, 'click', $.noop);
      test('$.chch_cache.events._delete:', function() {
         $.chch_cache.events._delete('setEvent2', 'click', $.noop );
         equal($.chch_cache.events.keys.indexOf('setEvent1'), -1,'Shound not be a key for setEvent2');
         equal($.chch_cache.events.values[0].length, true , 'Should an array.');
         equal($.chch_cache.events.values[1], undefined , 'Shoule be only one array.');
      });
   }, 1000);
});
