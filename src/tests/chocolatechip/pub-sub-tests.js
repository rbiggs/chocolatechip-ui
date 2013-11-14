module('Pub-sub Tests');
// 1
test('$.subscriptions should be an object.', function(){
   equal($.subscriptions instanceof Object, true, 'Should be true');
   equal($.isObject($.subscriptions), true, 'Should be true');
});
// 2
test('$.subscription test.', function(){
   var subscriber = function(topic, string) {
      if (typeof string === 'string') {
         $('#template').append('<li>String: ' + topic + ': ' + string + '</li>');
      }
   };
   var subscription = $.subscribe('news/update', subscriber);

   equal(Object.keys($.subscriptions), 'news/update', 'Should return news/update')
   equal($.isInteger($.subscriptions['news/update'][0].token), true,'$.subscriptions index token should contain an integer.');
   equal($.isInteger($.subscriptions['news/update'][0].token.toString().length), true,'$.subscriptions index token should contain 10 digits.');
   equal($.isFunction($.subscriptions['news/update'][0].callback), true,'$.subscriptions index callback should contain a function.');
   equal(Object.keys($.subscriptions)[0], 'news/update', 'Should return news/update');
   $.unsubscribe(subscription);
});
// 3
test('$.publish: push to subscribers.', function(){
   var subscriber = function(topic, string) {
      if (typeof string === 'string') {
         $('#template').append('<li>' + topic + ': ' + string + '</li>');
      }
   };
   var subscription2 = $.subscribe('news/announcement', subscriber);
   $.publish( 'news/announcement', 'The first news item!' );
   $.publish( 'news/announcement', 'The second news item!' );
   stop();
   setTimeout(function() {
      equal($.isInteger($.subscriptions['news/announcement'][0].token), true,'$.subscriptions index token should contain an integer.');
      equal($.isInteger($.subscriptions['news/announcement'][0].token.toString().length), true,'$.subscriptions index token should contain 10 digits.');
      equal($('#template').find('li').eq(0)[0].innerText, 'news/announcement: The first news item!', '');
      equal($('#template').find('li').eq(1)[0].innerText, 'news/announcement: The second news item!', '');
      equal($.isFunction($.subscriptions['news/announcement'][0].callback), true,'$.subscriptions index callback should contain a function.');
      equal(Object.keys($.subscriptions)[1], 'news/announcement', 'Should return news/announcement');
      $.unsubscribe(subscription2);
      start();
   },100);
});
// 4
test('$.unsubscribe:', function(){
   $('#template').empty();
   var subscriber = function(topic, string) {
      if (typeof string === 'string') {
         $('#template').append('<li>' + topic + ': ' + string + '</li>');
      }
   };
   var subscription3 = $.subscribe('news/alerts', subscriber);
   $.publish( 'news/alerts', 'The first alert item!' );
   $.publish( 'news/alerts', 'The second alert item!' );
   stop();
   setTimeout(function() {
      equal($.isInteger($.subscriptions['news/alerts'][0].token), true,'$.subscriptions index token should contain an integer.');
      equal($.isInteger($.subscriptions['news/alerts'][0].token.toString().length), true,'$.subscriptions index token should contain 10 digits.');
      equal($('#template').find('li').eq(0)[0].innerText, 'news/alerts: The first alert item!', 'Shouled be first alert.');
      equal($('#template').find('li').eq(1)[0].innerText, 'news/alerts: The second alert item!', 'Should be second alert.');
      equal($.isFunction($.subscriptions['news/alerts'][0].callback), true,'$.subscriptions index callback should contain a function.');
      equal(Object.keys($.subscriptions)[2], 'news/alerts', 'Should return news/alerts');
      $.unsubscribe(subscription3);

      equal($.subscriptions['news/alert'], undefined, 'Should be unsubscribed.');
      start();
   },0);
});

