module('Template Tests');
// 1
test('$.templates should be an object.', function(){
   equal($.isObject($.templates), true, 'Should return true.')
});
// 2
test('$.templates should be an empty object.', function(){
   equal(Object.keys($.templates).length, 0, 'Should have no length.')
});
// 3
test('$.templates should have template named tmpl8_1.', function() {
   stop();
   $.templates.tmpl8_1 = '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>';
   var data = [{name: 'Joe', age: 100},{name: 'Sam', age: 5},{name: 'Tom', age: 32}];
   var parseTmpl8_1 = $.template($.templates.tmpl8_1);
   var list = $('#template');
   list.empty();
   data.forEach(function(ctx) {
      list.append(parseTmpl8_1(ctx));
   });
   var result = $('#template');
   var templ8_1 = $('#template').html();
   start();
   
   equal(Object.keys($.templates).length, 1, '$.template should have a length of 1');
   equal(Object.keys($.templates)[0], 'tmpl8_1', '$.templates.tmpl8_1 should be true.')
   equal($.templates.tmpl8_1, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal(result[0].childNodes.length, 3, 'List should have three child nodes');
});
// 4
test('$.template() should parse string template', function() {
   stop();
   $.templates.tmpl8_2 = '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>';
   var data = [{name: 'Joe', age: 100},{name: 'Sam', age: 5},{name: 'Tom', age: 32}];
   var parseTmpl8_2 = $.template($.templates.tmpl8_2);
   var list = $('#template');
   list.empty();
   data.forEach(function(ctx) {
      list.append(parseTmpl8_2(ctx));
   });
   var result = $('#template');
   var templ8_2 = $('#template').html();
   start();

   equal(Object.keys($.templates)[0], 'tmpl8_1', '$.templates.tmpl8_1 should be true');
   equal(Object.keys($.templates)[1], 'tmpl8_2', '$.templates.tmpl8_2 should be true');
   equal($.templates.tmpl8_1, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal($.templates.tmpl8_2, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal(result[0].children.length, 3, 'List should have three child nodes');
   equal(result[0].firstElementChild.innerHTML, '<h3>Joe</h3><h4>100</h4>', 'First list item should be: <h3>Joe</h3><h4>100</h4>');
   equal(result[0].lastElementChild.innerHTML, '<h3>Tom</h3><h4>32</h4>', 'First list item should be: <h3>Tom</h3><h4>32</h4>');
});
// 5
test('$.template() should render correct ouput.', function() {
   stop();
   $.templates.tmpl8_3 = '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>';
   var data = [{name: 'Joe', age: 100},{name: 'Sam', age: 5},{name: 'Tom', age: 32}];
   var parseTmpl8_3 = $.template($.templates.tmpl8_3);
   var list = $('#template');
   list.empty();
   data.forEach(function(ctx) {
      list.append(parseTmpl8_3(ctx));
   });
   var result = $('#template');
   var templ8_3 = $('#template').html();
   start();
   equal(Object.keys($.templates)[0], 'tmpl8_1', '$.templates.tmpl8_1 should be true');
   equal(Object.keys($.templates)[1], 'tmpl8_2', '$.templates.tmpl8_2 should be true');
   equal(Object.keys($.templates)[2], 'tmpl8_3', '$.templates.tmpl8_3 should be true');
   equal($.templates.tmpl8_1, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal($.templates.tmpl8_2, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal($.templates.tmpl8_3, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal(templ8_3.trim(), '<li><h3>Joe</h3><h4>100</h4></li><li><h3>Sam</h3><h4>5</h4></li><li><h3>Tom</h3><h4>32</h4></li>', 'Shoud be the full rendered template.');
   equal(result[0].children.length, 3, 'List should have three child nodes');
   equal(result[0].firstElementChild.innerHTML, '<h3>Joe</h3><h4>100</h4>', 'First list item should be: <h3>Joe</h3><h4>100</h4>');
   equal(result[0].lastElementChild.innerHTML, '<h3>Tom</h3><h4>32</h4>', 'First list item should be: <h3>Tom</h3><h4>32</h4>');
});
// 6
test('$.template() should parse custom data variable.', function() {
   stop();
   $.templates.tmpl8_4 = '<li><h3>[[= bozo.name ]]</h3><h4>[[= bozo.age ]]</h4></li>';
   var data = [{name: 'Joe', age: 100},{name: 'Sam', age: 5},{name: 'Tom', age: 32}];
   var parseTmpl8_4 = $.template($.templates.tmpl8_4, 'bozo');
   var list = $('#template');
   list.empty();
   data.forEach(function(ctx) {
      list.append(parseTmpl8_4(ctx));
   });
   var result = $('#template');
   var templ8_4 = $('#template').html();
   start();
   
   equal(Object.keys($.templates)[0], 'tmpl8_1', '$.templates.tmpl8_1 should be true');
   equal(Object.keys($.templates)[1], 'tmpl8_2', '$.templates.tmpl8_2 should be true');
   equal(Object.keys($.templates)[2], 'tmpl8_3', '$.templates.tmpl8_3 should be true');
   equal(Object.keys($.templates)[3], 'tmpl8_4', '$.templates.tmpl8_4 should be true');
   equal($.templates.tmpl8_1, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal($.templates.tmpl8_2, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal($.templates.tmpl8_3, '<li><h3>[[= data.name ]]</h3><h4>[[= data.age ]]</h4></li>','Should be holding the string template.');
   equal($.templates.tmpl8_4, '<li><h3>[[= bozo.name ]]</h3><h4>[[= bozo.age ]]</h4></li>','Should be holding the string template.');
   equal(result[0].children.length, 3, 'List should have three child nodes');
   equal(result[0].firstElementChild.innerHTML, '<h3>Joe</h3><h4>100</h4>', 'First list item should be: <h3>Joe</h3><h4>100</h4>');
   equal(result[0].lastElementChild.innerHTML, '<h3>Tom</h3><h4>32</h4>', 'First list item should be: <h3>Tom</h3><h4>32</h4>');
});



