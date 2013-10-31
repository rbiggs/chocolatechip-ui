   if (window && window.jQuery && $ === window.jQuery) {
      $.extend($, {
         make : function ( string ) {
            return $(string);
         },

         concat : function ( args ) {
            if (args instanceof Array) {
               return args.join('');
            } else {
               args = Array.prototype.slice.apply(arguments);
               return String.prototype.concat.apply(args.join(''));
            }
         },

         subscriptions : {},
      
         // Topic: string defining topic: /some/topic
         // Data: a string, number, array or object.
         subscribe : function (topic, callback) {
            if (!$.subscriptions[topic]) {
               $.subscriptions[topic] = [];
            }
            var token = ($.uuidNum());
            $.subscriptions[topic].push({
               token: token,
               callback: callback
            });
            return token;
         },
         
         unsubscribe : function ( token ) {
            setTimeout(function() {
               for (var m in $.subscriptions) {
                  if ($.subscriptions[m]) {
                      for (var i = 0, len = $.subscriptions[m].length; i < len; i++) {
                          if ($.subscriptions[m][i].token === token) {
                              $.subscriptions[m].splice(i, 1);
                              return token;
                          }
                      }
                  }
               }
               return false;
            });            
         },
         
         publish : function ( topic, args ) {
            if (!$.subscriptions[topic]) {
               return false;
            }
            setTimeout(function () {
               var len = $.subscriptions[topic] ? $.subscriptions[topic].length : 0;
               while (len--) {
                   $.subscriptions[topic][len].callback(topic, args);
               }
               return true;
            });
         },

         templates : {},
          
         template : function ( tmpl, variable ) {
            var regex, delimiterOpen, delimiterClosed;
            variable = variable ? variable : 'data';
            regex = /\[\[=([\s\S]+?)\]\]/g;
            delimiterOpen = '[[';
            delimiterClosed = ']]'; 
            var template =  new Function(variable, 
               "var p=[];" + "p.push('" + tmpl
               .replace(/[\r\t\n]/g, " ")
               .split("'").join("\\'")
               .replace(regex,"',$1,'")
               .split(delimiterOpen).join("');")
               .split(delimiterClosed).join("p.push('") + "');" +
               "return p.join('');");
            return template;
         },
         isiPhone : /iphone/img.test(navigator.userAgent),
         isiPad : /ipad/img.test(navigator.userAgent),
         isiPod : /ipod/img.test(navigator.userAgent),
         isiOS : /ip(hone|od|ad)/img.test(navigator.userAgent),
         isAndroid : (/android/img.test(navigator.userAgent) && !/trident/img.test(navigator.userAgent)),
         isWebOS : /webos/img.test(navigator.userAgent),
         isBlackberry : /blackberry/img.test(navigator.userAgent),
         isTouchEnabled : ('createTouch' in document),
         isOnline :  navigator.onLine,
         isStandalone : navigator.standalone,
         isiOS6 : navigator.userAgent.match(/OS 6/i),
         isiOS7 : navigator.userAgent.match(/OS 7/i),
         isWin : /trident/img.test(navigator.userAgent),
         isWinPhone : (/trident/img.test(navigator.userAgent) && /mobile/img.test(navigator.userAgent)),
         isIE10 : navigator.userAgent.match(/msie 10/i),
         isIE11 : navigator.userAgent.match(/msie 11/i),
         isWebkit : navigator.userAgent.match(/webkit/),
         isMobile : /mobile/img.test(navigator.userAgent),
         isDesktop : !(/mobile/img.test(navigator.userAgent)),
         isSafari : (!/Chrome/img.test(navigator.userAgent) && /Safari/img.test(navigator.userAgent)),
         isChrome : /chrome/i.test(navigator.userAgent)
      });
   }