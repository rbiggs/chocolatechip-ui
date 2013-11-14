module('feature Tests');
// 1
test('Test for iPhone in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isiPhone = /iphone/img.test(userAgent);
   equal(isiPhone, true, 'Should return true.');
});
// 2
test('Test for iPad in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPad; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isiPad = /ipad/img.test(userAgent);
   equal(isiPad, true, 'Should return true.');
});
// 3
test('Test for iPod in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPod; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isiPod = /ipod/img.test(userAgent);
   equal(isiPod, true, 'Should return true.');
});
// 4
test('Test for iOS in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isiOS = /ip(hone|od|ad)/img.test(userAgent);
   equal(isiOS, true, 'Should return true.');
});
// 5
test('Test for Android in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19';
   var isAndroid = /android/img.test(userAgent);
   equal(isAndroid, true, 'Should return true.');
});
// 6
test('Test for WebOS in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (webOS/1.4.0; U; en-US) AppleWebKit/532.2 (KHTML, like Gecko) Version/1.0 Safari/532.2 Pre/1.1';
   var isWebOS = /webos/img.test(userAgent);
   equal(isWebOS, true, 'Should return true.');
});
// 7
test('Test for Blackberry in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ ( KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+';
   var isBlackberry = /blackberry/img.test(userAgent);
   equal(isBlackberry, true, 'Should return true.');
});
// 8
test('Test for online status in user agent string.', function(){
   var navigator = {};
   navigator.onLine = true;
   var isOnline = navigator.onLine;
   equal(isOnline, true, 'Should return true.');
});
// 9
test('Test for iOS 6 in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
   var isiOS6 = /OS 6/img.test(userAgent);
   equal(isiOS6, true, 'Should return true.');
});
// 10
test('Test for iOS 7 in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isiOS7 = /OS 7/img.test(userAgent);
   equal(isiOS7, true, 'Should return true.');
});
// 11
test('Test for Windows in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
   var isWin = /trident/img.test(userAgent);
   equal(isWin, true, 'Should return true.');
});
// 12
test('Test for Windows Phone in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; ARM; Touch; IEMobile/10.0;';
   var isWinPhone = /trident/img.test(userAgent) && /mobile/img.test(userAgent);
   equal(isWinPhone, true, 'Should return true.');
});
// 13
test('Test for IE 10 in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; ARM; Touch; IEMobile/10.0;';
   var isIE10 = /trident/img.test(userAgent) && /msie 10/img.test(userAgent);
   equal(isIE10, true, 'Should return true.');
});
// 14
test('Test for IE 11 in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
   var isIE11 = /trident/img.test(userAgent) && /rv\:11/img.test(userAgent);
   equal(isIE11, true, 'Should return true.');
});
// 15
test('Test for Webkit in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isWebkit = /webkit/img.test(userAgent);
   equal(isWebkit, true, 'Should return true.');
});
// 16
test('Test for mobile in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isMobile = /mobile/img.test(userAgent);
   equal(isMobile, true, 'Should return true.');
});
// 17
test('Test for desktop from user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71';
   var isDesktop = (!/mobile/img.test(userAgent));
   equal(isDesktop, true, 'Should return true.');
});
// 18
test('Test for Safari in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
   var isSafari = (!/chrome/img.test(userAgent) && /safari/img.test(userAgent));
   equal(isSafari, true, 'Should return true.');
});
// 19
test('Test for Chrome in user agent string.', function(){
   var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36';
   var isChrome = /chrome/img.test(userAgent);
   equal(isChrome, true, 'Should return true.');
});
