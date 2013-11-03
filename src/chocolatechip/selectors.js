   var $ = function ( selector, context ) {
      var idRE = /^#([\w-]*)$/;
      var classRE = /^\.([\w-]+)$/;
      var tagRE = /^[\w-]+$/;
      var getId = function(selector) {
         var el =  document.getElementById(selector.split('#')[1]);
         return el ? [el] : [];
      };
      var getTag = function(selector, context) {
         if (context) {
            return [].slice.apply(context.getElementsByTagName(selector)); 
         } else {
            return [].slice.apply(document.getElementsByTagName(selector));
         }
      };
      var getClass = function(selector, context) {
         if (context) {
            return [].slice.apply(context.getElementsByClassName(selector.split('.')[1]));
         } else {
            return [].slice.apply(document.getElementsByClassName(selector.split('.')[1]));
         }
      };
      var getNode = function ( selector, context ) {
         if (typeof selector === 'string') selector = selector.trim();
         if (typeof selector === 'string' && idRE.test(selector)) {
            return getId(selector);
         }
         if (selector && (selector instanceof Array) && selector.length) return selector;
         if (!context && typeof selector === 'string') {
            if (tagRE.test(selector)) {
               return getTag(selector);
            } else if (classRE.test(selector)) {
               return getClass(selector);
            } else {
               return [].slice.apply(document.querySelectorAll(selector));
            }
         } else {
            if (context) {
               return [].slice.apply(context.querySelectorAll(selector));
            } else {
               return [].slice.apply(document.querySelectorAll(selector));
            }
         }
      };
      if (typeof selector === 'undefined' || selector === document) {
         return [document];
      }
      if (selector === null) {
         return [];
      }
      if (!!context) {
         if (typeof context === 'string') {
            return [].slice.apply(document.querySelectorAll(context + ' ' + selector));
         } else if (context.nodeType === 1) {
            return getNode(selector, context);
         }
      } else if (typeof selector === 'function') {
         $.ready(function() {
            return selector.call(selector);
         });
      } else if (selector && selector.nodeType === 1) {
         return [selector];
      } else if (typeof selector === 'string') {
         if (selector === '') return [];
         if (/<\/?[^>]+>/.test(selector)) {
            return $.make(selector);
         } else {
            try {
               return getNode(selector) ? getNode(selector) : [];
            } catch(err) {
               return [];
            }
         }
      } else if (selector instanceof Array) {
         return selector;
      } else if (/NodeListConstructor/i.test(selector.constructor.toString())) {
         return [].slice.apply(selector);
      } else if (selector === window) {
         return [];
      }
      
      return this;
   };