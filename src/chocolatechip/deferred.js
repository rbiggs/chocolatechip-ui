   $.extend({
      Deferred : function (callback) {
         var status = 'pending';
         var doneCallback = [];
         var failCallback = [];
         var progressCallback = [];
         var resultArgs = null;

         var promise = {
            done: function() {
               for (var i = 0; i < arguments.length; i++) {
                  // Skip any falsy arguments:
                  if (!arguments[i]) {
                     continue;
                  }
                  if (Array.isArray(arguments[i])) {
                     var arr = arguments[i];
                     for (var j = 0; j < arr.length; j++) {
                        // Execute callback if deferred has been resolved:
                        if (status === 'resolved') {
                           arr[j].apply(this, resultArgs);
                        }
                        doneCallback.push(arr[j]);
                     }
                  } else {
                     // Execute callback if deferred has been resolved:
                     if (status === 'resolved') {
                        arguments[i].apply(this, resultArgs);
                     }
                     doneCallback.push(arguments[i]);
                  }
               }
               return this;
            },

            fail: function() {
               for (var i = 0; i < arguments.length; i++) {
                  // Skip falsy arguments:
                  if (!arguments[i]) {
                     continue;
                  }
                  if (Array.isArray(arguments[i])) {
                     var arr = arguments[i];
                     for (var j = 0; j < arr.length; j++) {
                        // Execute callback if deferred has been resolved:
                        if (status === 'rejected') {
                           arr[j].apply(this, resultArgs);
                        }
                        failCallback.push(arr[j]);
                     }
                  } else {
                     // Execute callback if deferred has been resolved:
                     if (status === 'rejected') {
                        arguments[i].apply(this, resultArgs);
                     }
                     failCallback.push(arguments[i]);
                  }
               }
               return this;
            },

            always: function() {
               return this.done.apply(this, arguments).fail.apply(this, arguments);
            },

            progress: function() {
               for (var i = 0; i < arguments.length; i++) {
                  // Skip falsy arguments:
                  if (!arguments[i]) {
                     continue;
                  }
                  if (Array.isArray(arguments[i])) {
                     var arr = arguments[i];
                     for (var j = 0; j < arr.length; j++) {
                        // Execute callback if deferred has been resolved:
                        if (status === 'pending') {
                           progressCallback.push(arr[j]);
                        }
                     }
                  } else {
                     // Execute callback if deferred has been resolved:
                     if (status === 'pending') {
                        progressCallback.push(arguments[i]);
                     }
                  }
               }
               return this;
            },

            then: function() {
               // Fail callback:
               if (arguments.length > 1 && arguments[1]) {
                  this.fail(arguments[1]);
               }
               // Done callback:
               if (arguments.length > 0 && arguments[0]) {
                  this.done(arguments[0]);
               }
               // Progress callback:
               if (arguments.length > 2 && arguments[2]) {
                  this.progress(arguments[2]);
               }
            },

            promise: function(obj) {
               if (obj === null || obj === undefined) {
                  return promise;
               } else {
                  for (var i in promise) {
                     obj[i] = promise[i];
                  }
                  return obj;
               }
            },

            state: function() {
               return status;
            },

            debug: function() {
               console.log('[debug]', doneCallback, failCallback, status);
            },

            isRejected: function() {
               return status === 'rejected';
            },

            isResolved: function() {
               return status === 'resolved';
            },

            pipe: function(done, fail) {
               // Private method to execute handlers in pipe:
               var executeHandler = function(array, handler) {
                  if ($.isArray(array)) {
                     for (var i = 0; i < array.length; i++) {
                        handler(array[i]);
                     }
                  } else {
                     handler(array);
                  }
               };
               return $.Deferred(function(def) {
                  executeHandler(done, function(func) {
                     // Filter function:
                     if (typeof func === 'function') {
                        deferred.done(function() {
                           var returnVal = func.apply(this, arguments);
                           // If a new deferred/promise is returned, 
                           // its state is passed to the current deferred/promise:
                           if (returnVal && typeof returnVal === 'function') {
                              returnVal.promise().then(def.resolve, def.reject, def.notify);
                           } else { 
                              // If new return val is passed, 
                              // it is passed to the piped done:
                              def.resolve(returnVal);
                           }
                        });
                     } else {
                        deferred.done(def.resolve);
                     }
                  });
                  executeHandler(fail, function(func) {
                     if (typeof func === 'function') {
                        deferred.fail(function() {
                           var returnVal = func.apply(this, arguments);
                           if (returnVal && typeof returnVal === 'function') {
                              returnVal.promise().then(def.resolve, def.reject, def.notify);
                           } else {
                              def.reject(returnVal);
                           }
                        });
                     } else {
                        deferred.fail(def.reject);
                     }
                  });
               }).promise();
            }
         };

         var deferred = {
            resolveWith: function(context) {
               if (status === 'pending') {
                  status = 'resolved';
                  resultArgs = (arguments.length > 1) ? arguments[1] : [];
                  for (var i = 0; i < doneCallback.length; i++) {
                     doneCallback[i].apply(context, resultArgs);
                  }
               }
               return this;
            },

            rejectWith: function(context) {
               if (status === 'pending') {
                  status = 'rejected';
                  resultArgs = (arguments.length > 1) ? arguments[1] : [];
                  for (var i = 0; i < failCallback.length; i++) {
                     failCallback[i].apply(context, resultArgs);
                  }
               }
               return this;
            },

            notifyWith: function(context) {
               if (status === 'pending') {
                  resultArgs = 2 <= arguments.length ? $.slice.call(arguments, 1) : [];
                  for (var i = 0; i < progressCallback.length; i++) {
                     progressCallback[i].apply(context, resultArgs);
                  }
               }
               return this;
            },

            resolve: function() {
               return this.resolveWith(this, arguments);
            },

            reject: function() {
               return this.rejectWith(this, arguments);
            },

            notify: function() {
               return this.notifyWith(this, arguments);
            }
         };

         var obj = promise.promise(deferred);

         if (callback) {
            callback.apply(obj, [obj]);
         }

         return obj;
      }
   });

   $.extend({
      when : function() {
         if (arguments.length < 2) {
            var obj = arguments.length ? arguments[0] : undefined;
            if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
               return obj.promise();         
            } else {
               return $.Deferred().resolve(obj).promise();
            }
         } else {
            return (function(args) {
               var D = $.Deferred();
               var size = args.length;
               var done = 0;  
               var params = [];
               params.length = size;
                  // Resolve params: params of each resolve, 
                  // we need to track them down to be able to pass them in 
                  // the correct order if the master needs to be resolved:
               for (var i = 0; i < args.length; i++) {
                  (function(j) {
                     args[j].done(function() { params[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done === size) { D.resolve.apply(D, params); }})
                     .fail(function() { D.reject(arguments); });
                  })(i);
               }
               return D.promise();
            })(arguments);
         }
      }
   });