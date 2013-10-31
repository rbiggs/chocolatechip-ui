   $.extend($, {
      camelize : function ( string ) {
         if (typeof string !== 'string') return;
         return string.replace(/\-(.)/g, function(match, letter){return letter.toUpperCase();});
      },
      
      deCamelize : function ( string ) {
         if (typeof string !== 'string') return;
         return string.replace(/([A-Z])/g, '-$1').toLowerCase();
      },
      
      capitalize : function ( string, all ) {
         if (!string) {
            return;
         }
         if (typeof string !== 'string') return;
         if (all) {
            var str = string.split(' ');
            var newstr = [];
            str.each(function(item) {
               newstr.push($.capitalize(item));
            });
            return newstr.join(' ');
         } else {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
         }
      }
   });