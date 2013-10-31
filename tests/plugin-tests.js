module('Pugin Tests');
// 1
test('Extend Array: $.fn.extend({bingo: function() {return "Bingo!";}})', function() {
      $.fn.extend({
         bingo: function() {
            return 'Bingo!';
         }
      });
      var a = [1,2,3];
      equal($.isFunction(a.bingo), true, 'Should be a function.');
      equal(a.bingo(), 'Bingo!', 'Should return "Bingo!")');
});
// 2
test('Extend Array: $.fn.extend({whatever: function() {return "Whatever!";}})', function() {
      $.fn.extend({
         whatever: function() {
            return 'Whatever!';
         }
      });
      var a = [1,2,3];
      equal($.isFunction(a.whatever), true, 'Should be a function.');
      equal(a.whatever(), 'Whatever!', 'Should return "Whatever!")');
});
// 3
test('Does not polute for key in value loop on Array: $.fn.extend({xtend: function() {return "Extended!";}})', function() {
   var a = [1,2,3];
   var result = 0;
   $.fn.extend({
      xtend: function() {
         return 'Extended!';
      }
   });
   for (key in a) {
      result += 1;
   }
   equal(result, 3, 'Should return 3.');
});
// 4
test('Does not polute for key in value loop on Array: $.fn.extend({xtend2: function() {return "Extended again!";}})', function() {
   var a = [1,2,3];
   var result = 0;
   $.fn.extend({
      xtend2: function() {
         return 'Extended again!';
      }
   });
   for (key in a) {
      result += 1;
   }
   equal(result, 3, 'Should return 3.');
});

