(function($) {
  "use strict";
  //////////////////////////////////////////
  // Plugin to setup automatic data binding:
  //////////////////////////////////////////
  $.extend($, {
    UIBindData : function () {

      var controllers = $('[data-controller]');
      var broadcasts = [];

      // Define function to create broadcasts:
      //======================================
      var createBroadcaster = function(controller) {
        var broadcast = 'data-binding-' + $(controller).attr('data-controller');
        broadcasts.push(broadcast);
      };

      // Loop controllers, create broadcasts,
      // subscribe models to broadcasts:
      //=====================================
      controllers.forEach(function(ctx, idx) {
        var model = $(ctx).attr('data-controller');
        createBroadcaster(ctx);
        // Subscribe and update elements with data:
        $.subscribe(broadcasts[idx], function(event, value) {
          var element = '[data-model=' + model + ']';
          $(element).text(value);
        });
      });

      // Bind events to controllers to publish broadcasts:
      //==================================================
      $('body').on('input change', '[data-controller]', function(event) {
        var broadcast = 'data-binding-' + $(this).attr('data-controller');
        $.publish(broadcast, $(this).val());
      });
    }
  });
})(window.$);