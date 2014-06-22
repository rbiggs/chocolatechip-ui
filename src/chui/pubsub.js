(function($) {
  "use strict";
  $.extend({
    subscriptions : {},

    // Topic: string defining topic: /some/topic
    // Data: a string, number, array or object.
    subscribe : function (topic, callback) {
      if (!$.subscriptions[topic]) {
        $.subscriptions[topic] = [];
      }
      var token = ($.Uuid());
      $.subscriptions[topic].push({
        token: token,
        callback: callback
      });
      return token;
    },

    unsubscribe : function ( token ) {
      setTimeout(function() {
        for (var m in $.subscriptions) {
          if ($.subscriptions[m]) {
              for (var i = 0, len = $.subscriptions[m].length; i < len; i++) {
                  if ($.subscriptions[m][i].token === token) {
                    $.subscriptions[m].splice(i, 1);
                    return token;
                  }
              }
          }
        }
        return false;
      });
    },

    publish : function ( topic, args ) {
      if (!$.subscriptions[topic]) {
        return false;
      }
      setTimeout(function () {
        var len = $.subscriptions[topic] ? $.subscriptions[topic].length : 0;
        while (len--) {
          $.subscriptions[topic][len].callback(topic, args);
        }
        return true;
      });
      return true;
   }
  });
})(window.$);