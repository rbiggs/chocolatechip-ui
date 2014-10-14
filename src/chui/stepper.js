(function($) {
  "use strict";
  $.fn.extend({
    /////////////////
    // Create stepper
    /////////////////
    /*
      var options = {
        start: 0,
        end: 10,
        defaultValue: 3
      }
    */
    UIStepper : function (options) {
      if (!options) return [];
      if (!options.start) return [];
      if (!options.end) return [];
      var stepper = $(this);
      var start = options.start;
      var end = options.end;
      var defaultValue = options.defaultValue ? options.defaultValue : options.start;
      var increaseSymbol = '+';
      var decreaseSymbol = '-';
      if ($.isWin) {
         increaseSymbol = '';
         decreaseSymbol = '';
      }
      var decreaseButton = '<button class="decrease"><span>' + decreaseSymbol + '</span></button>';
      var label = '<label>' + defaultValue + '</label><input type="text" value="' + defaultValue + '">';
      var increaseButton = '<button class="increase"><span>' + increaseSymbol + '</span></button>';
      stepper.append(decreaseButton + label + increaseButton);
      stepper.data('ui-value', {start: start, end: end, defaultValue: defaultValue});
    
      var decreaseStepperValue = function() {
        var currentValue = stepper.find('input').val();
        var value = stepper.data('ui-value');
        var start = value.start;
        var newValue;
        if (currentValue <= start) {
          $(this).addClass('disabled');
        } else {
          newValue = Number(currentValue) - 1;
          stepper.find('button:last-of-type').removeClass('disabled');
          stepper.find('label').text(newValue);
          stepper.find('input')[0].value = newValue;
          if (currentValue === start) {
            $(this).addClass('disabled');
          }
        }
      };
    
      var increaseStepperValue = function() {
        var currentValue = stepper.find('input').val();
        var value = stepper.data('ui-value');
        var end = value.end;
        var newValue;
        if (currentValue >= end) {
          $(this).addClass('disabled');
        } else {
          newValue = Number(currentValue) + 1;
          stepper.find('button:first-of-type').removeClass('disabled');
          stepper.find('label').text(newValue);
          stepper.find('input')[0].value = newValue;
          if (currentValue === end) {
            $(this).addClass('disabled');
          }
        }
      };
      stepper.find('button:first-of-type').on('singletap', function() {
        decreaseStepperValue.call(this, stepper);
      });
      stepper.find('button:last-of-type').on('singletap', function() {
        increaseStepperValue.call(this, stepper);
      });
    }
  });
  $.extend({
    ///////////////////////////////////////////
    // Pass the id of the stepper to reset.
    // It's value will be reset to the default.
    ///////////////////////////////////////////
    // Pass it the id of the stepper:
    UIResetStepper : function ( stepper ) {
      var defaultValue = stepper.data('ui-value').defaultValue;
      stepper.find('label').html(defaultValue);
      stepper.find('input')[0].value = defaultValue;
    }
  });
})(window.$);