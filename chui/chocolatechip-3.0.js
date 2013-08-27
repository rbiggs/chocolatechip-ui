/*      
    pO\     
   6  /\
     /OO\
    /OOOO\
  /OOOOOOOO\
 ((OOOOOOOO))
  \:~=++=~:/ 
      
ChocolateChip.js: It's tiny but delicious.
Copyright 2013 Sourcebits www.sourcebits.com
License: BSD
Version: 3.0
*/

(function() {
   'use strict';
   
   // Method to validate the results of an operation before returning it:
   var returnResult = function ( result ) {
      if (result.length && result[0] === undefined) return [];
      if (result.length) return result;
      else return [];
   };
   var $ = function ( selector, context ) {
      var idRE = /^#([\w-]*)$/;
      var classRE = /^\.([\w-]+)$/;
      var tagRE = /^[\w-]+$/;
      var getId = function(selector) {
         return  [document.getElementById(selector.split('#')[1])];
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
         selector = selector.trim();
         if (idRE.test(selector)) {
            return getId(selector);
         } else if (tagRE.test(selector)) {
            return getTag(selector, context);
         } else if (classRE.test(selector)) {
            return getClass(selector, context) ;
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
      if (!!context) {
         if (typeof context === 'string') {
            return [].slice.apply(document.querySelectorAll(context + ' ' + selector));
         } else if (context.nodeType === 1) {
            return getNode(selector);
         }
      } else if (typeof selector === 'function') {
         $.ready(function() {
            return selector.call(selector);
         });
      } else if (selector.nodeType === 1) {
         return [selector];
      } else if (typeof selector === 'string') {
         if (/<\/?[^>]+>/.test(selector)) {
            return $.make(selector);
         } else {
            return getNode(selector);
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
   $.extend = function(obj, prop, enumerable) {
      enumerable = enumerable || false;
      if (!prop) {
         prop = obj;
         obj = $;
      }
      Object.keys(prop).forEach(function(p) {
         if (prop.hasOwnProperty(p)) {
            Object.defineProperty(obj, p, {
               value: prop[p],
               writable: true,
               enumerable: enumerable,
               configurable: true
            });
         }
      });
      return this;
   };
   
   $.extend({
 
      version : '3.0',
      
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
         var scriptID = $.UIUuid();
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
         } else {
            args = $.slice.apply(arguments);
            return String.prototype.concat.apply(args.join(''));
         }
      },
      
      w : function ( str ) {
         return str.split(' ');
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
         return ((1 + Math.random()) * 0x100000000);
      },
      
      makeUuid : function ( ) {
         return $.concat("chch_", $.uuid);
      },
      
      uuid : 0,
      
      chch_cache : {},
      
      fn : Array.prototype
      
   });
   $.fn.extend = function ( object ) {
      return $.extend($.fn, object);
   };
   
   $.uuid = $.uuidNum();
   
   $.chch_cache.data = {};
   
   $.chch_cache.events = {};
   
   $.extend($.chch_cache.events, {
   
      keys : [],
      
      values : [],
      
      set : function ( element, event, callback, capturePhase ) {
         var key;
         var length = this.values.length > 0 ? this.values.length - 1 : 0;
         var values;
         if (!!element.id) {
            key = element.id;
         } else {
            ++$.uuid;
            key = $.makeUuid();
            element.setAttribute("id", key);
         }
         if (this.keys.indexOf(key) >= 0) {
            this.values[length].push([]);
            values = this.values[length];
            values.push(event);
            values.push(callback);
            values.push(capturePhase);
            element.addEventListener(event,callback,capturePhase);
         } else {
            this.keys.push(key);
            this.values.push([]);
            length = this.values.length-1;
            this.values[length].push([]);
            values = this.values[length];
            values[0].push(event);
            values[0].push(callback);
            values[0].push(capturePhase);
            element.addEventListener(event,callback,capturePhase);
         }
      },
      
      
      hasKey : function ( key ) {
         if (this.keys.indexOf(key) >= 0) { 
            return true; 
         } else { 
            return false; 
         }
      },
      
      _delete : function ( element, event, callback  ) {
         var $this = this;
         var idx = this.keys.indexOf(element);
         var cache = this.values;
         if (!element) {
            return;
         }
         if (typeof event === 'undefined') {
            cache[idx].each(function(item) {
               document.getElementById(element).removeEventListener(item[0], item[1], item[2]);
               $.chch_cache.events.keys.splice(idx, 1);
               cache[idx].splice(idx, 1);
            });
            cache.splice(idx, 1);
         }
         if (event && callback) {
            cache[idx].each(function(item) {
               if (item[0] === event) {
                  document.getElementById(element).removeEventListener(item[0], item[1], item[2]);
                  $.chch_cache.events.values.splice(idx, 1);
                  $.chch_cache.events.keys.splice(idx, 1);
               }
            });
         }
         if (event && typeof callback === 'undefined') {
            $this.values[idx].each(function(item) {
               if (item[0] === event) {
                  document.getElementById(element).removeEventListener(item[0], item[1], item[2]);
                  $.chch_cache.events.values.splice(idx, 1);
                  $.chch_cache.events.keys.splice(idx, 1);
               }
            });
         }
      }
   }); 
   
   $.fn.extend({
     each : function ( fn, ctx ) {
         if (!this.length) return [];
         if (typeof fn !== "function") { return; }
         var i; 
         var l = this.length;
         ctx = arguments[1];
         for (i = 0; i < l; i++) {
            if (i in this) {
               fn.call(ctx, this[i], i, this);
            }
         }
         return this;
      },
      
      unique : function() {
          var o = {}, i, l = this.length, r = [];
          for(i=0; i<l;i+=1) o[this[i]] = this[i];
          for(i in o) r.push(o[i]);
          return r;
      },
      
      eq : function ( index ) {
         index = parseInt(index, 10);
         if (this.length < index + 1) {
            return [];
         }
         if (index < 0) {
            if (this[this.length + index]) {
               return [this[this.length + index]];
            } else {
               return [];
            }
         }
         if (index === 0 || !!index) {
            return [this[index]];
         } else {
            return [];
         }
      },
      
      index : function ( element ) {
         var $this;
         if (!element) {
            $this = $(this[0]);
            return $this.parent().children($this[0].nodeName).indexOf($this[0]);
         } else {
            if (element instanceof Array) {
               return this.indexOf(element[0]);
            } else if (element.nodeType === 1) {
               return this.indexOf(element);
            } else {
               return;  
            }
         }
      },
      
      is : function ( arg ) {
         if (!this.length) return [];
         var items = [];
         var $this;
         var __is = function ( node, arg ) {
            $this = this;
            if (typeof arg === 'string') {
               if ([].slice.apply(node.parentNode.querySelectorAll(arg)).indexOf(node) >= 0) {
                  return node;
               }
            } else if (typeof arg === 'function') {
               if (arg.call($this)) {
                  return node;
               }
            } else if (arg.length) {
               if ($.slice.apply(arg).indexOf(node) !== -1) {
                  return node;
               }
            } else if (arg.nodeType === 1) {
               if (node === arg) {
                  return node;
               }
            } else {
               return [];
            }
         }; 
         this.each(function(item) {
            if (__is(item, arg)) {
               items.push(item);
            }
         });
         if (items.length) {
            return items;
         } else {
            return [];
         }
      },
      
      isnt : function ( arg ) {
if (!this.length) return [];
         var items = [];
         var $this;
         var __isnt = function ( node, arg ) {
            $this = this;
            if (typeof arg === 'string') {
               if ([].slice.apply(node.parentNode.querySelectorAll(arg)).indexOf(node) === -1) {
                  return node;
               }
            } else if (typeof arg === 'function') {
               if (arg.call($this)) {
                  return node;
               }
            } else if (arg.length) {
               if ($.slice.apply(arg).indexOf(node) === -1) {
                  return node;
               }
            } else if (arg.nodeType === 1) {
               if (node !== arg) {
                  return node;
               }
            } else {
               return [];
            }
         }; 
         this.each(function(item) {
            if (__isnt(item, arg)) {
               items.push(item);
            }
         });
         if (items.length) {
            return items;
         } else {
            return [];
         }
      },
      
      has : function ( arg ) {
         if (!this.length) return [];
         var items = [];
         var __has = function ( node, arg ) {
            if (typeof arg === 'string') {
               if (node.querySelector(arg)) {
                  return node;
               }
            } else if (arg.nodeType === 1) {
               if ($.slice.apply(this.children).indexOf(arg)) {
                  return node;
               }
            } else {
               return false;
            }
         };
         this.each(function(item) {
            if (__has(item, arg)) {
               items.push(item);
            }
         });
         if (items.length) {
            return items;
         } else {
            return [];
         }
      },
      
      hasnt : function ( arg ) {
         if (!this.length) return [];
         var items = [];
         this.each(function(item) {
            if (typeof arg === 'string') {
               if (!item.querySelector(arg)) {
                  items.push(item);
               }
            } else if (arg.nodeType === 1) {
               if (!$.slice.apply(item.children).indexOf(arg)) {
                  items.push(item);
               }
            }
         });
         if (items.length) {
            return items;
         } else {
            return [];
         }
      }, 
      
      find : function ( selector, context ) {
         var ret = [];
         if (context) {
            context.each(function() {
               $.slice.apply(context.querySelectorAll(selector)).each(function(node) {
                  ret.push(node);
               });
            });
         } else {
            this.each(function(ctx) {
               $.slice.apply(ctx.querySelectorAll(selector)).each(function(node) {
                  ret.push(node);
               });
            });
         }
         return ret;
      },
      
      css : function ( property, value ) {
         var ret = [];
         if (!property) return [];
         if (!value && property instanceof Object) {
            if (!this.length) return;
            this.each(function(node) {
               for (var key in property) {
                  node.style[$.camelize(key)] = property[key];
               }
               ret.push(node);
            });
         } else if (!value && typeof property === 'string') {
            if (!this.length) return;
            return document.defaultView.getComputedStyle(this[0], null).getPropertyValue(property.toLowerCase());
         } else if (!!value) {
            if (!this.length) return [];
            this.each(function(node) {
               node.style[$.camelize(property)] = value;
               ret.push(node);
            });
         }
         return ret.length ? ret : [];
      },
      
      width : function ( ) {
         if (!this.length) return;
         return this.eq(0)[0].clientWidth;
      },
      
      height : function ( ) {
         if (!this.length) return;
         return this.eq(0)[0].clientHeight;
      },
      
      // Gets the absolute coordinates of the first element in a collection.
      // var offset = $('li').eq(0).offset();
      // offset.top, offset.right, offset.bottom, offset.left
      // For width and height, use $(selector).width(), etc.
      offset : function ( ) {
         if (!this.length) return;
         var offset = this.eq(0)[0].getBoundingClientRect();
         return {
            top: offset.top,
            left: offset.left,
            bottom: offset.bottom,
            right: offset.right
          };
      },
      
      prependTo : function ( selector ) {
         if (!this.length) return [];
         this.reverse();
         this.each(function(item) {
            $(selector)[0].insertBefore(item, $(selector)[0].firstChild);
         });
         return this;
      },
      
      appendTo : function ( selector ) {
         if (!this.length) return [];
         this.each(function(item) {
            $(selector).append(item);
         });
         return this;
      },
      
      before: function ( content ) {
         if (!this.length) return [];
         var __before = function ( node, content ) {
            if (typeof content === 'string') {
               content = $.make(content);
            }
            if (content && content.constructor === Array) {
               var len = content.length;
               var i = 0; 
               while (i < len) {
                  node.insertAdjacentElement('beforeBegin', content[i]);
                  i++;
               }
            } else if (content && content.nodeType === 1) {
               node.insertAdjacentElement('beforeBegin',content);
            }
            return node;
         };         
         
         this.each(function(node) {
            __before(node, content);
         });
         return this;
      },
      
      after : function ( args ) {
         if (!this.length) return [];
         var __after = function ( node, content ) {
            var parent = node.parentNode;
            if (typeof content === 'string') {
               content = $.make(content);
            }
            if (content && content.constructor === Array) {
               var i = 0, len = content.length;
               while (i < len) {
                  if (node === parent.lastChild) {
                     parent.appendChild(content[i]);
                  } else {
                     parent.insertBefore(content[i], node.nextSibling);
                  }
                  i++;
               }
            } else if (content && content.nodeType === 1) {
               parent.appendChild(content);
            }
            return this;
         };     
      
         this.each(function(node) {
            __after(node, args);
         });
         return this;
      },
      
      text : function ( string ) {
         if (!this.length) return [];
         var ret = '';
         
         var __text = function ( node, value ) {
            if (!!value || value === 0) {
               node.innerText = value;
               return node;
            } else {
               return node.innerText;
            }
         };
                  
         this.each(function(node) {
            if (string) {
               __text(node, string);
            } else {
               ret += __text(node);
            }
         });
         if (!string) {
            return ret;
         }
         return this;
      },
      
      insert : function ( content, position ) {
         if (!this.length) return [];
         var __insert = function (node, content, position ) {
            var c = '';
            if (typeof content === 'string') {
               c = $.make(content);
            } else if (content && content.nodeType === 1) {
               c = [];
               c.push(content);
            } else if (content instanceof Array) {
               c = content;
            } else {
               c = [];
            }
            var i = 0;
            var len = c.length;
            if (!position || position > (node.children.length + 1) || position === 'last') {
               while (i < len) {
                  node.appendChild(c[i]);
                  i++;
               }
            } else if (position === 1 || position === 'first') {
               if (node.children) {
                  if (node.firstChild && node.firstChild.nodeType === 3) {
                     while (i < len) {
                        node.insertBefore(c[i], node.firstChild);
                        i++;
                     }
                  }
               } else {
                  while (i < len) {
                     node.insertBefore(c[i], node.firstElementChild);
                     i++;
                  }
               }
            } else {
               while (i < len) {
                  node.insertBefore(c[i], node.children[position - 1]);
                  i++;
               }
            }
            return node;
         };
         var cnt = content;
         if (typeof cnt === 'string') {
            this.each(function(node) {
               __insert(node, content, position);
            });
         } else if (cnt instanceof Array) {
            this.each(function(node, idx) {
               __insert(node, cnt[idx], position);
            });
         } else if (cnt.nodeType === 1) {
            this.each(function(node) {
               __insert(node, cnt, position);
            });
         }
         return this;
      },
      
      html : function ( content ) {
         if (!this.length) return [];
         var ret = [];
         var __html = function ( node, content ) {
            if (content === '') {
               node.innerHTML = '';
               ret.push(node);
            } else if (content) {
               node.innerHTML = content;
               ret.push(node);
            } else if (!content) {
               ret = node.innerHTML;
            }
         };
         this.each(function(node) {
            __html(node, content);
         });
         return ret.length ? ret : [];
      },
      
      prepend : function ( content ) {
         if (!this.length) return [];
         this.insert(content,'first');
         return this;
      },
      
      append : function ( content ) {
         if (!this.length) return [];
         this.insert(content, 'last');
         return this;
      },
      
      attr : function ( property, value ) {
         if (!this.length) return [];
         var __attr = function ( node, property, value ) {
             if (!value) {
                return node.getAttribute(property);
             } else {
                return node.setAttribute(property, value);
             }
         };
         var ret = [];
         if (!value) {
            if (this[0].hasAttribute(property)) {
               return __attr(this[0], property);
            }
         } else {
            this.each(function(node) {
               __attr(node, property, value);
               ret.push(node);
            });
         }
         return returnResult(ret);
      },
      
      prop : function( property, value ) {
         if (!this.length) return [];
         return this.attr(property, value);
      },
      
      hasAttr : function ( property ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            if (node.hasAttribute(property)) {
               ret.push(node);
            }
         });
         return returnResult(ret);
      },
      
      removeAttr : function ( attribute ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            if (!!node.hasAttribute(attribute)) {
               node.removeAttribute(attribute);
               ret.push(node);
            }
         });
         return returnResult(ret);
      },
      
      hasClass : function ( className ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            if (node.classList.contains(className)) {
               ret.push(node);
            }
         });
         return returnResult(ret);
      },
      
      addClass : function ( className ) {
         if (!this.length) return [];
         var ret = [];
         var classes;
         this.each(function(node) {
            if (/\s/.test(className)) {
               classes = className.split(' ');
               classes.each(function(name) {
                  node.classList.add(name);
               });
            } else {
               node.classList.add(className);
            }
            ret.push(node);
         });
         return returnResult(ret);
      },
      
      removeClass : function ( className ) {
         if (!this.length) return [];
         var ret = [];
         var classes;
         this.each(function(node) {
            if (/\s/.test(className)) {
               classes = className.split(' ');
               classes.each(function(name) {
                  node.classList.remove(name);
               });
            } else {
               node.classList.remove(className);
            }
            if (node.getAttribute('class')==='') {
               node.removeAttribute('class');
            }
            ret.push(node);
         });
         return returnResult(ret);
      },
      
      toggleClass : function ( className ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            node.classList.toggle(className);
            ret.push(node);
         });
         return returnResult(ret);
      },
      
      dataset : function ( key, value ) {
         if (!this.length) return [];
         var ret = [];
         if (!value) {
            return this[0].dataset[$.camelize(key)];
         } else {
            this.each(function(node) {
               node.dataset[key] = value;
               ret.push(node);
            });
         }
         return returnResult(ret);
      },
      
      val : function ( value ) {
         if (!this.length) return [];
         if (!value) {
            if (this[0] && this[0].value) {
               return this[0].value;
            } else {
               return;
            }
         } else {
            this[0].value = value;
            return this;
         }
      },
      
      disable : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            node.classList.add('disabled');
            node.setAttribute('disabled', true);
            node.style.cursor = 'default';
         });
         return returnResult(ret);
      },
      
      enable : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            node.classList.remove('disabled');
            node.removeAttribute('disabled');
            node.style.cursor = 'auto';
         });
         return returnResult(ret);
      },
      
      hide : function ( speed, callback ) {
         var cbk = callback || $.noop;
         if (!this.length) return [];
         var ret = [];
         var css = '';
         var storedDimensions = {};
         var cssAnim = {
            opacity: 0,
            height: 0,
            padding: 0,
         };
         var transition = $.isWebkit ? '-webkit-transition' : 'transition';
         this.each(function(ctx) {
            storedDimensions.padding = $(ctx).css('padding');
            storedDimensions.height = $(ctx).css('height');
            storedDimensions.opacity = $(ctx).css('opacity');
            storedDimensions.display = $(ctx).css('display');
            $(ctx).data('ui-dimensions', storedDimensions); 
            if (typeof speed === 'string') {
               if (speed === 'slow') {
                  $(ctx).css({transition: 'all 1s ease-out'});
                  $(ctx).css(cssAnim);
                  setTimeout(function() {
                     $(ctx).css({visibility: 'hidden', display: 'none'});
                     cbk.apply(ctx, arguments);
                  }, 1000);
               } else if (speed === 'fast') {
                  $(ctx).css({transition: 'all .35s ease-in-out'});
                  $(ctx).css(cssAnim);
                  setTimeout(function() {
                     $(ctx).css({visibility: 'hidden', display: 'none'});
                     cbk.apply(ctx, arguments);
                  }, 350);
               }
            } else if (typeof speed === 'number') {
               css = 'all ' + speed + 'ms ease-in-out';
               $(ctx).css({transition: css});
               $(ctx).css(cssAnim);
               setTimeout(function() {
                  $(ctx).css({visibility: 'hidden', display: 'none'});
                  cbk.apply(ctx, arguments);
               }, speed);
            }
            if (!callback && typeof speed === 'function') {
               $(ctx).css({display: 'none', visibility: 'hidden'});
               speed.apply(ctx, arguments);
            }
            if (!speed) {
               $(ctx).data('','');
               $(ctx).css({
                  display: 'none',
                  visibility: 'visible'
               });
            }
            ret.push(ctx);
         });
         return returnResult(ret);
      },
      
      show : function ( speed, callback ) {
         var cbk = callback || $.noop;
         var createCSSAnim = function(opacity, height, padding) {
            return {
               opacity: opacity,
               height: height,
               padding: padding
            };
         };
         var transition = $.isWebkit ? '-webkit-transition' : 'transition';
         this.each(function(ctx) {
            var storedDimensions = $(ctx).data('ui-dimensions');
            var height = storedDimensions && storedDimensions.height || 'auto';
            var padding = storedDimensions && storedDimensions.padding || 'auto';
            var opacity = storedDimensions && storedDimensions.opacity || 1;
            var display = storedDimensions && storedDimensions.display || 'block';
            if (typeof speed === 'string') {
               if (speed === 'slow') {
                  $(ctx).css({visibility: 'visible', display: display});
                  setTimeout(function() {
                     $(ctx).css({transition: 'all 1s ease-out'});
                     $(ctx).css(createCSSAnim(opacity, height, padding));
                     setTimeout(function() {
                        cbk.apply(ctx, arguments);
                     }, 1000);
                  });
               } else if (speed === 'fast') {
                  $(ctx).css({visibility: 'visible', display: display});
                  setTimeout(function() {
                     $(ctx).css({transition: 'all .250s ease-out'});
                     $(ctx).css(createCSSAnim(opacity, height, padding));
                     setTimeout(function() {
                        cbk.apply(ctx, arguments);
                     }, 250);
                  });
               }
            } else if (typeof speed === 'number') {
               $(ctx).css({visibility: 'visible', display: display});
               setTimeout(function() {
                  $(ctx).css({transition: 'all ' + speed + 'ms ease-out'});
                  $(ctx).css(createCSSAnim(opacity, height, padding));
                  setTimeout(function() {
                     cbk.apply(ctx, arguments);
                  }, speed);
               });
            }
            if (!speed) {
               $(ctx).css({
                  display: display,
                  visibility: 'visible',
                  opacity: opacity
               });
            }
         });
      },
      
      prev : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            if (node.previousElementSibling) {
               ret.push(node.previousElementSibling);
            }
         });
         //return returnResult(ret);
         return ret.length ? ret : this;
      },
      
      next : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            if (node.nextElementSibling) {
               ret.push(node.nextElementSibling);
            }
         });
         return ret.length ? ret : this;
         //return returnResult(ret);
      },
       
      first : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            ret.push(node.firstElementChild);
         });
         return returnResult(ret);
      },
       
      last : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            ret.push(node.lastElementChild);
         });
         return returnResult(ret);
      },
      
      children : function ( selector ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(node) {
            if (!!selector) {
               [].slice.apply(node.children).each(function(ctx) {
                  if ([ctx].is(selector)) {
                     ret.push(ctx);
                  }
               });
            } else {
               [].slice.apply(node.children).each(function(ctx) {
                  ret.push(ctx);
               });
            }
         });
         return ret;
      },
      
      parent: function() {
         if (!this.length) return [];
         var ret = [];
         this.each(function(ctx) {
            ret.push(ctx.parentNode);
         });
         ret = ret.unique();
         return returnResult(ret);
      },
      
      ancestor : function( selector ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(ctx) {
            if (typeof selector === 'undefined') {
               return [];
            }
            var position = null;
            var newSelector = null;
            var p = ctx.parentNode;
            if (!p) {
               return [];
            }
            if (typeof selector === 'string') {
               selector.trim();
            }
            if (typeof selector === 'number') {
               position = selector || 1;
                for (var i = 1; i < position; i++) {
                   if (p.nodeName === 'HTML') {
                      return p;
                   } else {
                      if (p !== null) {
                         p = p.parentNode;
                      }
                   }
                } 
                ret.push(p);
            } else if (typeof selector === 'string' && selector.substr(0,1) === '.' ) {
               newSelector = selector.split('.')[1];
               if (p.nodeName === 'BODY') {
                  ret.push(p);
               }
               if (p.classList.contains(newSelector)) {
                  ret.push(p);
               } else {
                  ret.push($(p).ancestor(selector)[0]);
               }
            } else if (typeof selector === 'string' && selector.substr(0,1) === '#' ) {
               newSelector = selector.split('#')[1];
               if (p.getAttribute('id') === newSelector) {
                  ret.push(p);
               } else {
                  ret.push($(p).ancestor(selector)[0]);
               }
            } else { 
               if (p.tagName && (p.tagName.toLowerCase() === selector)) {
                  ret.push(p);
               } else {
                  ret.push($(p).ancestor(selector)[0]);
               } 
            }
         });
         ret = ret.unique();
         if (ret[0] === undefined) return [];
         return returnResult(ret);
      }, 
      
      closest : function( selector ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(ctx) {
            ret.push($(ctx).ancestor(selector)[0]);
         });
         return ret.length ? ret : this;
      },
      
      siblings : function( selector ) {
         if (!this.length) return [];
         var _siblings;
         var ret = [];
         if (selector && (typeof selector === 'string')) {
            selector = selector;
         } else {
            selector = false;
         }
         this.each(function(ctx) {
            _siblings = $(ctx).parent().children();
            _siblings.splice(_siblings.indexOf(ctx),1);
            if (selector) {
               _siblings.each(function(node) {
                  if (node.nodeName === selector.toUpperCase()) {
                     ret.push(node);
                  }
               });
            } else {
               _siblings.each(function(node) {
                  ret.push(node);
               });
            }
         });
         return ret.length ? ret : this;
      },
      
      bind : function( event, callback, capturePhase ) {
         if (!this.length) return [];
         capturePhase = capturePhase || false;
         this.each(function(ctx) {
            $.chch_cache.events.set(ctx, event, callback, capturePhase);
         });
         return this;
      },
         
      unbind : function( event, callback, capturePhase ) {
         if (!this.length) return [];
         var id;
         this.each(function(ctx) {
            if (!ctx.id || !$.chch_cache.events.hasKey(ctx.id)) {
               return this;
            }
            capturePhase = capturePhase || false;
            id = ctx.getAttribute('id');
            $.chch_cache.events._delete(id, event, callback, capturePhase);
         });
         return this;
      },
       
      trigger : function ( event ) {
         if (!this.length) return [];
         this.each(function(ctx) {
            if( document.createEvent ) {
              var evtObj = document.createEvent('Events');
              evtObj.initEvent(event, true, false);
              ctx.dispatchEvent(evtObj);
            }
         });
      },
       
      delegate : function ( selector, event, callback, capturePhase ) {
         if (!this.length) return [];
         capturePhase = capturePhase || false;
         this.each(function(ctx) {
            ctx.addEventListener(event, function(e) {
               var target = e.target;
               if (e.target.nodeType === 3) {
                  target = e.target.parentNode;
               }
               $(selector, ctx).each(function(element) {
                  if (element === target) {
                     callback.call(element, e);
                  } else {
                     try {
                        var ancestor = $(target).ancestor(selector);
                        if (element === ancestor[0]) {
                           callback.call(element, e);
                        }
                     } catch(err) {}
                  }
               });
            }, capturePhase);
         });
      },
      
      undelegate : function ( selector, event, callback, capturePhase ) {
         if (!this.length) return [];
         this.each(function(ctx) {
            $(ctx).unbind(event, callback, capturePhase);
         });
      },
      
      on : function ( event, selector, callback, capturePhase ) {
         if (!this.length) return [];
         // If and object literal of events:functions are passed,
         // map them to event listeners on the element:
         if (! selector && /Object/img.test(event.constructor.toString())) {
            this.each(function(ctx) {
               for (var key  in event) {
                  $(ctx).on(key, event[key]);
               }
            });
         }
         var ret = [];
         // Check to see if event is a spaced separated list:
         var events;
         if (typeof event === 'string') {
            event = event.trim();
            if (/\s/.test(event)) {
               events = event.split(' ');
               if (events.length) {
                  this.each(function(ctx) {
                     events.each(function(evt) {
                        if (typeof selector === 'function') {
                           $(ctx).bind(evt, selector, callback);
                           ret.push(ctx);
                        } else {
                           $(ctx).delegate(selector, evt, callback, capturePhase);
                           ret.push(ctx);
                        }                       
                     });
                  });
               }
            }
         }
         this.each(function(ctx) {
            if (typeof selector === 'function') {
               $(ctx).bind(event, selector, callback);
               ret.push(ctx);
            } else {
               $(ctx).delegate(selector, event, callback, capturePhase);
               ret.push(ctx);
            }
         });
         return ret.length ? ret : this;
      },
      
      off : function( event, selector, callback, capturePhase ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(ctx) {
            if (typeof selector === 'function' || !selector) {
               $(ctx).unbind(event, selector, callback);
               ret.push(ctx);
            } else {
               $(ctx).undelegate(selector, event, callback, capturePhase);
               ret.push(ctx);
            }
         });
         return ret.length ? ret : this;
      },
      
      animate : function ( options ) {
         if (!this.length) return [];   
         var onEnd = null;
         var duration = options.duration || '.5s';
         var easing = options.easing || 'linear';
         var css = {};
         var transition = $.isWebkit ? '-webkit-transition' : 'transition';
         var transitionEnd = $.isWebkit ? 'webkitTransitionEnd' : 'transitionend';
         css[transition] = 'all ' + duration + ' ' + easing;
         this.forEach(function(ctx) {
            for (var prop in options.values) {
               if (prop === 'onEnd') {
                  onEnd = options.values[prop];
                  $(ctx).bind(transitionEnd, onEnd());
               } else {
                  css[prop] =  options.values[prop];
               }
            }
            $(ctx).css(css);
         });
         return this;
      }, 
           
      // This only operates on the first element in the collection.
      data : function( key, value ) {
         if (!this.length) return [];
         var id;
         var ret;
         var ctx = this[0];
         id = ctx.id;
         if (key === 'undefined' || key === null) {
            if (!id) {
               return this;
            } else {
               ret = $.chch_cache.data[id];
            }
         }
         if (!value) {
            if (key && id) {
               if (!$.chch_cache.data[id]) return this;
               if (!$.chch_cache.data[id][key]) return this;
               return $.chch_cache.data[id][key];
            } else {
               return this;
            }
         } else {
            if (!ctx.id) {
               ++$.uuid;
               id = $.makeUuid();
               ctx.setAttribute("id", id);
               $.chch_cache.data[id] = {};
               $.chch_cache.data[id][key] = value;
            } else {
               id = ctx.id;
               if (!$.chch_cache.data[id]) {
                  $.chch_cache.data[id] = {};
                  $.chch_cache.data[id][key] = value;
               } else {
                  $.chch_cache.data[id][key] = value;
               }
            }
         }
       return ret || this;
      },
      
      removeData : function ( key ) {
         if (!this.length) return [];
         this.each(function(ctx) {
            var id = ctx.getAttribute('id');
            if (!id) {
               return;
            }
            if (!$.chch_cache.data[ctx.id]) {
               return this;
            }
            if (!key) {
               delete $.chch_cache.data[id];
               return this;
            }
            if (Object.keys($.chch_cache.data[id]).length === 0) {
               delete $.chch_cache.data[id];
            } else {
               delete $.chch_cache.data[id][key];
            }
            return this;
         });
      },
      
      clone : function ( value ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(ctx) {
            if (value === true || !value) {
               ret.push(ctx.cloneNode(true));
            } else {
               ret.push(ctx.cloneNode(false));
            }
         });
         return ret.length ? ret[0] : this;
      },
            
      wrap : function ( string ) {
         if (!this.length) return [];
         this.each(function(ctx) {
            var tempNode = $.make(string);
            tempNode = tempNode[0];
            var whichClone = $(ctx).clone(true);
            tempNode.appendChild(whichClone);
            ctx.parentNode.insertBefore(tempNode, ctx.nextSibling);
            $(ctx).remove(ctx);
         });
         return this;
      },
      
      unwrap : function ( ) {
         if (!this.length) return [];
         var parentNode = null;
         this.each(function(node) {
            if (node.parentNode === parentNode) {
               return;
            }
            parentNode = node.parentNode;
            if (node.parentNode.nodeName === 'BODY') {
               return false;
            }
            $.replace(node, node.parentNode);
         });
         return this;
      },
      
      remove : function ( ) {
         if (!this.length) return [];
         this.each(function(ctx) {
            $(ctx).unbind();
            $(ctx).removeData();
            ctx.parentNode.removeChild(ctx);
         });
      },
      
      empty : function ( ) {
         if (!this.length) return [];
         var ret = [];
         this.each(function(ctx) {
            $(ctx).unbind();
            ctx.textContent = '';
            ret.push(ctx);
         });
         return returnResult(ret);
      },
      
      ready : function ( callback ) {
         if (!this.length) return [];
         if (this[0] === document) {
            $.ready(function() {
               return callback.call(callback);
            });
         } 
      }
   });
   
   $.extend($, {
      DOMReadyList : [],
      
      executeWhenDOMReady : function ( ) {
         var listLen = $.DOMReadyList.length;
         var i = 0;
         while (i < listLen) {
            $.DOMReadyList[i]();
            i++;
         }
         $.DOMReadyList = null;
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
   
   $.extend($, {
      camelize : function ( string ) {
         return string.replace(/\-(.)/g, function(m, l){return l.toUpperCase();});
      },
      
      deCamelize : function ( string ) {
         return string.replace(/([A-Z])/g, '-$1').toLowerCase();
      },
      
      capitalize : function ( string, all ) {
         if (!string) {
            return;
         }
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
   
   $.extend($, {
      /*
         options = {
            url : 'the/path/here',
            type : ('GET', 'POST', PUT, 'DELETE'),
            data : myData,
            async : 'synch' || 'asynch',
            user : username (string),
            password : password (string),
            dataType : ('html', 'json', 'text', 'script', 'xml'),
            headers : {},
            success : callbackForSuccess,
            error : callbackForError
         }
      */
      ajax : function ( options ) {
         var dataTypes = {
            script: 'text/javascript, application/javascript',
            json:   'application/json',
            xml:    'application/xml, text/xml',
            html:   'text/html',
            text:   'text/plain'
         };
         var o = options ? options : {};
         var success = null;
         var error = options.error || $.noop;
         if (!!options) {
            if (!!o.success) {
               success = o.success;
            }
         }
         var request = new XMLHttpRequest();
         var type = o.type || 'get';
         var async  = o.async || false;      
         var params = o.data || null;
         request.queryString = params;
         request.open(type, o.url, async);
           if (!!o.headers) {  
             for (var prop in o.headers) { 
                 if(o.headers.hasOwnProperty(prop)) { 
                     request.setRequestHeader(prop, o.headers[prop]);
                 }
             }
         }
         if (o.dataType) {
            request.setRequestHeader('Content-Type', dataTypes[o.dataType]);
         }
         request.handleResp = (success !== null) ? success : $.noop; 
         
         var handleResponse = function() {
            if(request.status === 0 && request.readyState === 4 || request.status >= 200 && request.status < 300 && request.readyState === 4 || request.status === 304 && request.readyState === 4 ) {
               if (o.dataType) {
                  if (o.dataType === 'json') {
                     request.handleResp(JSON.parse(request.responseText));
                  } else {
                     request.handleResp(request.responseText);
                  }
               } else {
                  request.handleResp(request.responseText);
               }
            } else {
               if (!!error) {
                  error(request);
               }
            }
         };
         if (async) {
            request.onreadystatechange = handleResponse;
         }
         request.send(params);
         if (!async) {
            handleResponse();
         }
         return this;
      },
      
      // Parameters: url, data, success, dataType.
      get : function ( url, data, success, dataType ) {
          if (!url) {
             return;
          }
          if (!data) {
             return;
          }
          if (typeof data === 'function' && !dataType) {
             if (typeof success === 'string') {
                dataType = success;
             }
             $.ajax({url : url, type: 'GET', success : data, dataType : dataType});
          } else if (typeof data === 'object' && typeof success === 'function') {
             $.ajax({url : url, type: 'GET', data : data, dataType : dataType});
          }
      },
      
      // Parameters: url, data, success.
      getJSON : function ( url, data, success ) {
          if (!url) {
             return;
          }
          if (!data) {
             return;
          }
          if (typeof data === 'function' && !success) {
             $.ajax({url : url, type: 'GET', success : data, dataType : 'json'});
          } else if (typeof data === 'object' && typeof success === 'function') {
             $.ajax({url : url, type: 'GET', data : data, dataType : 'json'});
          }
      },
      
      // Parameters: url, data, success, dataType.
      post : function ( url, data, success, dataType ) {
          if (!url) {
             return;
          }
          if (!data) {
             return;
          }
          if (typeof data === 'function' && !dataType) {
             if (typeof success === 'string') {
                dataType = success;
             }
             $.ajax({url : url, type: 'POST', success : data, dataType : dataType});
          } else if (typeof data === 'object' && typeof success === 'function') {
             $.ajax({url : url, type: 'POST', data : data, dataType : dataType});
          }
      },
      
      // Convert form values into JSON object:
      form2JSON : function(rootNode, delimiter) {
         rootNode = typeof rootNode === 'string' ? $(rootNode)[0] : rootNode;
         delimiter = delimiter || '.';
         var formValues = getFormValues(rootNode);
         var result = {};
         var arrays = {};
         
         function getFormValues(rootNode) {
            var result = [];
            var currentNode = rootNode.firstChild;
            while (currentNode) {
               if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i)) {
                  result.push({ name: currentNode.name, value: getFieldValue(currentNode)});
               } else {
                  var subresult = getFormValues(currentNode);
                  result = result.concat(subresult);
               }
               currentNode = currentNode.nextSibling;
            }
            return result;
         }
         function getFieldValue(fieldNode) {
            if (fieldNode.nodeName === 'INPUT') {
               if (fieldNode.type.toLowerCase() === 'radio' || fieldNode.type.toLowerCase() === 'checkbox') {
                  if (fieldNode.checked) {
                     return fieldNode.value;
                  }
               } else {
                  if (!fieldNode.type.toLowerCase().match(/button|reset|submit|image/i)) {
                     return fieldNode.value;
                  }
               }
            } else {
               if (fieldNode.nodeName === 'TEXTAREA') {
                  return fieldNode.value;
               } else {
                  if (fieldNode.nodeName === 'SELECT') {
                     return getSelectedOptionValue(fieldNode);
                  }
               }
            }
            return '';
         }
         function getSelectedOptionValue(selectNode) {
            var multiple = selectNode.multiple;
            if (!multiple) {
               return selectNode.value;
            }
            if (selectNode.selectedIndex > -1) {
               var result = [];
               $('option', selectNode).each(function(item) {
                  if (item.selected) {
                     result.push(item.value);
                  }
               });
               return result;
            }
         }    
         formValues.each(function(item) {
            var value = item.value;
            if (value !== '') {
               var name = item.name;
               var nameParts = name.split(delimiter);
               var currResult = result;
               for (var j = 0; j < nameParts.length; j++) {
                  var namePart = nameParts[j];
                  var arrName;
                  if (namePart.indexOf('[]') > -1 && j === nameParts.length - 1) {
                     arrName = namePart.substr(0, namePart.indexOf('['));
                     if (!currResult[arrName]) {
                        currResult[arrName] = [];
                     }
                     currResult[arrName].push(value);
                  } else {
                     if (namePart.indexOf('[') > -1) {
                        arrName = namePart.substr(0, namePart.indexOf('['));
                        var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');
                        if (!arrays[arrName]) {
                           arrays[arrName] = {};
                        }
                        if (!currResult[arrName]) {
                           currResult[arrName] = [];
                        }
                        if (j === nameParts.length - 1) {
                           currResult[arrName].push(value);
                        } else {
                           if (!arrays[arrName][arrIdx]) {
                              currResult[arrName].push({});
                              arrays[arrName][arrIdx] = 
                              currResult[arrName][currResult[arrName].length - 1];
                           }
                        }
                        currResult = arrays[arrName][arrIdx];
                     } else {
                        if (j < nameParts.length - 1) { 
                           if (!currResult[namePart]) {
                              currResult[namePart] = {};
                           }
                           currResult = currResult[namePart];
                        } else {
                           currResult[namePart] = value;
                        }
                     }
                  }
               }
            }
         });
         return result;
      },
      
      isiPhone : /iphone/img.test(navigator.userAgent),
      isiPad : /ipad/img.test(navigator.userAgent),
      isiPod : /ipod/img.test(navigator.userAgent),
      isiOS : /ip(hone|od|ad)/img.test(navigator.userAgent),
      isAndroid : /android/img.test(navigator.userAgent),
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
      isChrome : /chrome/i.test(navigator.userAgent),
      
      
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
      }
      
   });
   
   window.$chocolatechip = $;
   if (typeof window.$ === 'undefined') {
      window.$chocolatechip = window.$ = $;
   }
})();
