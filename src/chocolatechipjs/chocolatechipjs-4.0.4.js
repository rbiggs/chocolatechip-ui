/*
    pO\
   6  /\
     /OO\
    /OOOO\
   /OOOOOO\
  (OOOOOOOO)
   \:~==~:/

ChocolateChipJS
Copyright 2015 Sourcebits www.sourcebits.com
License: MIT
Version: 4.0.4
*/
function chocolatechipjs(selector, context) {
  var _this = this;
  var idRE = /^#([\w-]*)$/;
  var classRE = /^\.([\w-]+)$/;
  var tagRE = /^[\w-]+$/;
  var slice = function(elements) {
    return [].slice.apply(elements);
  };
  var getId = function(selector) {
    var el = document.getElementById(selector.split('#')[1]);
    return el ? [el] : [];
  };
  var getTag = function(selector, context) {
    if (context) {
      return slice(context.getElementsByTagName(selector));
    } else {
      return slice(document.getElementsByTagName(selector));
    }
  };
  var getClass = function(selector, context) {
    if (context) {
      return slice(context.getElementsByClassName(selector.split('.')[1]));
    } else {
      return slice(document.getElementsByClassName(selector.split('.')[1]));
    }
  };
  var getNode = function(selector, context) {
    if (typeof selector === 'string')
      selector = selector.trim();
    if (typeof selector === 'string' && idRE.test(selector)) {
      return getId(selector);
    }
    if (selector && (selector instanceof Array) && selector.length)
      return selector;
    if (!context && typeof selector === 'string') {
      if (/<\/?[^>]+>/.test(selector)) {
        return _this.make(selector);
      }
      if (tagRE.test(selector)) {
        return getTag(selector);
      } else if (classRE.test(selector)) {
        return getClass(selector);
      } else {
        return slice(document.querySelectorAll(selector));
      }
    } else {
      if (context) {
        return slice(context.querySelectorAll(selector));
      } else {
        return slice(document.querySelectorAll(selector));
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
      return slice(document.querySelectorAll(context + ' ' + selector));
    } else if (context.nodeType === 1) {
      return getNode(selector, context);
    }
  } else if (typeof selector === 'function') {
    if (document.getElementsByTagName('body')[0]) {
      selector.call(selector);
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        return selector.call(selector);
      });
    }
  } else if (selector && selector.nodeType === 1) {
    return [selector];
  } else if (typeof selector === 'string') {
    if (selector === '')
      return [];
    if (/<\/?[^>]+>/.test(selector)) {
      return chocolatechipjs['make'](selector);
    } else {
      try {
        return getNode(selector) ? getNode(selector) : [];
      } catch (err) {
        return [];
      }
    }
  } else if (selector instanceof Array) {
    var node;
    selector.every(function(ctx) {
      if (!ctx.nodeType) {
        node = "false";
      }
    });
    return (node === 'false') ? [] : selector;
  } else if (/NodeListConstructor/i.test(selector.constructor.toString())) {
    return slice(selector);
  } else if (selector === window) {
    return [];
  } else {
    return [];
  }
  return this;
}

(function(chocolatechipjs) {
  chocolatechipjs.extend = function(obj, prop, enumerable) {
    enumerable = enumerable || false;
    if (!prop) {
      prop = obj;
      obj = chocolatechipjs;
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
    return chocolatechipjs;
  };
  chocolatechipjs.fn = {
    extend: function(object) {
      return chocolatechipjs.extend(Array.prototype, object);
    }
  };
})(chocolatechipjs);
window.chocolatechipjs = chocolatechipjs;
if (typeof window.$ === 'undefined') {
  window.$ = chocolatechipjs;
}
(function($) {
  var slice = function(elements) {
    return [].slice.apply(elements);
  };
  $.extend($, {
    libraryName: "ChocolateChip",
    version: '4.0.4',
    noop: function() {},
    uuidNum: function() {
      var d = Date.now();
      var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
      var randomLetter = charset[Math.floor(Math.random() * charset.length)];
      return randomLetter + 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },
    makeUuid: function() {
      return $.uuidNum();
    },
    uuid: 0,
    make: function(HTMLString) {
      var ret = [];
      var temp = document.createElement('div');
      temp.innerHTML = HTMLString;
      temp = slice(temp.childNodes);
      temp.forEach(function(ctx) {
        if (ctx.nodeType === 1) {
          ret.push(ctx);
        } else if (ctx.nodeType === 3 && ctx.nodeValue.trim().length !== 0) {
          ret.push(ctx);
        }
      });
      return ret;
    },
    concat: function(args) {
      if (args instanceof Array) {
        return args.join('');
      } else if (args instanceof Object) {
        return;
      } else {
        args = [].slice.apply(arguments);
        return String.prototype.concat.apply(args.join(''));
      }
    },
    html: function(HTMLString) {
      return $.make(HTMLString);
    },
    replace: function(newElem, oldElem) {
      if (!newElem || !oldElem)
        return;
      newElem = newElem.length ? newElem[0] : newElem;
      oldElem = oldElem.length ? oldElem[0] : oldElem;
      oldElem.parentNode.replaceChild(newElem, oldElem);
      return;
    },
    require: function(src, callback) {
      callback = callback || $.noop;
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', src);
      script.setAttribute('defer', 'defer');
      script.onload = function() {
        callback.apply(callback, arguments);
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    },
    delay: function(func, milliseconds) {
      if (milliseconds === void 0) {
        milliseconds = 1;
      }
      func = func || $.noop;
      setTimeout(function() {
        func.call(func);
      }, milliseconds);
    },
    defer: function(func) {
      func = func || $.noop;
      return $.delay.apply($, [func, 1].concat([].slice.call(arguments, 1)));
    },
    returnResult: function(result) {
      if (typeof result === 'string')
        return [];
      if (result && result.length && result[0] === undefined)
        return [];
      if (result && result.length)
        return result;
      else
        return [];
    },
    each: function(array, callback) {
      if (!array || !$.isArray(array))
        return;
      var value;
      var i = 0;
      var length = array.length;
      for (; i < length; i++) {
        value = callback.call(array[i], array[i], i);
        if (value === false) {
          break;
        }
      }
    }
  });
})(chocolatechipjs);
(function($) {
  $.extend({
    camelize: function(string) {
      if (typeof string !== 'string')
        return;
      return string.replace(/\-(.)/g, function(match, letter) {
        return letter.toUpperCase();
      });
    },
    deCamelize: function(string) {
      if (typeof string !== 'string')
        return;
      return string.replace(/([A-Z])/g, '-$1').toLowerCase();
    },
    capitalize: function(string, all) {
      var $this = this;
      if (!string) {
        return;
      }
      if (typeof string !== 'string')
        return;
      if (all) {
        var str = string.split(' ');
        var newstr = [];
        str.forEach(function(item) {
          return newstr.push($this.capitalize(item));
        });
        return newstr.join(' ');
      } else {
        return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
      }
    },
    w: function(str) {
      return str.split(' ');
    }
  });
})(chocolatechipjs);
(function($) {
  $.extend({
    isString: function(str) {
      return typeof str === 'string';
    },
    isArray: function(array) {
      return Array.isArray(array);
    },
    isFunction: function(func) {
      return Object.prototype.toString.call(func) === '[object Function]';
    },
    isObject: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]';
    },
    isEmptyObject: function(obj) {
      return Object.keys(obj).length === 0;
    },
    isNumber: function(number) {
      return typeof number === 'number';
    },
    isInteger: function(number) {
      return (typeof number === 'number' && number % 1 === 0);
    },
    isFloat: function(number) {
      return (typeof number === 'number' && number % 1 !== 0);
    }
  });
})(chocolatechipjs);
(function($) {
  $.extend(chocolatechipjs, {
    isiPhone: /iphone/img.test(navigator.userAgent),
    isiPad: /ipad/img.test(navigator.userAgent),
    isiPod: /ipod/img.test(navigator.userAgent),
    isiOS: /ip(hone|od|ad)/img.test(navigator.userAgent),
    isAndroid: (/android/img.test(navigator.userAgent) && !/trident/img.test(navigator.userAgent)),
    isWebOS: /webos/img.test(navigator.userAgent),
    isBlackberry: /blackberry/img.test(navigator.userAgent),
    isTouchEnabled: !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && 'createTouch' in document,
    isOnline: navigator.onLine,
    isStandalone: navigator.standalone,
    isWin: /edge/img.test(navigator.userAgent) || /trident/img.test(navigator.userAgent),
    isIE10: /msie 10/img.test(navigator.userAgent),
    isIE11: (/windows nt/img.test(navigator.userAgent) && /trident/img.test(navigator.userAgent)),
    isWebkit: (!/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /webkit/img.test(navigator.userAgent)),
    isDesktop: (!/mobile/img.test(navigator.userAgent)),
    isSafari: (!/edge/img.test(navigator.userAgent) && !/Chrome/img.test(navigator.userAgent) && /Safari/img.test(navigator.userAgent) && !/android/img.test(navigator.userAgent)),
    isChrome: !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /Chrome/img.test(navigator.userAgent) && !((/samsung/img.test(navigator.userAgent) || /Galaxy Nexus/img.test(navigator.userAgent) || /HTC/img.test(navigator.userAgent) || /LG/img.test(navigator.userAgent)) && !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /android/i.test(navigator.userAgent) && /webkit/i.test(navigator.userAgent)),
    isNativeAndroid: ((/samsung/img.test(navigator.userAgent) || /Galaxy Nexus/img.test(navigator.userAgent) || /HTC/img.test(navigator.userAgent) || /LG/img.test(navigator.userAgent)) && !/trident/img.test(navigator.userAgent) && !/edge/img.test(navigator.userAgent) && /android/i.test(navigator.userAgent) && /webkit/i.test(navigator.userAgent))
  });
})(chocolatechipjs);
(function($) {
  $.extend({
    chch_cache: {
      data: {},
      events: {
        keys: [],
        values: [],
        set: function(element, event, callback, capturePhase) {
          var key;
          var length = this.values.length > 0 ? this.values.length - 1 : 0;
          var values;
          if (!!element.id) {
            key = element.id;
          } else {
            ++chocolatechipjs['uuid'];
            key = chocolatechipjs['uuidNum']();
            element.setAttribute("id", key);
          }
          if (this.keys.indexOf(key) >= 0) {
            this.values[length].push([]);
            values = this.values[length];
            values.push(event);
            values.push(callback);
            values.push(capturePhase);
            element.addEventListener(event, callback, capturePhase);
          } else {
            this.keys.push(key);
            this.values.push([]);
            length = this.values.length - 1;
            this.values[length].push([]);
            values = this.values[length];
            values[0].push(event);
            values[0].push(callback);
            values[0].push(capturePhase);
            element.addEventListener(event, callback, capturePhase);
          }
        },
        hasKey: function(key) {
          if (this.keys.indexOf(key) >= 0) {
            return true;
          } else {
            return false;
          }
        },
        _delete: function(element, event, callback) {
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
      }
    }
  });
})(chocolatechipjs);
(function($) {
  chocolatechipjs.fn.extend({
    data: function(key, value) {
      if (!this.length)
        return [];
      var id;
      var ctx = this[0];
      id = ctx.id;
      if (key === 'undefined' || key === null) {
        return;
      }
      if (value || value === 0) {
        var val = value;
        if (!ctx.id) {
          ++$.uuid;
          id = $.makeUuid();
          ctx.setAttribute("id", id);
          $.chch_cache.data[id] = {};
          $.chch_cache.data[id][key] = val;
        } else {
          id = ctx.id;
          if (!$.chch_cache.data[id]) {
            $.chch_cache.data[id] = {};
            $.chch_cache.data[id][key] = val;
          } else {
            $.chch_cache.data[id][key] = val;
          }
        }
      } else {
        if (key && id) {
          if (!$.chch_cache.data[id])
            return;
          if ($.chch_cache.data[id][key] === 0)
            return $.chch_cache.data[id][key];
          if (!$.chch_cache.data[id][key])
            return;
          return $.chch_cache.data[id][key];
        }
      }
      return this;
    },
    dataset: function(key, value) {
      if (!this.length)
        return [];
      if (!document.body.dataset)
        return [];
      var ret = [];
      if (typeof value === 'string' && value.length >= 0) {
        this.each(function(node) {
          node.dataset[key] = value;
          ret.push(node);
        });
      } else {
        return this[0].dataset[$.camelize(key)];
      }
      return $['returnResult'](ret);
    },
    removeData: function(key) {
      var _this = this;
      if (!this.length)
        return [];
      this.each(function(ctx) {
        var id = ctx.getAttribute('id');
        if (!id) {
          return;
        }
        if (!$.chch_cache.data[ctx.id]) {
          return _this;
        }
        if (!key) {
          delete $.chch_cache.data[id];
          return _this;
        }
        if (Object.keys($.chch_cache.data[id]).length === 0) {
          delete $.chch_cache.data[id];
        } else {
          delete $.chch_cache.data[id][key];
        }
        return _this;
      });
    }
  });
})(chocolatechipjs);
(function($) {
  var slice = function(elements) {
    return [].slice.apply(elements);
  };
  $.fn.extend({
    each: function(callback, ctx) {
      if (!this.length)
        return [];
      if (typeof callback !== "function") {
        return;
      }
      var i;
      var l = this.length;
      ctx = arguments[1];
      for (i = 0; i < l; i++) {
        if (i in this) {
          if (this.hasOwnProperty(i)) {
            callback.call(ctx, this[i], i, this);
          }
        }
      }
      return this;
    },
    unique: function() {
      var ret = [];
      var sort = this.sort();
      sort.forEach(function(ctx, idx) {
        if (ret.indexOf(ctx) === -1) {
          ret.push(ctx);
        }
      });
      ret.sort(function(a, b) {
        return a - b;
      });
      return ret.length ? ret : [];
    },
    find: function(selector, context) {
      var ret = [];
      if (!this.length)
        return ret;
      if (context) {
        $(context).forEach(function() {
          slice(context.querySelectorAll(selector)).forEach(function(node) {
            return ret.push(node);
          });
        });
      } else {
        $(this).forEach(function(ctx) {
          if (ctx.children && ctx.children.length) {
            slice(ctx.querySelectorAll(selector)).forEach(function(node) {
              return ret.push(node);
            });
          }
        });
      }
      return ret;
    },
    eq: function(index) {
      if (!this.length)
        return [];
      index = Number(index);
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
    index: function(element) {
      if (!this.length)
        return undefined;
      var $this;
      if (!element) {
        $this = $(this[0]);
        return $this.parent().children().indexOf($this[0]);
      } else {
        if (element instanceof Array) {
          return this.indexOf(element[0]);
        } else if (element.nodeType === 1) {
          return this.indexOf(element);
        } else {
          return this.indexOf(element);
        }
      }
    },
    is: function(arg) {
      if (!this.length || !arg)
        return [];
      if (!this.length)
        return [];
      var items = [];
      var $this;
      var __is = function(node, arg) {
        $this = this;
        if (typeof arg === 'string') {
          if (slice(node.parentNode.querySelectorAll(arg)).indexOf(node) >= 0) {
            return node;
          }
        } else if (typeof arg === 'function') {
          if (arg.call($this)) {
            return node;
          }
        } else if (arg && arg.length) {
          if (this.slice.apply(arg).indexOf(node) !== -1) {
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
    isnt: function(arg) {
      if (!this.length)
        return [];
      var items = [];
      var $this;
      var __isnt = function(node, arg) {
        $this = this;
        if (typeof arg === 'string') {
          if (slice(node.parentNode.querySelectorAll(arg)).indexOf(node) === -1) {
            return node;
          }
        } else if (typeof arg === 'function') {
          if (arg.call($this)) {
            return node;
          }
        } else if (arg.length) {
          if (slice(arg).indexOf(node) === -1) {
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
    has: function(arg) {
      if (!this.length)
        return [];
      var items = [];
      var __has = function(node, arg) {
        if (typeof arg === 'string') {
          if (node.querySelector(arg)) {
            return node;
          }
        } else if (arg.nodeType === 1) {
          if (slice(this.children).indexOf(arg)) {
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
    hasnt: function(arg) {
      if (!this.length)
        return [];
      var items = [];
      this.each(function(item) {
        if (typeof arg === 'string') {
          if (!item.querySelector(arg)) {
            items.push(item);
          }
        } else if (arg.nodeType === 1) {
          if (!slice(item.children).indexOf(arg)) {
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
    prev: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        if (node.previousElementSibling) {
          ret.push(node.previousElementSibling);
        }
      });
      return ret;
    },
    next: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        if (node.nextElementSibling) {
          ret.push(node.nextElementSibling);
        }
      });
      return ret;
    },
    first: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        if (node.firstElementChild) {
          ret.push(node.firstElementChild);
        }
      });
      return ret;
    },
    last: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        if (node.lastElementChild) {
          ret.push(node.lastElementChild);
        }
      });
      return ret;
    },
    before: function(content) {
      if (!this.length)
        return [];
      var __before = function(node, content) {
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
          node.insertAdjacentElement('beforeBegin', content);
        }
        return node;
      };
      this.each(function(node) {
        return __before(node, content);
      });
      return this;
    },
    after: function(args) {
      if (!this.length)
        return [];
      var __after = function(node, content) {
        var parent = node.parentNode;
        if (typeof content === 'string') {
          content = $.make(content);
        }
        if (content && content.constructor === Array) {
          var i = 0,
            len = content.length;
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
        return __after(node, args);
      });
      return this;
    },
    children: function(selector) {
      if (!this.length)
        return [];
      var ret = [];
      if (!selector) {
        this.each(function(node) {
          slice(node.children).forEach(function(ctx) {
            return ret.push(ctx);
          });
        });
      } else {
        this.forEach(function(node) {
          slice(node.children).forEach(function(ctx) {
            if ($(ctx).is(selector)[0]) {
              ret.push(ctx);
            }
          });
        });
      }
      return ret;
    },
    siblings: function(selector) {
      if (!this.length)
        return [];
      var _siblings;
      var ret = [];
      if (selector && (typeof selector === 'string')) {
        selector = selector;
      } else {
        selector = false;
      }
      this.each(function(ctx) {
        _siblings = $(ctx).parent().children();
        _siblings.splice(_siblings.indexOf(ctx), 1);
        if (selector) {
          _siblings.each(function(node) {
            if ($(node).is(selector)[0]) {
              ret.push(node);
            }
          });
        } else {
          _siblings.each(function(node) {
            return ret.push(node);
          });
        }
      });
      return ret.length ? ret.unique() : this;
    },
    parent: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(ctx) {
        return ret.push(ctx.parentNode);
      });
      ret = ret.unique();
      return $.returnResult(ret);
    },
    ancestor: function(selector) {
      if (!this.length)
        return [];
      var ret = [];
      if (typeof selector === 'undefined') {
        return [];
      }
      var el = this[0];
      var position = null;
      var p = el.parentNode;
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
      } else if (typeof selector === 'string') {
        if ($(p).is(selector).length) {
          ret.push(p);
        } else {
          ret.push($(p).ancestor(selector)[0]);
        }
      }
      return ret;
    },
    closest: function(selector) {
      return this.ancestor(selector);
    },
    insert: function(content, position) {
      if (!this.length)
        return [];
      var __insert = function(node, content, position) {
        if (node instanceof Array) {
          node = node[0];
        }
        var c = [];
        if (typeof content === 'string') {
          c = $['make'](content);
        } else if (content && content.nodeType === 1) {
          c.push(content);
        } else if (content instanceof Array) {
          c = content;
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
            if (node.firstElementChild) {
              while (i < len) {
                node.insertBefore(c[i], node.firstChild);
                i++;
              }
            } else {
              while (i < len) {
                node.insertBefore(c[i], node.firstChild);
                i++;
              }
            }
          }
        } else {
          while (i < len) {
            node.insertBefore(c[i], node.childNodes[position]);
            i++;
          }
        }
        return node;
      };
      var cnt = content;
      if (typeof cnt === 'string') {
        this.each(function(node) {
          return __insert(node, content, position);
        });
      } else if (cnt instanceof Array) {
        this.each(function(node, idx) {
          if (position === 1 || position === 'first') {
            cnt = cnt.reverse();
          }
          cnt.each(function(n, i) {
            return __insert(node, n, position);
          });
        });
      } else if (cnt.nodeType === 1) {
        this.each(function(node) {
          return __insert(node, cnt, position);
        });
      }
      return this;
    },
    prepend: function(content) {
      if (!this.length)
        return [];
      this.insert(content, 'first');
      return this;
    },
    append: function(content) {
      if (!this.length)
        return [];
      this.insert(content, 'last');
      return this;
    },
    prependTo: function(selector) {
      if (!this.length)
        return [];
      this.reverse();
      this.each(function(item) {
        return $(selector)[0].insertBefore(item, $(selector)[0].firstChild);
      });
      return this;
    },
    appendTo: function(selector) {
      if (!this.length)
        return [];
      this.each(function(item) {
        return $(selector).append(item);
      });
      return this;
    },
    remove: function() {
      if (!this.length)
        return [];
      this.each(function(ctx) {
        $(ctx).unbind();
        $(ctx).removeData();
        ctx.parentNode.removeChild(ctx);
      });
    },
    wrap: function(string) {
      if (!this.length)
        return [];
      this.each(function(ctx) {
        var tempNode = $.make(string);
        tempNode = tempNode[0];
        var whichClone = $(ctx).clone(true);
        $(tempNode).append(whichClone);
        ctx.parentNode.insertBefore(tempNode, ctx.nextSibling);
        $(ctx).remove(ctx);
      });
    },
    unwrap: function() {
      if (!this.length)
        return [];
      var parentNode = null;
      this.each(function(node) {
        if (node.parentNode === parentNode) {
          return;
        }
        parentNode = node.parentNode;
        if (node.parentNode.nodeName === 'BODY') {
          return false;
        }
        $['replace'](node, node.parentNode);
      });
      return this;
    },
    clone: function(value) {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(ctx) {
        if (value === true || !value) {
          ret.push(ctx.cloneNode(true));
        } else {
          ret.push(ctx.cloneNode(false));
        }
      });
      return $.returnResult(ret);
    },
    css: function(property, value) {
      if (!this.length)
        return [];
      var ret = [];
      if (!property)
        return [];
      if (!value && property instanceof Object) {
        if (!this.length)
          return;
        this.forEach(function(node) {
          for (var key in property) {
            if (property.hasOwnProperty(key)) {
              node.style[$.camelize(key)] = property[key];
            }
          }
          ret.push(node);
        });
      } else if (!value && typeof property === 'string') {
        if (!this.length)
          return;
        return document.defaultView.getComputedStyle(this[0], null).getPropertyValue(property.toLowerCase());
      } else if (!!value) {
        if (!this.length)
          return [];
        this.forEach(function(node) {
          node.style[$.camelize(property)] = value;
          ret.push(node);
        });
      }
      return $.returnResult(ret);
    },
    width: function() {
      if (!this.length)
        return;
      return this.eq(0)[0].clientWidth;
    },
    height: function() {
      if (!this.length)
        return;
      return this.eq(0)[0].clientHeight;
    },
    offset: function() {
      if (!this.length)
        return;
      var offset = this.eq(0)[0].getBoundingClientRect();
      return {
        top: Math.round(offset.top),
        left: Math.round(offset.left),
        bottom: Math.round(offset.bottom),
        right: Math.round(offset.right)
      };
    },
    empty: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(ctx) {
        $(ctx).unbind();
        ctx.textContent = '';
        ret.push(ctx);
      });
      return $.returnResult(ret);
    },
    html: function(content) {
      if (!this.length)
        return [];
      var ret = [];
      var __html = function(node, content) {
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
      return $.returnResult(ret);
    },
    text: function(string) {
      if (!this.length)
        return [];
      var ret = '';
      var __text = function(node, value) {
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
    val: function(value) {
      if (!this.length)
        return [];
      if (typeof value === 'string') {
        this[0].value = value;
        return this;
      } else {
        if (this[0] && this[0].value) {
          return this[0].value;
        } else {
          return;
        }
      }
    },
    prop: function(property, value) {
      if (!this.length)
        return [];
      if (value === false) {
        this[0][property] = false;
        return [this[0]];
      } else if (value) {
        this[0][property] = property;
        return [this[0]];
      } else {
        return this[0][property];
      }
    },
    removeProp: function(property) {
      if (!this.length)
        return [];
      this[0][property] = false;
      return [this[0]];
    },
    addClass: function(className) {
      if (!this.length)
        return [];
      if (typeof className !== "string")
        return;
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
      return $.returnResult(ret);
    },
    hasClass: function(className) {
      if (!this.length)
        return [];
      var ret = [];
      var tokens = [];
      if (/\s/.test(className)) {
        tokens = className.split(' ');
      }
      this.each(function(node) {
        if (tokens.length) {
          tokens.forEach(function(name) {
            if (node && node.classList && node.classList.contains(name)) {
              ret.push(node);
            }
          });
          ret = ret.unique();
        } else if (node && node.classList && node.classList.contains(className)) {
          ret.push(node);
        }
      });
      return $.returnResult(ret);
    },
    removeClass: function(className) {
      if (!this.length)
        return [];
      var ret = [];
      var classes;
      this.each(function(node) {
        if (!node)
          return;
        if (/\s/.test(className)) {
          classes = className.split(' ');
          classes.each(function(name) {
            node.classList.remove(name);
          });
        } else {
          node.classList.remove(className);
        }
        if (node.getAttribute('class') === '') {
          node.removeAttribute('class');
        }
        ret.push(node);
      });
      return $.returnResult(ret);
    },
    toggleClass: function(className) {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        node.classList.toggle(className);
        ret.push(node);
      });
      return $.returnResult(ret);
    },
    attr: function(property, value) {
      if (!this.length)
        return [];
      var ret = [];
      var __attr = function(node, property, value) {
        if (!value) {
          return node.getAttribute(property);
        } else {
          return node.setAttribute(property, value);
        }
      };
      if (!value) {
        if (this[0].hasAttribute(property)) {
          return this[0].getAttribute(property);
        }
      } else {
        this.each(function(node) {
          __attr(node, property, value);
          ret.push(node);
        });
      }
      if (ret.length) {
        return ret;
      }
    },
    hasAttr: function(property) {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        if (node.hasAttribute(property)) {
          ret.push(node);
        }
      });
      return $.returnResult(ret);
    },
    removeAttr: function(attribute) {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        if (!!node.hasAttribute(attribute)) {
          node.removeAttribute(attribute);
          ret.push(node);
        }
      });
      return $.returnResult(ret);
    },
    disable: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        node.classList.add('disabled');
        node.setAttribute('disabled', true);
        node.style.cursor = 'default';
      });
      return $.returnResult(ret);
    },
    enable: function() {
      if (!this.length)
        return [];
      var ret = [];
      this.each(function(node) {
        node.classList.remove('disabled');
        node.removeAttribute('disabled');
        node.style.cursor = 'auto';
      });
      return $.returnResult(ret);
    },
    hide: function(speed, callback) {
      if (!this.length)
        return [];
      var cbk = callback || $.noop;
      if (!this.length)
        return [];
      var ret = [];
      var css = '';
      var storedDimensions = {};
      var cssAnim = {
        opacity: 0,
        height: 0,
        padding: 0
      };
      var transition = $.isWebkit ? '-webkit-transition' : 'transition';
      this.each(function(ctx) {
        storedDimensions['padding'] = $(ctx).css('padding');
        storedDimensions['height'] = $(ctx).css('height');
        storedDimensions['opacity'] = $(ctx).css('opacity');
        storedDimensions['display'] = $(ctx).css('display');
        $(ctx).data('ui-dimensions', storedDimensions);
        if (typeof speed === 'string') {
          if (speed === 'slow') {
            $(ctx).css({
              transition: 'all 1s ease-out'
            });
            $(ctx).css(cssAnim);
            setTimeout(function() {
              $(ctx).css({
                visibility: 'hidden',
                display: 'none'
              });
              cbk.apply(ctx, arguments);
            }, 1000);
          } else if (speed === 'fast') {
            $(ctx).css({
              transition: 'all .35s ease-in-out'
            });
            $(ctx).css(cssAnim);
            setTimeout(function() {
              $(ctx).css({
                visibility: 'hidden',
                display: 'none'
              });
              cbk.apply(ctx, arguments);
            }, 350);
          }
        } else if (typeof speed === 'number') {
          css = 'all ' + speed + 'ms ease-in-out';
          $(ctx).css({
            transition: css
          });
          $(ctx).css(cssAnim);
          setTimeout(function() {
            $(ctx).css({
              visibility: 'hidden',
              display: 'none'
            });
            cbk.apply(ctx, arguments);
          }, speed);
        }
        if (!callback && typeof speed === 'function') {
          $(ctx).css({
            display: 'none',
            visibility: 'hidden'
          });
          speed.apply(ctx, arguments);
        }
        if (!speed) {
          $(ctx).data('', '');
          $(ctx).css({
            display: 'none',
            visibility: 'hidden'
          });
        }
        ret.push(ctx);
      });
      return $.returnResult(ret);
    },
    show: function(speed, callback) {
      if (!this.length)
        return [];
      var cbk = callback || $.noop;
      var createCSSAnim = function(opacity, height, padding) {
        return {
          opacity: opacity,
          height: height,
          padding: padding
        };
      };
      var transition = $['isWebkit'] ? '-webkit-transition' : 'transition';
      this.each(function(ctx) {
        var storedDimensions = $(ctx).data('ui-dimensions');
        var height = storedDimensions && storedDimensions['height'] || 'auto';
        var padding = storedDimensions && storedDimensions['padding'] || 'auto';
        var opacity = storedDimensions && storedDimensions['opacity'] || 1;
        var display = storedDimensions && storedDimensions['display'] || 'block';
        if (typeof speed === 'string') {
          if (speed === 'slow') {
            $(ctx).css({
              visibility: 'visible',
              display: display
            });
            setTimeout(function() {
              $(ctx).css({
                transition: 'all 1s ease-out'
              });
              $(ctx).css(createCSSAnim(opacity, height, padding));
              setTimeout(function() {
                cbk.apply(ctx, arguments);
              }, 1000);
            });
          } else if (speed === 'fast') {
            $(ctx).css({
              visibility: 'visible',
              display: display
            });
            setTimeout(function() {
              $(ctx).css({
                transition: 'all .250s ease-out'
              });
              $(ctx).css(createCSSAnim(opacity, height, padding));
              setTimeout(function() {
                cbk.apply(ctx, arguments);
              }, 250);
            });
          }
        } else if (typeof speed === 'number') {
          $(ctx).css({
            visibility: 'visible',
            display: display
          });
          setTimeout(function() {
            $(ctx).css({
              transition: 'all ' + speed + 'ms ease-out'
            });
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
    animate: function(options, duration, easing) {
      if (!this.length)
        return [];
      var onEnd = null;
      duration = duration || '.5s';
      easing = easing || 'linear';
      var css = {};
      var transition;
      var transitionEnd;
      if ('ontransitionend' in window) {
        transition = 'transition';
        transitionEnd = 'transitionend';
      } else {
        transition = '-webkit-transition';
        transitionEnd = 'webkitTransitionEnd';
      }
      css[transition] = 'all ' + duration + ' ' + easing;
      this.forEach(function(ctx) {
        for (var prop in options) {
          if (prop === 'onEnd') {
            onEnd = options[prop];
            $(ctx).bind(transitionEnd, onEnd());
          } else {
            css[prop] = options[prop];
          }
        }
        $(ctx).css(css);
      });
      return this;
    }
  });
})(chocolatechipjs);
(function($) {
  $.fn.extend({
    bind: function(event, callback, capturePhase) {
      if (!this.length)
        return [];
      capturePhase = capturePhase || false;
      this.each(function(ctx) {
        $.chch_cache.events.set(ctx, event, callback, capturePhase);
      });
      return this;
    },
    unbind: function(event, callback, capturePhase) {
      var _this = this;
      if (!this.length)
        return [];
      var id;
      this.each(function(ctx) {
        if (!ctx.id || !$.chch_cache.events.hasKey(ctx.id)) {
          return _this;
        }
        capturePhase = capturePhase || false;
        id = ctx.getAttribute('id');
        $.chch_cache.events._delete(id, event, callback, capturePhase);
      });
      return this;
    },
    delegate: function(selector, event, callback, capturePhase) {
      if (!this.length)
        return [];
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
              } catch (err) {}
            }
          });
        }, capturePhase);
      });
    },
    undelegate: function(selector, event, callback, capturePhase) {
      if (!this.length)
        return [];
      this.each(function(ctx) {
        return $(ctx).unbind(event, callback, capturePhase);
      });
    },
    on: function(event, selector, callback, capturePhase) {
      if (!this.length)
        return [];
      if (!selector && /Object/img.test(event.constructor.toString())) {
        this.each(function(ctx) {
          for (var key in event) {
            if (event.hasOwnProperty(key)) {
              $(ctx).on(key, event[key]);
            }
          }
        });
      }
      var ret = [];
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
    off: function(event, selector, callback, capturePhase) {
      if (!this.length)
        return [];
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
    trigger: function(event) {
      if (!this.length)
        return [];
      this.each(function(ctx) {
        if (document.createEvent) {
          var evtObj = document.createEvent('Events');
          evtObj.initEvent(event, true, false);
          ctx.dispatchEvent(evtObj);
        }
      });
    }
  });
})(chocolatechipjs);
(function() {
  var extend;
  var cycle;
  var queue;
  extend = function(obj, name, val, config) {
    return Object.defineProperty(obj, name, {
      value: val,
      writable: true,
      configurable: config !== false
    });
  };
  queue = (function() {
    var first, last, item;

    function Item(func, self) {
      this.func = func;
      this.self = self;
      this.next = undefined;
    }
    return {
      add: function(func, self) {
        item = new Item(func, self);
        if (last) {
          last.next = item;
        } else {
          first = item;
        }
        last = item;
        item = undefined;
      },
      unshift: function() {
        var f = first;
        first = last = cycle = undefined;
        while (f) {
          f.func.call(f.self);
          f = f.next;
        }
      }
    };
  })();

  function schedule(func, self) {
    queue.add(func, self);
    if (!cycle) {
      cycle = setTimeout(queue.unshift);
    }
  }

  function isThenable(obj) {
    var _then, obj_type = typeof obj;
    if (obj !== null && (obj_type === "object" || obj_type === "function")) {
      _then = obj.then;
    }
    return typeof _then === "function" ? _then : false;
  }

  function notify() {
    for (var i = 0; i < this.chain.length; i++) {
      notifyIsolated(this, (this.state === 1) ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
    }
    this.chain.length = 0;
  }

  function notifyIsolated(self, callback, chain) {
    var ret, _then;
    try {
      if (callback === false) {
        chain.reject(self.msg);
      } else {
        if (callback === true) {
          ret = self.msg;
        } else {
          ret = callback.call(undefined, self.msg);
        }
        if (ret === chain.promise) {
          chain.reject(new TypeError("Promise-chain cycle"));
        } else if (_then = isThenable(ret)) {
          _then.call(ret, chain.resolve, chain.reject);
        } else {
          chain.resolve(ret);
        }
      }
    } catch (err) {
      chain.reject(err);
    }
  }

  function resolve(msg) {
    var _then, deferred, self = this;
    if (self.triggered) {
      return;
    }
    self.triggered = true;
    if (self.deferred) {
      self = self.deferred;
    }
    try {
      if (_then = isThenable(msg)) {
        schedule(function() {
          var deferred_wrapper = new MakeDeferred(self);
          try {
            _then.call(msg, function() {
              resolve.apply(deferred_wrapper, arguments);
            }, function() {
              reject.apply(deferred_wrapper, arguments);
            });
          } catch (err) {
            reject.call(deferred_wrapper, err);
          }
        });
      } else {
        self.msg = msg;
        self.state = 1;
        if (self.chain.length > 0) {
          schedule(notify, self);
        }
      }
    } catch (err) {
      reject.call(new MakeDeferred(self), err);
    }
  }

  function reject(msg) {
    var self = this;
    if (self.triggered) {
      return;
    }
    self.triggered = true;
    if (self.deferred) {
      self = self.deferred;
    }
    self.msg = msg;
    self.state = 2;
    if (self.chain.length > 0) {
      schedule(notify, self);
    }
  }

  function iteratePromises(Constructor, arr, resolver, rejecter) {
    for (var idx = 0; idx < arr.length; idx++) {
      (function IIFE(idx) {
        Constructor.resolve(arr[idx]).then(function(msg) {
          resolver(idx, msg);
        }, rejecter);
      })(idx);
    }
  }

  function MakeDeferred(self) {
    this.deferred = self;
    this.triggered = false;
  }

  function Deferred(self) {
    this.promise = self;
    this.state = 0;
    this.triggered = false;
    this.chain = [];
    this.msg = undefined;
  }

  function Promise(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("Not a function");
    }
    if (this.isValidPromise !== 0) {
      throw new TypeError("Not a promise");
    }
    this.isValidPromise = 1;
    var deferred = new Deferred(this);
    this.then = function(success, failure) {
      var obj = {
        success: typeof success === "function" ? success : true,
        failure: typeof failure === "function" ? failure : false
      };
      obj['promise'] = new this.constructor(function extractChain(resolve, reject) {
        if (typeof resolve !== "function" || typeof reject !== "function") {
          throw new TypeError("Not a function");
        }
        obj['resolve'] = resolve;
        obj['reject'] = reject;
      });
      deferred.chain.push(obj);
      if (deferred.state !== 0) {
        schedule(notify, deferred);
      }
      return obj['promise'];
    };
    this["catch"] = function(failure) {
      return this.then(undefined, failure);
    };
    try {
      executor.call(undefined, function(msg) {
        resolve.call(deferred, msg);
      }, function(msg) {
        reject.call(deferred, msg);
      });
    } catch (err) {
      reject.call(deferred, err);
    }
  }
  var PromisePrototype = extend({}, "constructor", Promise, false);
  extend(Promise, "prototype", PromisePrototype, false);
  extend(PromisePrototype, "isValidPromise", 0, false);
  extend(Promise, "resolve", function(msg) {
    var Constructor = this;
    if (msg && typeof msg === "object" && msg.isValidPromise === 1) {
      return msg;
    }
    return new Constructor(function executor(resolve, reject) {
      if (typeof resolve !== "function" || typeof reject !== "function") {
        throw new TypeError("Not a function");
      }
      resolve(msg);
    });
  });
  extend(Promise, "reject", function(msg) {
    return new this(function executor(resolve, reject) {
      if (typeof resolve !== "function" || typeof reject !== "function") {
        throw new TypeError("Not a function");
      }
      reject(msg);
    });
  });
  extend(Promise, "all", function(arr) {
    var Constructor = this;
    if (Object.prototype.toString.call(arr) !== "[object Array]") {
      return Constructor.reject(new TypeError("Not an array"));
    }
    if (arr.length === 0) {
      return Constructor.resolve([]);
    }
    return new Constructor(function executor(resolve, reject) {
      if (typeof resolve !== "function" || typeof reject !== "function") {
        throw new TypeError("Not a function");
      }
      var len = arr.length,
        msgs = new Array(len),
        count = 0;
      iteratePromises(Constructor, arr, function resolver(idx, msg) {
        msgs[idx] = msg;
        if (++count === len) {
          resolve(msgs);
        }
      }, reject);
    });
  });
  extend(Promise, "race", function(arr) {
    var Constructor = this;
    if (Object.prototype.toString.call(arr) !== "[object Array]") {
      return Constructor.reject(new TypeError("Not an array"));
    }
    return new Constructor(function executor(resolve, reject) {
      if (typeof resolve !== "function" || typeof reject !== "function") {
        throw new TypeError("Not a function");
      }
      iteratePromises(Constructor, arr, function resolver(idx, msg) {
        resolve(msg);
      }, reject);
    });
  });
  if ("Promise" in window && "resolve" in window['Promise'] && "reject" in window['Promise'] && "all" in window['Promise'] && "race" in window['Promise']) {
    return;
  } else {
    return window['Promise'] = Promise;
  }
})();
var MethodEnum;
(function(MethodEnum) {
  MethodEnum[MethodEnum["OPTIONS"] = 0] = "OPTIONS";
  MethodEnum[MethodEnum["GET"] = 1] = "GET";
  MethodEnum[MethodEnum["HEAD"] = 2] = "HEAD";
  MethodEnum[MethodEnum["POST"] = 3] = "POST";
  MethodEnum[MethodEnum["PUT"] = 4] = "PUT";
  MethodEnum[MethodEnum["DELETE"] = 5] = "DELETE";
  MethodEnum[MethodEnum["TRACE"] = 6] = "TRACE";
  MethodEnum[MethodEnum["CONNECT"] = 7] = "CONNECT";
})(MethodEnum || (MethodEnum = {}));
var ForbiddenMethodEnum;
(function(ForbiddenMethodEnum) {
  ForbiddenMethodEnum[ForbiddenMethodEnum["CONNECT"] = 0] = "CONNECT";
  ForbiddenMethodEnum[ForbiddenMethodEnum["TRACE"] = 1] = "TRACE";
  ForbiddenMethodEnum[ForbiddenMethodEnum["TRACK"] = 2] = "TRACK";
})(ForbiddenMethodEnum || (ForbiddenMethodEnum = {}));

function isForbiddenMethod(method) {
  if (ForbiddenMethodEnum[method] !== undefined) {
    return true;
  }
  return false;
}
(function(self) {
  'use strict';
  if (self.fetch) {
    return;
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  function Headers(headers) {
    this.map = {};
    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }
  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var list = this.map[name];
    if (!list) {
      list = [];
      this.map[name] = list;
    }
    list.push(value);
  };
  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };
  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)];
    return values ? values[0] : null;
  };
  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || [];
  };
  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };
  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)];
  };
  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  };

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader);
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    reader.readAsText(blob);
    return fileReaderReady(reader);
  }
  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    })(),
    formData: 'FormData' in self
  };

  function Body() {
    this.bodyUsed = false;
    this._initBody = function(body) {
      this._bodyInit = body;
      if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (!body) {
        this._bodyText = '';
      } else {
        throw new Error('unsupported BodyInit type');
      }
    };
    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }
        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };
      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer);
      };
      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }
        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text');
        } else {
          return Promise.resolve(this._bodyText);
        }
      };
    } else {
      this.text = function() {
        var rejected = consumed(this);
        return rejected ? rejected : Promise.resolve(this._bodyText);
      };
    }
    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode);
      };
    }
    this.json = function() {
      return this.text().then(JSON.parse);
    };
    return this;
  }
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var uppercased = method.toUpperCase();
    return (methods.indexOf(uppercased) > -1) ? uppercased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = input;
    }
    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;
    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function headers(xhr) {
    var head = new Headers();
    var pairs = xhr.getAllResponseHeaders().trim().split('\n');
    pairs.forEach(function(header) {
      var split = header.trim().split(':');
      var key = split.shift().trim();
      var value = split.join(':').trim();
      head.append(key, value);
    });
    return head;
  }
  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }
    this._initBody(bodyInit);
    this.type = 'default';
    this.url = null;
    this.status = options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText;
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
    this.url = options.url || '';
  }
  Body.call(Response.prototype);
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;
  self.fetch = function(input, init) {
    var request;
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input;
    } else {
      request = new Request(input, init);
    }
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL;
        }
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL');
        }
        return;
      }
      var reqTimeout;
      if (init && init.timeout) {
        reqTimeout = setTimeout(function() {
          reject(new TypeError('Request timed out at: ' + input));
        }, init.timeout);
      }
      xhr.onload = function() {
        clearTimeout(reqTimeout);
        var status = (xhr.status === 1223) ? 204 : xhr.status;
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'));
          return;
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        };
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };
      xhr.onerror = function() {
        clearTimeout(reqTimeout);
        reject(new TypeError('Network request failed'));
      };
      xhr.open(request.method, request.url, true);
      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }
      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });
      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
  $.extend({
    JSONPCallbacks: [],
    jsonp: function(url, opts) {
      var settings = {
        timeout: 2000,
        callbackName: 'callback',
        clear: true
      };
      if (opts) {
        $.extend(settings, opts);
      }

      function generateCallbackName() {
        var base = 'callback';
        var callbackName = settings.callbackName + '_' + ($.JSONPCallbacks.length + 1);
        $.JSONPCallbacks.push(callbackName);
        return callbackName;
      }
      var callbackName = generateCallbackName();
      return new Promise(function(resolve, reject) {
        var timeout;
        window.jsonp = window.jsonp || {};
        window.jsonp[callbackName] = function(response) {
          resolve({
            ok: true,
            json: function() {
              return Promise.resolve(response);
            }
          });
          if (timeout) {
            clearTimeout(timeout);
          }
        };
        var script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=jsonp.' + callbackName;
        document.body.appendChild(script);
        setTimeout(function() {
          script.parentNode.removeChild(script);
        });
        if (settings.clear) {
          var pos = $.JSONPCallbacks.indexOf(callbackName);
          $.JSONPCallbacks.splice(pos, 1);
        }
        timeout = setTimeout(function() {
          reject(new Error('JSONP request to ' + url + ' timed out'));
        }, settings.timeout);
      });
    },
    json: function(response) {
      return response.json();
    }
  });
})(window);
(function($) {
  "use strict";
  $.extend($, {
    serialize: function(element) {
      var form;
      var elements;
      if (typeof element === 'string') {
        form = $(element)[0];
      } else if (element && element.nodeName) {
        form = element;
      } else if (element && element[0] && element[0].nodeName) {
        form = element[0];
      } else {
        return;
      }
      if (form.nodeName !== "FORM")
        return;
      elements = [].slice.apply(form.elements);
      var names = '';
      var escaped = '';
      var words;
      var temp;
      var arr = [];
      elements.forEach(function(input) {
        if (input.nodeName === 'FIELDSET')
          return;
        if (!names) {
          names += input.name + '=';
        } else {
          names += ('&' + input.name + '=');
        }
        temp = input.value || '';
        words = temp.split(' ');
        words.forEach(function(word) {
          arr.push(encodeURIComponent(word));
        });
        escaped = words.join('+');
        names += escaped;
        escaped = '';
        words = '';
      });
      arr = [];
      return names;
    },
    form2JSON: function(rootNode, delimiter) {
      rootNode = typeof rootNode === 'string' ? $(rootNode)[0] : rootNode;
      delimiter = delimiter || '.';
      var result = {};
      var arrays = {};
      var getFieldValue = function(fieldNode) {
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
      };
      var getFormValues = function(rootNode) {
        var result = [];
        var currentNode = rootNode.firstChild;
        while (currentNode) {
          if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i)) {
            result.push({
              name: currentNode.name,
              value: getFieldValue(currentNode)
            });
          } else {
            var subresult = getFormValues(currentNode);
            result = result.concat(subresult);
          }
          currentNode = currentNode.nextSibling;
        }
        return result;
      };
      var getSelectedOptionValue = function(selectNode) {
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
      };
      var formValues = getFormValues(rootNode);
      formValues.forEach(function(item) {
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
                    arrays[arrName][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
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
    }
  });
})(chocolatechipjs);
(function($) {
  $.extend({
    subscriptions: {},
    subscribe: function(topic, callback) {
      var token = ($['uuidNum']());
      if (!$['subscriptions'][topic]) {
        $['subscriptions'][topic] = [];
      }
      $['subscriptions'][topic].push({
        token: token,
        callback: callback
      });
      return token;
    },
    publish: function(topic, args) {
      if (!$['subscriptions'][topic]) {
        return false;
      }
      setTimeout(function() {
        var len = $['subscriptions'][topic] ? $['subscriptions'][topic].length : 0;
        while (len--) {
          $['subscriptions'][topic][len].callback(topic, args);
        }
        return true;
      });
    },
    unsubscribe: function(token) {
      setTimeout(function() {
        for (var m in $['subscriptions']) {
          if ($['subscriptions'][m]) {
            for (var i = 0, len = $['subscriptions'][m].length; i < len; i++) {
              if ($['subscriptions'][m][i].token === token) {
                $['subscriptions'][m].splice(i, 1);
                return token;
              }
            }
          }
        }
        return false;
      });
    }
  });
})(chocolatechipjs);
(function($) {
  $.extend({
    templates: {},
    template: function(tmpl, variable) {
      var regex, delimiterOpen, delimiterClosed;
      variable = variable ? variable : 'data';
      regex = /\[\[=([\s\S]+?)\]\]/g;
      delimiterOpen = '[[';
      delimiterClosed = ']]';
      var template = new Function(variable, "var p=[];" + "p.push('" + tmpl.replace(/[\r\t\n]/g, " ").split("'").join("\\'").replace(regex, "',$1,'").split(delimiterOpen).join("');").split(delimiterClosed).join("p.push('") + "');" + "return p.join('');");
      return template;
    }
  });
  $.template.data = {};
  $.template.index = 0;
  $.template.repeater = function(element, tmpl, data) {
    if (!element) {
      var repeaters = $('[data-repeater]');
      $.template.index = 0;
      var imgSrc;
      var re = /data-src/img;
      repeaters.forEach(function(repeater) {
        var template = repeater.innerHTML;
        template = template.replace(re, 'src');
        var r = $(repeater);
        var d = r.attr('data-repeater');
        if (!d || !$.template.data[d]) {
          console.error("No matching data for template. Check your data assignment on $['template'].data or the template's data-repeater value.");
          return;
        }
        r.empty();
        r.removeClass('cloak');
        var t = $.template(template);
        $.template.data[d].forEach(function(item) {
          r.append(t(item));
          $.template.index += 1;
        });
        delete $.template.data[d];
      });
    } else {
      if (!$.isArray(data)) {
        console.error("$.template.repeater() requires data of type Array.");
        return "$.template.repeater() requires data of type Array.";
      } else {
        var template = $.template(tmpl);
        if ($.isArray(data)) {
          data.forEach(function(item) {
            return $(element).append(template(item));
          });
        }
      }
    }
  };
})(chocolatechipjs);
