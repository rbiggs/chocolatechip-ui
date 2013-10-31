   $.extend({
 
      version : '3.0.5',
      
      libraryName : 'ChocolateChip',
      
      slice : Array.prototype.slice,
      
      make : function ( HTMLString ) {
         var temp = document.createElement('div');
         temp.innerHTML = HTMLString;
         return $.slice.apply(temp.childNodes);
      },
      
      html : function ( HTMLString ) {
         return this.make(HTMLString);
      },
       
      replace : function ( newElem, oldElem ) {
         if (!newElem || !oldElem) return;
          newElem = newElem.length ? newElem[0] : newElem;
          oldElem = oldElem.length ? oldElem[0] : oldElem;
          oldElem.parentNode.replaceChild(newElem, oldElem);
          return;
      },
      
      require : function( src, callback ) {
         callback = callback || $.noop;
         var script = document.createElement('script');
         script.setAttribute('type', 'text/javascript');
         script.setAttribute('src', src);
         script.onload = script.onreadystatechange = function() {
            if (!script.readyState || script.readyState === 'complete') {
               callback.apply(callback, arguments);
            }
         };
         $('head').insert(script, 'last');
      },
       
      processJSON : function ( data, name ) {
         if (name !== null || name !== undefined) {
            name = 'var ' + name + ' = ';
         } else {
            name = 'var data = ';
         }
         var script = document.createElement('script');
         script.setAttribute('type', 'text/javascript');
         var scriptID = "_" + $.uuidNum();
         script.setAttribute('id', scriptID);
         script.html(name + data);
         $('head').append(script);
         $.defer(function() {
            var id = '#' + scriptID;
            $(id).remove();
         });
      },
             
      delay : function ( fnc, time ) {
         fnc = fnc || $.noop;
         setTimeout(function() { 
            fnc.call(fnc); 
         }, time);
      },
       
      defer : function ( fnc ) {
         fnc = fnc || $.noop;
         return $.delay.apply($, [fnc, 1].concat($.slice.call(arguments, 1)));
      },
      
      noop : function ( ) { },
      
      concat : function ( args ) {
         if (args instanceof Array) {
            return args.join('');
         } else if (args instanceof Object) {
            return;
         } else {
            args = $.slice.apply(arguments);
            return String.prototype.concat.apply(args.join(''));
         }
      },
      
      w : function ( str ) {
         return str.split(' ');
      },
      
      isString : function ( str ) {
         return typeof str === 'string';
      },
      
      isArray : function ( array ) {
         return Array.isArray( array );
      },
      
      isFunction : function ( fn ) {
         return Object.prototype.toString.call(fn) === '[object Function]';
      },
      
      isObject : function ( obj ) {
         return Object.prototype.toString.call(obj) === '[object Object]';
      },
      
      isNumber : function ( number ) {
         return typeof number === 'number';
      },
      
      isInteger : function ( number ) {
         return (typeof number === 'number' && number % 1 === 0);
      },
      
      isFloat : function ( number ) {
         return (typeof number === 'number' && number % 1 !== 0);
      },
      
      uuidNum : function ( ) {
         return Math.floor(((1 + Math.random()) * 0x100000000));
      },
      
      makeUuid : function ( ) {
         return $.concat("chch_", $.uuid);
      },
      
      uuid : 0,
      
      chch_cache : {},
      
      fn : {}
      
   });