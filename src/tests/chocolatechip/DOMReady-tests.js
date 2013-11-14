module('DOMReady Tests');
// 1
test('$.DOMReadyList should be an array.', function(){
   equal($.DOMReadyList instanceof Array, true, 'Should be true');
});
// 2
test('$.DOMReadyList should have length of 0.', function(){
   equal($.DOMReadyList.length, 0, 'Should be 0.');
});
// 3
test('$.ready() should execute callback if DOM is available.', function(){
   var value;
   $.ready(function(){
      value = true;
   });
   equal(value, true, 'The callback should return true.');
});
// 4
test('$.ready() should execute two callbacks if DOM is available.', function(){
   var value1;
   var value2;
   $.ready(function(){
      (function() {
         value1 = true;
      })();
      (function() {
         value2 = true;
      })();
   });
   equal(value1, true, 'The callback should return true.');
   equal(value2, true, 'The callback should return true.');
});
// 5
test('$.ready() should execute two callbacks if DOM is available.', function(){
   var value1;
   var value2;
   $.ready(function(){
      var func1 = function() {
         value1 = true;
      };
      var func2 = function() {
         value2 = true;
      };
      func1();
      func2();
   });
   equal(value1, true, 'The callback should return true.');
   equal(value2, true, 'The callback should return true.');
});
// 6
test('$.ready() should execute two callbacks if DOM is available.', function(){
   var value1;
   var value2;
   $.ready(function(){
      value1 = true;
   });
   $.ready(function(){
      value2 = true;
   });
   equal(value1, true, 'The callback should return true.');
   equal(value2, true, 'The callback should return true.');
});
// 7
test('$.ready() should execute two callbacks if DOM is available.', function(){
   var value1;
   var value2;
   $.ready(function(){
      var func1 = function() {
         value1 = true;
      };
      func1();
   });
   $.ready(function(){
      var func2 = function() {
         value2 = true;
      };
      func2();
   });
   equal(value1, true, 'The callback should return true.');
   equal(value2, true, 'The callback should return true.');
});
