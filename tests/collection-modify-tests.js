module('Collection-Modify Tests');

// 1
test('[].css:', function() {
   var item = $('#listitem');
   var list = $('#ul');
   equal([].css(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].css(function(ctx) {})), true, 'Should return an array.');
   equal(item.css('color'), 'rgb(255, 0, 0)', 'Should return rgb(255, 0, 0).');
   equal(item.css('background-color'), 'rgb(255, 255, 0)', 'Should return rgb(255, 255, 0).');
   equal(item.css('width'), '200px', 'Should return 200px.');
   equal(item.css('height'), '200px', 'Should return 200px.');
   equal(item.css('padding'), '20px', 'Should return 20px;');
   equal(item.css('border-color'), 'rgb(0, 128, 0)', 'Should be rgb(0, 128, 0).');
   equal(item.css('border-radius'), '20px', 'Should be 20px.');
   list.css('width', '300px');
   equal(list.css('width'), '300px', 'Should be 300px.');
   list.css('height', '150px');
   equal(list.css('height'), '150px', 'Should be 150px.');
   list.css({color: 'green', 'background-color': 'orange'});
   equal(list.css('color'), 'rgb(0, 128, 0)', 'Should be rgb(0, 128, 0).');
   equal(list.css('background-color'), 'rgb(255, 165, 0)', 'Should be rgb(255, 165, 0).');
});
//2
test('[].width:', function() {
   var item = $('#listitem');
   equal([].width(), undefined, 'Should be undefined.');
   equal(item.width(), item[0].clientWidth, 'Should be .');
});
//3
test('[].height:', function() {
   var item = $('#listitem');
   equal([].height(), undefined, 'Should be undefined.');
   equal(item.height(), item[0].clientHeight, 'Should be .');
});
// 4
test('[].offset:', function() {
   equal([].offset(), undefined, 'Should return undefined.');
   $(function() {
      var span = $('#qunit-testresult').find('span');
      var offset = span.offset();
      equal($.isNumber(offset.top), true, 'Top should be a number.');
      equal($.isInteger(offset.top), true, 'Top should be an integer.');
      equal($.isNumber(offset.bottom), true, 'Top should be a number.');
      equal($.isInteger(offset.bottom), true, 'Top should be an integer.');
      equal($.isNumber(offset.left), true, 'Top should be a number.');
      equal($.isInteger(offset.left), true, 'Top should be an integer.');
      equal($.isNumber(offset.right), true, 'Top should be a number.');
      equal($.isInteger(offset.right), true, 'Top should be an integer.');
   });
});
// 5
test('[].prepend:', function() {
   var list = $('#ul');
   equal([].prependTo(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].prependTo(function(ctx) {})), true, 'Should return an array.');
   var a = list.prepend('<li id="kittens">Fuzzy kittens</li>');
   equal($.isArray(a), true, 'Should return an array.');
   equal(a.length, 1, 'Should be an array with a length of 1.');
   equal(list.first()[0].id, 'kittens', 'Should return an id of kittens.');
   equal(list.first().text(), 'Fuzzy kittens', 'Should return "Fuzzy kittens".');
   var a2 = list.first().prepend('Attention: ');
   equal($.isArray(a2), true, 'Should return an array.');
   equal(a2.length, 1, 'Should return an array with length of 1.');
   equal(list.first().text(), 'Attention: Fuzzy kittens', 'Should return "Attention: Fuzzy kittens".');
});
// 6
test('[].append:', function() {
   var list = $('#ul');
   equal([].appendTo(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].appendTo(function(ctx) {})), true, 'Should return an array.');
   var a = list.append('<li id="puppies">Cuddly puppies</li>');
   equal($.isArray(a), true, 'Should return an array.');
   equal(a.length, 1, 'Should return an array with length of 1.');
   equal(list.last()[0].id, 'puppies', 'Should return an id of "puppies".');
   equal(list.last().text(), 'Cuddly puppies', 'Should return "Cuddly puppies".');
   var a2 = list.last().append(': so cute!');
   equal($.isArray(a2), true, 'Should return an array.');
   equal(a2.length, 1, 'Should return an array with length of 1.');
   equal(list.last().text(), 'Cuddly puppies: so cute!', 'Should return "Cuddly puppies: so cute!".');
});
// 7
test('[].before:', function() {
   var list = $('#ul');
   equal([].before(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].before(function(ctx) {})), true, 'Should return an array.');
   var a = list.before('<p id="beforeList">This is before the list.</p>');
   equal($.isArray(a), true, 'Should return an array.');
   equal(a.length, 1, 'Should return an array with length 1.');
   equal(a.prev()[0].id, 'beforeList', 'Should return the id "beforeList".');
   equal(a.prev().text(), 'This is before the list.', 'Should return: "This is before the list."');
   var a2 = list.before();
   equal($.isArray(a2), true, 'Should return an array.');
   equal(a2.length, 1, 'Should return the element event though no argument was passed.');
});
// 8
test('[].after:', function() {
   var list = $('#ul');
   equal([].after(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].after(function(ctx) {})), true, 'Should return an array.');
   var a = list.after('<p id="afterList">This is after the list.</p>');
   equal($.isArray(a), true, 'Should return an array.');
   equal(a.length, 1, 'Should return an array with length 1.');
   equal(a.next()[0].id, 'afterList', 'Should return the id "afterList".')
   equal(a.next().text(), 'This is after the list.', 'Should return "This is after the list."');
   var a2 = list.after();
   equal($.isArray(a2), true, 'Should return an array.');
   equal(a2.length, 1, 'Should return the element event though no argument was passed.');
});
// 9
test('[].appendTo:', function() {
   var item = $('#setEvent');
   var newItem = $('<p id="appendedTo">This was appended to the div.</p>').appendTo(item);
   equal($.isArray(newItem), true, 'Should return an array.');
   equal(newItem.length, 1, 'Should return an array with length of 1.');
   equal(newItem[0].nodeName, 'P', 'Should return a new P element.');
   equal(newItem[0].id, 'appendedTo', 'Should return id of "appendedTo".');
   equal(newItem.text(), 'This was appended to the div.', 'Should return "This was appended to the div."');
});
// 10
test('[].prependTo:', function() {
   var item = $('#setEvent');
   var newItem = $('<p id="prependTo">This was prepended to the div.</p>').prependTo(item);
   equal($.isArray(newItem), true, 'Should return an array.');
   equal(newItem.length, 1, 'Should return an array with length of 1.');
   equal(newItem[0].nodeName, 'P', 'Should return a new P element.');
   equal(newItem[0].id, 'prependTo', 'Should return id of "prependTo".');
   equal(newItem.text(), 'This was prepended to the div.', 'Should return "This was prepended to the div."');
});
// 11
test('[].text:', function() {
   var list = $('#ul');
   equal([].text(function(ctx) {}).length, 0, 'Should have length of 0.');
   equal($.isArray([].text(function(ctx) {})), true, 'Should return an array.');
   var text = list.first().text();
   equal(text, 'a', 'Should return "a".');
   var a = list.first().text('New stuff here!');
   equal($.isArray(a), true, 'Should return an array.');
   equal(a.length, 1, 'Should return an array with length of 1.');
   equal(a.text(), 'New stuff here!', 'Should return "New stuff here!"');
});
// 12
test('[].insert:', function() {
   equal([].insert().length, 0, 'Should have length of 0.');
   equal($.isArray([].insert()), true, 'Should return an array.');
   var list = $('#ul');
   list.insert('<li id="first">First</li>', 'first');
   equal(list.first()[0].id, 'first', 'Should return id of "first".');
   equal(list.first().text(), 'First', 'Should return "First".');
   list.insert('<li id="first2">First 2</li>', 1);
   equal(list.first()[0].id, 'first2', 'Should return id of first2.');
   list.insert('<li id="last">last one</li>', 'last');
   equal(list.last()[0].id, 'last', 'Should return id of "last".');
   list.insert('<li id="last2">Last of All</li>', 'last');
   equal(list.last()[0].id, 'last2', 'Should return id of "last2".');
   list.insert('<li id="third">third</li>', 3);
   equal($('#third').index(), 2, 'Should be 3rd child.');
   equal(list.children().eq(2)[0].id, 'third', 'Should have id of "third".');
});
//13
test('[].html:', function() {
   var list = $('#ul');
   equal([].insert().length, 0, 'Should have length of 0.');
   equal($.isArray([].insert()), true, 'Should return an array.');
   equal(list.first().html(), 'a', 'Should be .');
   list.first().html('z');
   equal(list.first().html(), 'z', 'Should be "z".');
   var a = list.last().html();
   equal($.isArray(a), false, 'Should not return an array.');
   equal(a, '<span>c</span>', 'Should return <span>c</span>.');
   equal(typeof a === 'string', true, 'Should return a string of content.');
   list.children(-2).html('<strong>Very Strong!</strong>');
   equal(list.children(-2).html(), '<strong>Very Strong!</strong>', 'Should return "<strong>Very Strong!</strong>"');
});
// 14
test('[].attr:', function() {
   var box = $('#qunit-fixture');
   equal([].attr().length, 0, 'Should have length of 0.');
   equal($.isArray([].attr()), true, 'Should return an array.');
   var textInput = $('input[type=text]');
   equal(textInput.attr('type'), 'text', 'Should return "text".');
   textInput.attr('type','textarea');
   equal(textInput.attr('type'), 'textarea', 'Should return "textarea".');
   equal($('input[type=checkbox]', '#qunit-fixture').eq(0).attr('checked'), '', 'Should return "undefined".');
   equal($('input[type=checkbox]', '#qunit-fixture').eq(0).attr('value'), 'apples', 'Should return "apples".');
   $('input').attr('test','TRUE');
   var passed = $('input').every(function(input) {
      return $(input).attr('test') === 'TRUE';
   });
   equal(passed, true, 'Should return true.');
   var radio = $('input[type=radio]').every(function(input) {
      return $(input).attr('name') === 'radio';
   });
   equal(radio, true, 'Should return true.');
   var checkbox = $('input[type=checkbox]').some(function(input) {
      return $(input).attr('class') === 'apples';
   });
   equal(checkbox, true, 'Should return true.');
   equal($('#ul').attr('title'), 'list', 'Should return "list".');
   $('#ul').attr('title', 'changed title');
   equal($('#ul').attr('title'), 'changed title', 'Should return "changed title".');
});
// 15
test('[].hasAttr:', function() {
   equal([].hasAttr().length, 0, 'Should have length of 0.');
   equal($.isArray([].hasAttr()), true, 'Should return an array.');
   equal($('#ul').hasAttr('title')[0].nodeName, 'UL', 'Should return the node.');
   var checkbox = $('#ul > li').eq(-1).hasAttr('visited');
   equal($.isArray(checkbox), true, 'Should return an array.');
   equal(checkbox.length, 0, 'Should return an array with length of 0.');
   var radio = $('#qunit-fixture input[type=radio]').hasAttr('name');
   equal($.isArray(radio), true, 'Should return an array.');
   equal(radio.length, 3, 'Should return the length 3.');
   equal(radio.eq(1).val(), 'zinfandel', 'Should return value "zinfandel".')
});
// 16
test('[].removeAttr:', function() {
   equal([].removeAttr().length, 0, 'Should have length of 0.');
   equal($.isArray([].removeAttr()), true, 'Should return an array.');
   var list = $('#ul');
   equal(list.last().hasAttr('disabled').length, 1, 'Should return 1.');
   list.last().removeAttr('disabled');
   equal(list.last().hasAttr('disabled').length, 0, 'Should return 0.');
   equal($('#setEvent').hasAttr('class').length, 1, 'Should return 1');
   $('#setEvent').removeAttr('class');
   equal($('#setEvent').hasAttr('class').length, 0, 'Should return 0');
});
// 17
test('[].hasClass:', function() {
   equal([].hasClass().length, 0, 'Should have length of 0.');
   equal($.isArray([].hasClass()), true, 'Should return an array.');
   equal($('#ul').hasClass('ul').length, 1, 'Should return 1.');
   equal($('#ul').hasClass('list').length, 0, 'Should return 0.');
   equal($('#setEvent').hasClass('whatever boring').length, 1, 'Should return 1.');
   equal($('#setEvent').hasClass('something else here'), 0, 'Should return 0.');
});
// 18
test('[].addClass:', function() {
   var list = $('#ul');
   equal([].addClass().length, 0, 'Should have length of 0.');
   equal($.isArray([].addClass()), true, 'Should return an array.');
   list.addClass('list');
   equal($.isArray(list.hasClass('list')), true, 'Should return an array.');
   equal(list.hasClass('list').length, 1, 'Should return length 1.');
   list.addClass('double name');
   equal($.isArray(list.hasClass('double name')), true, 'Should return an array.');
   list.last().find('span').addClass('This is a span');
   equal($.isArray(list.last().find('span').hasClass('This is a span')), true, 'Should return an array.');
   equal(list.last().find('span').hasClass('This is a span').length, 1, 'Should return 1.');
});
// 19
test('[].removeClass:', function() {
   var list = $('#ul');
   equal([].removeClass().length, 0, 'Should have length of 0.');
   equal($.isArray([].removeClass()), true, 'Should return an array.');
   list.last().find('span').addClass('This is a span');
   equal($.isArray(list.last().find('span').hasClass('This is a span')), true, 'Should return an array.');
   equal(list.last().find('span').hasClass('This is a span').length, 1, 'Should return 1.');
   list.last().find('span').removeClass('This is a span');
   equal(list.last().find('span').hasClass('This is a span').length, 0, 'Should return 0.');
   list.addClass('anAdditionalClass');
   equal($.isArray(list.hasClass('anAdditionalClass')), true , 'Should return an array.');
   equal(list.hasClass('anAdditionalClass').length, 1, 'Should return array with length 1.');
   var ret = list.removeClass('no-class');
   equal($.isArray(ret), true, 'Should return an array.');
   equal(ret.length, 1, 'Should return 1');
});
// 20
test('[].toggleClass:', function() {
   var list = $('#ul');
   equal([].toggleClass().length, 0, 'Should have length of 0.');
   equal($.isArray([].toggleClass()), true, 'Should return an array.');
   equal(list.hasClass('ul').length, 1, 'Should return 1.');
   list.toggleClass('ul');
   equal(list.hasClass('ul').length, 0, 'Should return 0.');
   list.toggleClass('ul');
   equal(list.hasClass('ul').length, 1, 'Should return 1.');
   list.toggleClass('ul');
   equal(list.hasClass('ul').length, 0, 'Should return 0.');
   list.toggleClass('ul');
   equal(list.hasClass('ul').length, 1, 'Should return 1.');
   list.toggleClass('toggled');
   equal(list.hasClass('toggled').length, 1, 'Should return 1.');
   list.toggleClass('toggled');
   equal(list.hasClass('toggled').length, 0, 'Should return 0.');
   list.toggleClass('toggled');
   equal(list.hasClass('toggled').length, 1, 'Should return 1.');
   list.toggleClass('toggled');
   equal(list.hasClass('toggled').length, 0, 'Should return 0.');
});
// 21
test('[].val:', function() {
   equal([].val().length, 0, 'Should have length of 0.');
   equal($.isArray([].val()), true, 'Should return an array.');
   var checkboxes = $('input[type=checkbox]', '#qunit-fixture');
   equal(checkboxes.eq(0).val(), 'apples', 'Should return apples.');
   equal(checkboxes.eq(1).val(), 'oranges', 'Should return oranges.');
   var radios = $('input[type=radio]', '#qunit-fixture');
   equal(radios.eq(0).val(), 'chardonay', 'Should return chardonay.');
   equal(radios.eq(1).val(), 'zinfandel', 'Should return zinfandel.');
   equal(radios.eq(2).val(), 'merlot', 'Should return merlot.');
   checkboxes.eq(0).val('mangos');
   checkboxes.eq(1).val('coconuts');
   equal(checkboxes.eq(0).val(), 'mangos', 'Should return mangos.');
   equal(checkboxes.eq(1).val(), 'coconuts', 'Should return coconuts.');
   radios.eq(0).val('milk');
   radios.eq(1).val('cheese');
   radios.eq(2).val('butter');
});
// 22
test('[].disable:', function() {
   equal([].disable().length, 0, 'Should have length of 0.');
   equal($.isArray([].disable()), true, 'Should return an array.');
   var checkboxes = $('input[type=checkbox]', '#qunit-fixture');
   checkboxes.eq(0).disable();
   equal(checkboxes.eq(0).hasClass('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(0).hasAttr('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(0).css('cursor'), 'default', 'Should return "default".');
   checkboxes.eq(0).removeClass('disabled');
   checkboxes.eq(0).removeAttr('disabled');
   checkboxes.disable();
   equal(checkboxes.eq(0).hasClass('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(0).hasAttr('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(0).css('cursor'), 'default', 'Should return "default".');
   equal(checkboxes.eq(1).hasClass('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(1).hasAttr('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(1).css('cursor'), 'default', 'Should return "default".');
});
// 23
test('[].enable:', function() {
   equal([].enable().length, 0, 'Should have length of 0.');
   equal($.isArray([].enable()), true, 'Should return an array.');
   var checkboxes = $('input[type=checkbox]', '#qunit-fixture');
   checkboxes.disable();
   equal(checkboxes.eq(0).hasClass('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(0).hasAttr('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(0).css('cursor'), 'default', 'Should return "default".');
   equal(checkboxes.eq(1).hasClass('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(1).hasAttr('disabled').length, 1, 'Should return 1.');
   equal(checkboxes.eq(1).css('cursor'), 'default', 'Should return "default".');
   checkboxes.enable();
   equal(checkboxes.eq(0).hasClass('disabled').length, 0, 'Should return 0.');
   equal(checkboxes.eq(0).hasAttr('disabled').length, 0, 'Should return 0.');
   equal(checkboxes.eq(0).css('cursor'), 'auto', 'Should return "auto".');
   equal(checkboxes.eq(1).hasClass('disabled').length, 0, 'Should return 0.');
   equal(checkboxes.eq(1).hasAttr('disabled').length, 0, 'Should return 0.');
   equal(checkboxes.eq(1).css('cursor'), 'auto', 'Should return "auto".');
});





