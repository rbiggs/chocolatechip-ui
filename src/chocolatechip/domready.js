   $.extend($, {
      DOMReadyList : [],
      
      executeWhenDOMReady : function ( ) {
         var listLen = $.DOMReadyList.length;
         var i = 0;
         while (i < listLen) {
            $.DOMReadyList[i]();
            i++;
         }
         $.DOMReadyList = [];
         document.removeEventListener('DOMContentLoaded', $.executeWhenDOMReady, false);
      },
      
      ready : function ( callback ) {
          if (document.getElementsByTagName('body')[0]) {
             callback();
          } else {
          if ($.DOMReadyList.length === 0) {
            document.addEventListener('DOMContentLoaded', $.executeWhenDOMReady, false);
          }
      
          $.DOMReadyList.push(callback);
         }
      }
   });