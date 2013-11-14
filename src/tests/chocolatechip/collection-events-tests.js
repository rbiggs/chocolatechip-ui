module('Collection-Events Tests');

// 1
test('[].bind:', function() {
   var list = $('#ul');
   equal([].bind(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].bind(function(ctx) {})), true, 'Should return an array.');
   $.eventResult = false;
   var callback = function() {
      $.eventResult = true;
   };
   list.bind('click', callback, false);
   list.trigger('click');
   equal($.eventResult, true, 'Should return true.');
   equal($.chch_cache.events.keys.length, true, 'Should be an array.');
   equal($.chch_cache.events.keys[0], 'ul', 'Should return id of "ul".');
   equal($.chch_cache.events.values.length, 1, 'Should be an array.');
   equal($.chch_cache.events.values[0].length, 1, 'Should be an array.');
   equal($.chch_cache.events.values[0][0].length, 3, 'Should be an array.');
   equal($.chch_cache.events.values[0][0][0], 'click', 'Should be "click".');
   equal($.isFunction($.chch_cache.events.values[0][0][1]), true, 'Should be a function.');
   equal($.chch_cache.events.values[0][0][2], false, 'Should be false.');
   $.eventResult = false;
   $.chch_cache.events.values[0][0][1]();
   equal($.eventResult, true, '$.eventResult should be true.');
   $('body').bind('bump', $.noop, true);
   equal($.chch_cache.events.values[1][0][0], 'bump', 'Should be "bump".');
   equal($.chch_cache.events.values[1][0][2], true, 'Should be true.');
   $('body').unbind('bump', $.noop, true);
});
// 2
test('[].unbind:', function() {
   var list = $('#ul');
   equal([].unbind(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].unbind(function(ctx) {})), true, 'Should return an array.');
   $.eventResult = false;
   var callback = function() {
      $.eventResult = true;
   };
   list.bind('click', callback, false);
   list.trigger('click');
   equal($.eventResult, true, 'Should return true.');
   equal($.chch_cache.events.keys[0], 'ul', 'Should return id of "ul".');
   equal($.chch_cache.events.values[0][0].length, 3, 'Should be an array.');
   equal($.chch_cache.events.values[0][0][0], 'click', 'Should be "click".');
   equal($.isFunction($.chch_cache.events.values[0][0][1]), true, 'Should be a function.');
   equal($.chch_cache.events.values[0][0][2], false, 'Should be false.');
   $.eventResult = false;
   $.chch_cache.events.values[0][0][1]();
   equal($.eventResult, true, '$.eventResult should be true.');
   $.eventResult = false;
   list.unbind('click', callback, false);
   equal($.chch_cache.events.keys[0], undefined, 'Should return id of "ul".');
   equal($.chch_cache.events.values[0], undefined, 'Should return false.');
});
// 3
test('[].trigger:', function() {
   var list = $('#ul');
   equal([].trigger(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].trigger(function(ctx) {})), true, 'Should return an array.');
   var updateListItem = function() {
      $('#listitem').text('Text modified by triggered event.');
   };
   var updateListItemAgain = function(text) {
      $('#listitem').text(text);
   }
   $('body').bind('update', updateListItem, false);
   var boundItem = $('body')[0].id;
   equal($.chch_cache.events.keys[0], boundItem, 'Should return id of body.');
   $('body').trigger('update');
   var updatedText = $('#listitem').text();
   equal($.chch_cache.events.values[0][0][0], 'update', 'Should be "update".');
   equal(updatedText, 'Text modified by triggered event.', 'Should return "Text modified by triggered event."');
   $('#listitem').bind('click', updateListItemAgain('Text has changed again.'), false);
   equal($.chch_cache.events.values[1][0][0], 'click', 'Should be "click".');
   equal($.chch_cache.events.keys[1], 'listitem', 'Should return id of "listitem".');
   $('#listitem').trigger('click');
   updatedText = $('#listitem').text();
   equal(updatedText, 'Text has changed again.', 'Should return "Text has changed again."');
});
// 4
test('[].delegate:', function() {
   var list = $('#ul');
   equal([].delegate(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].delegate(function(ctx) {})), true, 'Should return an array.');
   $.delegateTest;
   $.delegateTarget;
   var delegateFunc = function(e) {
      $.delegateTest = true;
      $.delegateTarget = e.target;
   };
   list.delegate('li', 'click', delegateFunc, false);
   equal($.delegateTest, undefined, 'Should return undefined.');
   $('#listitem').trigger('click');
   equal($.delegateTest, true, 'Should return true.');
   equal($.chch_cache.events.keys[0], $('body')[0].id, 'Should return id of body.');
   equal($.chch_cache.events.values[0][0][0], 'update', 'Should be "update".');
   equal($.isFunction($.chch_cache.events.values[0][0][1]), true, 'Should be a function.');
   equal($.chch_cache.events.values[0][0][1](), undefined, 'Should be a function.');
   var func = $.chch_cache.events.values[0][0][1].toString();
   func = func.replace(/(\r\n|\n|\r|\t)/gm, "");
   equal(func, "function () {      $('#listitem').text('Text modified by triggered event.');   }", 'Should be a function.');
   equal($.delegateTarget.id, 'listitem', 'The event target should be "#listitem".');
   equal($.delegateTarget.nodeName, 'LI', 'Event target should be a list item.');
});
// 5
test('[].undelegate:', function() {
   var div = $('#setEvent2');
   equal([].delegate(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].delegate(function(ctx) {})), true, 'Should return an array.');
   $.delegateTest2 = undefined;
   $.delegateTarget2 = undefined;
   var delegateFunc2 = function(e) {
      $.delegateTest2 = true;
      $.delegateTarget2 = e.target;
   };
   div.delegate('span', 'click', delegateFunc2, false);
   div.first().trigger('click');
   equal($.delegateTest2, true, 'Should return true.');
   equal($.delegateTarget2.nodeName, 'SPAN', 'Should return SPAN.');
   div.undelegate('span', 'click', delegateFunc2, false);   
   $.delegateTest2 = undefined;
   $.delegateTarget2 = undefined;
   div.undelegate('span', 'click', delegateFunc2, false);   
   equal($.delegateTest2, undefined, 'Should return undefined.');
   equal($.delegateTarget2, undefined, 'Should return undefined.');
});
// 6
test('[].on:', function() {
   var radio = $('input[type=radio]').eq(0);
   var textInput = $('input[type=text]').eq(0);
   $.radioTest = false;
   $.textInput = false;
   equal([].on(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].on(function(ctx) {})), true, 'Should return an array.');
   radio.on('press', function() {
      $.radioTest = true;
   });
   equal($.radioTest, false, 'Should return false.');
   radio.trigger('press');
   equal($.radioTest, true, 'Should return true.');
   $.radioTest = false;
   equal($.radioTest, false, 'Should be false.');
   radio.trigger('press');
   equal($.radioTest, true, 'Should be true.');
   
   $('body').on('click', textInput, function() {
      $.textInput = true;
   });
   equal($.textInput, false, 'Should return false.');
   $('input[type=text]').eq(0).trigger('click');
   equal($.textInput, true, 'Should return true.');
   $.textInput = false;
   equal($.textInput, false, 'Should return true.');
   textInput.trigger('click');
   equal($.textInput, true, 'Should return true.');
});
// 7
test('[].off:', function() {
   var radio = $('input[type=radio]').eq(1);
   var checkbox = $('input[type=checkbox]', '#qunit-fixture').eq(2);
   $.radioTest = false;
   $.checkboxTest = false;
   // 1
   equal([].off(function(ctx) {}).length, 0, 'Should have length of 0.');
   // 2
   equal($.isArray([].off(function(ctx) {})), true, 'Should return an array.');
   radio.on('squeeze', function() {
      $.radioTest = true;
   });
   // 3
   //equal($.chch_cache.events.values[3][0][0], 'squeeze','Should return "squeeze".');
   radio.trigger('squeeze');
   // 4
   equal($.radioTest, true, 'Should return true.');
   radio.off('squeeze');
   $.radioTest = false;
   radio.trigger('squeeze');
   // 5
   equal($.radioTest, false, 'Should return false.');
   // 6
   equal($.chch_cache.events.values[3], undefined,'Should return undefined.');

});



