module('Deferred Tests');

// 1
test('$.Deferred.state(): (pending)', function() {
   var defer = new $.Deferred();
   equal(defer.state(),'pending','Should return "pending".');
});

// 2
test('$.Deferred.state(): (resolved)', function() {
   var defer = new $.Deferred();
   defer.resolve();
   equal(defer.state(),'resolved','Should return "resolved".');
});

// 3
test('$.Deferred.state(): (rejected)', function() {
   var defer = new $.Deferred();
   defer.reject();
   equal(defer.state(),'rejected','Sohuld return "rejected".');
});

// 4
test('Deferred should not change state after resolve or reject:', function() {
   var defer = new $.Deferred();
   defer.resolve();
   defer.reject();
   equal(defer.state(),'resolved','Shuld return "resolved".');
   var defer2 = new $.Deferred();
   defer2.reject();
   defer2.resolve();
   equal(defer2.state(),'rejected','Should return "rejected".');

});

// 5
test('Deferred should execute done and always callback after resolving and not execute fail callback', function() {
   var doneFired = 0;
   var failFired = 0;
   var alwaysFired = 0;
   var defer = new $.Deferred();
   defer.done(function() {
     return doneFired += 1;
   }).fail(function() {
     return failFired += 1;
   }).always(function() {
     return alwaysFired += 1;
   });
   defer.reject();   
   equal(doneFired, 0, 'Should be 0.');
   equal(failFired, 1, 'Should be 1.');
   equal(alwaysFired, 1, 'Should be 1.');
});

// 6
test('Deferred should execute fail and always callback after rejecting and not execute done callback', function() {
   var doneFired = 0;
   var failFired = 0;
   var alwaysFired = 0;
   var defer = new $.Deferred();
   defer.done(function() {
      return doneFired += 1;
   }).fail(function() {
      return failFired += 1;
   }).always(function() {
      return alwaysFired += 1;
   });
   defer.reject();
   equal(doneFired, 0, 'Should be 0.');
   equal(failFired, 1, 'Should be 1.');
   return equal(alwaysFired, 1, 'Should be 1');  
});

// 7
test('Deferred should execute callbacks added with then.', function() {
   var doneFired = 0;
   var failFired = 0;
   var alwaysFired = 0;
   var defer = new $.Deferred();
   defer.then(function() {
      return doneFired += 1;
   }, function() {
      return failFired += 1;
   });
   defer.resolve();
   equal(doneFired, 1, 'Should be 1.');
   equal(failFired, 0, 'Should be 0.');
});

// 8
test('Deferred should execute done immediately after resolve and not execute fail.', function() {
   var doneFired = 0;
   var failFired = 0;
   var alwaysFired = 0;
   var defer = new $.Deferred();
   defer.resolve();
   defer.done(function() {
      return doneFired += 1;
   }).fail(function() {
      return failFired += 1;
   }).always(function() {
      return alwaysFired += 1;
   });   
   equal(doneFired, 1, 'Should be 1.');
   equal(failFired, 0, 'Should be 0.');
   equal(alwaysFired, 1, 'Should be 1.');
});

// 9
test('Deferred should resolve and reject with context.', function() {
   var context = [];
   var defer = new $.Deferred(); 
   defer.done(function() {
      return equal(this, context, 'Should equal context');
   });  
   defer.resolveWith(context);
   var defer2 = new $.Deferred();
   defer2.fail(function() {
      return equal(this, context, 'Should equal context');
   });
   defer2.rejectWith(context);
});

// 10
test('Deferred should resolve with arguments.', function() {
   var context = [];
   var defer = new $.Deferred(); 
   defer.done(function(firstArg, secondArg) {
      equal(firstArg, 123, 'Should equal 123');
      equal(secondArg, 'foo', 'Should equal "foo".');
   });
   defer.resolve(123, 'foo');
});

// 11
test('Deferred should reject with arguments.', function() {
   var context = [];
   var defer = new $.Deferred();
   defer.fail(function(firstArg, secondArg) {
      equal(firstArg, '123', 'Should return 123.');
      equal(secondArg, 'foo', 'Should return "foo".');
   });
   return defer.reject(123, 'foo');
});

// 12
test('Deferred should fire done with context and arguments after resolving', function() {
   var context = [];
   var defer = new $.Deferred(); 
   defer.done(function(firstArg, secondArg, thirdArg) {
      equal(firstArg, context, 'Should equal context.');
      equal(secondArg, 123, 'Should equal "123".');
      equal(thirdArg, 'foo', 'Should equal "foo".');
   });
   defer.resolve(context, 123, 'foo');
});

// 13
test('Deferred should execute fn passed to constructor.', function() {
   var executed = 0;
   var passedParam = null;
   var defer = new $.Deferred(function(param){
      passedParam = param;
      return this.done(function() {
         return executed += 1;
      })
   });
   defer.resolve();
   equal(executed, 1, 'Should be 1.');
   equal(passedParam, defer, 'Should be equal to defer.');
});

// 14
test('Promise object returned by Deferred.', function() {
   var defer = new $.Deferred();
   var promise = defer.promise();
   equal($.isObject(promise), true,'Should be an object.');
   equal(/status/img.test(promise.state.toString()), true,'Should return true for state property on object.');
   equal(/return promise/.test(promise.promise), true, 'Should return true for promise.')
});

// 15
test('Promise should execute done and always when deferred is resolved.', function() {
   var defer = new $.Deferred();
   var promise = defer.promise();
   var doneFired = 0;
   var failFired = 0;
   var alwaysFired = 0;
   promise.done(function() {
      return doneFired += 1;
   }).fail(function() {
      return failFired += 1;
   }).always(function() {
      return alwaysFired += 1;
   });
   defer.resolve();
   equal(doneFired, 1, 'Should be 1.');
   equal(failFired, 0, 'Should be 0.');
   equal(alwaysFired, 1, 'Should be 1.');
});

// 16
test('Promise should fail with correct context', function() {
   var context, defer, defer2, promise, promise2;
   context = [];
   var failFired = 0;
   defer = new $.Deferred(); 
   promise = defer.promise();
   promise.done(function() {
      return equal(this, context, 'Should equal context');
   });  
   defer.resolveWith(context);
   var defer2 = new $.Deferred();
   var promise2 = defer2.promise();
   promise2.fail(function() {
      failFired += 1;
      return equal(this, context, 'Should equal context');
   });
   defer2.rejectWith(context);
   equal(failFired, 1, 'failFired should be 1.');
});

// 17
test('Deferred.pipe should filter with function.', function() {
   var deferred, doneFired, failFired, param1, param2;
   doneFired = 0;
   failFired = 0;
   param1 = 'foo';
   param2 = 'bar';
   context = [];
   deferred = $.Deferred();

   deferred.pipe(function(string1, string2) {
      equal(string1, param1, 'Should be "foo".');
      equal(string2, param2, 'Should be "bar".');
      return string1 + string2;
   }).done(function(value) {
      equal(value, param1 + param2, 'Should be "foobar".');
      return doneFired += 1;
   }).fail(function(value) {
      return failFired += 1;
   });
   deferred.resolve(param1, param2);
   equal(doneFired, 1, 'doneFired should be 1.');
   equal(failFired, 0, 'failFired should be 0.');
   deferred = $.Deferred();
   deferred.pipe(null, function(string1, string2) {
     equal(string1, param1, 'Should be to "foo".');
     equal(string2, param2, 'Should be "bar"');
     return string1 + string2;
   }).done(function(value) {
     return doneFired += 1;
   }).fail(function(value) {
     equal(value, param1 + param2, 'Should be "foobar".');
     return failFired += 1;
   });
   deferred.reject(param1, param2);
   equal(doneFired, 1, 'doneFired should be 1.');
   return equal(failFired, 1, 'failFired should be 1.');
});

// 18
test('Deferred.pipe should filter with another observable.', function() {
      var context, deferred, doneFired, failFired, param1, param2, pipeDeferred;
      doneFired = 0;
      failFired = 0;
      param1 = 'foo';
      param2 = 'bar';
      deferred = $.Deferred();
      pipeDeferred = $.Deferred();
      deferred.pipe(function(string1, string2) {
         equal(string1, param1, 'Should be "foo".');
         equal(string2, param2, 'Should be "bar".');
         return pipeDeferred.rejectWith(this, string1, string2).promise();
      }).fail(function(passed1, passed2) {
        equal(passed1, param1, 'Should be "foo".');
        equal(passed2, param2, 'Should be "bar".');
        return failFired += 1;
      }).done(function(value) {
        return doneFired += 1;
      });

      deferred.resolve(param1, param2);
      equal(doneFired, 1, 'Should be 1.');
      equal(failFired, 0, 'Should be 0.');

      deferred = $.Deferred();
      pipeDeferred = $.Deferred();
      deferred.pipe(null, function(string1, string2) {
        equal(string1, param1, 'Should be "foo".');
        equal(string2, param2, 'Should be "bar".');
        return pipeDeferred.resolveWith(context, param1, param2);
      }).fail(function(value) {
        return failFired += 1;
      }).done(function(passed1, passed2) {
        equal(passed1, param1, 'Should be "foo".');
        equal(passed2, param2, 'Should be "bar".');
        return doneFired += 1;
      });
      deferred.reject(param1, param2);
      equal(doneFired, 1, 'Should be 1.');
      return equal(failFired, 1, 'Should be 1.');

});

// 19
test('$.when should give back a resolved promise object when called without arguments.', function() {
   var promise = $.when();
   var promise2 = $.when();
   equal($.isObject(promise), true, 'Should be an object.');
   equal(/promise/.test(promise.promise.toString()), true, 'Should return true for promise.');
   equal($.isObject(promise2), true, 'Should be an object.');
   equal(/promise/.test(promise2.promise.toString()), true, 'Should return true for promise.');
});

// 20
test("$.when should return single deferred's promise.", function() {
   var defer = new $.Deferred();
   var promise = $.when(defer);
   equal(promise, defer.promise(), 'Should be the same.');
   var defer2 = new $.Deferred();
   var promise2 = $.when(defer2);
   equal(promise2, defer2.promise(), 'Should be the same.')
})

// 21
test('$.when should reject when first deferred rejects.', function() {
   var deferreds = [new $.Deferred(), new $.Deferred(), new $.Deferred()];
   var failFired = 0;
   var promise = $.when(deferreds[0], deferreds[1], deferreds[2]);
   promise.fail(function(args) {
      //console.log(args[1])
      equal(args[0], 'foo', 'Should be foo.');
      equal(args[1], 1234, 'Should be 1234.');
      return failFired += 1;
   });
   deferreds[0].resolve();
   equal(promise.state(), 'pending', 'Should be pending.');
   deferreds[1].reject('foo', 1234);
   equal(promise.state(), 'rejected', 'Should be rejected');
   equal(failFired, 1, 'Should be 1.');
});

// 22
test('$.when should resolve when all deferreds resolve.', function() {
   var deferreds = [$.Deferred(), $.Deferred(), $.Deferred()];
   var doneFired = 0;
   var promise = $.when(deferreds[0], deferreds[1], deferreds[2]);
   promise.done(function() {
      var args = [].slice.call(arguments, 0);
      equal(args[0][0], 1, 'Should be 1.');
      equal(args[0][1], 2, 'Should be 2.');
      equal(args[1][0], 3, 'Should be 3.');
      equal(args[1][1], 4, 'Should be 4.');
      equal(args[2][0], 5, 'Should be 5.');
      equal(args[2][1], 6, 'Should be 6.');
      return doneFired += 1;
   });
   deferreds[0].resolve(1, 2);
   deferreds[1].resolve(3, 4);
   deferreds[2].resolve(5, 6);
   equal(promise.state(), 'resolved', 'Should be resolved.');

   var deferreds2 = [$.Deferred(), $.Deferred(), $.Deferred()];
   var doneFired2 = 0;
   var promise2 = $.when(deferreds2[0], deferreds2[1], deferreds2[2]);
   promise2.done(function() {
      //equal(args, [[1, 2], [3, 4], [5, 6]], 'Should return array.');
      return doneFired2 += 1;
   });
   deferreds2[0].resolve(1, 2);
   deferreds2[1].resolve(3, 4);
   deferreds2[2].resolve(5, 6);
   //equal(promise2.state(), 'resolved', 'Should be resolved.');
});

// 23 
test('Progress and notifyWith.', function() {
   var context, def, param1, param2, progressCalled;
   def = new $.Deferred();
   context = new Array();
   param1 = 'foo';
   param2 = 'bar';
   progressCalled = 0; 
   def.progress(function(value1, value2) {
      progressCalled += 1;
      equal(value1, param1, 'Should equal param1.');
      equal(value2, param2, 'Should equal param2.');
      return equal(this, context, 'Should be the context.');
   });
   def.notifyWith(context, param1, param2);
   def.notifyWith(context, param1, param2);
   equal(progressCalled, 2, 'Should equal 2.');
   def.resolve();
   def.notify();
   return equal(progressCalled, 2, 'Should equal 2.');
});