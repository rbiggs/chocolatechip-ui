(function($) {
  'use strict';

  $.extend({
    ///////////////
    // Create Uuid:
    ///////////////
    Uuid : function() {
      return Date.now().toString(36);
    },

    ///////////////////////////
    // Concat array of strings:
    ///////////////////////////
    concat : function ( args ) {
      return (args instanceof Array) ? args.join('') : [].slice.apply(arguments).join('');
    },

    ////////////////////////////
    // Version of each that uses
    // regular parameter order:
    ////////////////////////////
    forEach : function ( obj, callback, args ) {
      function isArraylike( obj ) {
        var length = obj.length,
          type = jQuery.type( obj );

        if ( type === "function" || jQuery.isWindow( obj ) ) {
          return false;
        }

        if ( obj.nodeType === 1 && length ) {
          return true;
        }

        return type === "array" || length === 0 ||
          typeof length === "number" && length > 0 && ( length - 1 ) in obj;
      } 
      var value,
      i = 0,
      length = obj.length,
      isArray = isArraylike( obj );

      if ( args ) {
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback.apply( obj[ i ], args );

            if ( value === false ) {
              break;
            }
          }
        } else {
          for ( i in obj ) {
            value = callback.apply( obj[ i ], args );

            if ( value === false ) {
              break;
            }
          }
        }

      // A special, fast, case for the most common use of each
      } else {
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback.call( obj[ i ], obj[ i ], i );

            if ( value === false ) {
              break;
            }
          }
        } else {
          for ( i in obj ) {
            value = callback.call( obj[ i ], obj[ i ], i );

            if ( value === false ) {
              break;
            }
          }
        }
      }
    }
  });

  $.fn.extend({
    //////////////////////
    // Return element that 
    // matches selector:
    //////////////////////
    iz : function ( selector ) {
      var ret = $();
      this.forEach(function(ctx) {
        if ($(ctx).is(selector)) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    //////////////////////////////
    // Return element that doesn't 
    // match selector:
    //////////////////////////////
    iznt : function ( selector ) {
      return this.not(selector);
    },
 
    ///////////////////////////////////
    // Return element whose descendants 
    // match selector:
    ///////////////////////////////////
    haz : function ( selector ) {
      return this.has(selector);
    },
 
    ///////////////////////////////////
    // Return element whose descendants 
    // don't match selector:
    ///////////////////////////////////
    haznt : function ( selector ) {
      var ret = $();
      this.forEach(function(ctx) {
        if (!$(ctx).has(selector)[0]) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    //////////////////////////////////////
    // Return element that has class name:
    //////////////////////////////////////
    hazClass : function ( className ) {
      var ret = $();
      this.forEach(function(ctx) {
        if ($(ctx).hasClass(className)) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    //////////////////////////////
    // Return element that doesn't 
    // have class name:
    //////////////////////////////
    hazntClass : function ( className ) {
      var ret = $();
      this.forEach(function(ctx) {
        if (!$(ctx).hasClass(className)) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    /////////////////////////////////////
    // Return element that has attribute:
    /////////////////////////////////////
    hazAttr : function ( property ) {
      var ret = $();
      this.forEach(function(ctx){
        if ($(ctx).attr(property)) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    //////////////////////////
    // Return element that 
    // doesn't have attribute:
    //////////////////////////
    hazntAttr : function ( property ) {
      var ret = $();
      this.forEach(function(ctx){
        if (!$(ctx).attr(property)) {
          ret.push(ctx);
        }
      });
      return ret;
    },

    ////////////////////////////
    // Version of each that uses
    // regular parameter order:
    ////////////////////////////
    forEach : function ( callback, args ) {
      return $.forEach( this, callback, args );
    }
  });
})(window.jQuery);
