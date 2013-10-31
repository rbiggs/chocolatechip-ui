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