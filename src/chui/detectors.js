(function($) {
  "use strict";
  $.extend({
    isMobile : /mobile/img.test(navigator.userAgent),
    isTrident : /trident/img.test(navigator.userAgent),
    isIEEdge : /edge/img.test(navigator.userAgent),
    isWinPhone : (/trident/img.test(navigator.userAgent) || /edge/img.test(navigator.userAgent)) && /mobile/img.test(navigator.userAgent),
    isiPhone : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /iphone/img.test(navigator.userAgent),
    isiPad : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /ipad/img.test(navigator.userAgent),
    isiPod : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /ipod/img.test(navigator.userAgent),
    isiOS : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /ip(hone|od|ad)/img.test(navigator.userAgent),
    isAndroid : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) &&  (/android/img.test(navigator.userAgent) && !/trident/img.test(navigator.userAgent)),
    isWebOS : /webos/img.test(navigator.userAgent),
    isBlackberry : /blackberry/img.test(navigator.userAgent),
    
    isTouchEnabled : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && 'createTouch' in document,
    
    isOnline :  navigator.onLine,
    isStandalone : navigator.standalone,
    isiOS6 : !/trident/img.test(navigator.userAgent) && !$.isEdge && /OS 6/img.test(navigator.userAgent),
    isiOS7 : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /OS 7/img.test(navigator.userAgent),
    isiOS8 : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /OS 8/img.test(navigator.userAgent),
    isiOS9 : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /OS 9/img.test(navigator.userAgent),
    isWin : /edge/img.test(navigator.userAgent) || /trident/img.test(navigator.userAgent),
    isIE10 : /msie 10/img.test(navigator.userAgent),
    isIE11 : (/windows nt/img.test(navigator.userAgent) && /trident/img.test(navigator.userAgent)),
    
    isWebkit : (!/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /webkit/img.test(navigator.userAgent)),
    isDesktop : (!/mobile/img.test(navigator.userAgent)),
    isSafari : (!/edge/img.test(navigator.userAgent) && !/Chrome/img.test(navigator.userAgent) && /Safari/img.test(navigator.userAgent) && !/android/img.test(navigator.userAgent)),
    
    isChrome : !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /Chrome/img.test(navigator.userAgent) && !((/samsung/img.test(navigator.userAgent) || /Galaxy Nexus/img.test(navigator.userAgent) || /HTC/img.test(navigator.userAgent) || /LG/img.test(navigator.userAgent)) && !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) &&  /android/i.test(navigator.userAgent) && /webkit/i.test(navigator.userAgent)),
    
    isNativeAndroid : ((/samsung/img.test(navigator.userAgent) || /Galaxy Nexus/img.test(navigator.userAgent) || /HTC/img.test(navigator.userAgent) || /LG/img.test(navigator.userAgent)) && !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) &&  /android/i.test(navigator.userAgent) && /webkit/i.test(navigator.userAgent))
  });
})(window.$);