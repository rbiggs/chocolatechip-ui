(function($) {
  "use strict";
  $.fn.extend({
    ////////////////////////
    // Create Busy indicator
    ////////////////////////
    /*
      var options = {
        color: 'red',
        size: '80px',
        position: 'right'
      }
    */
    UIBusy : function ( options ) {
      var count = 1;
      options = options || {};
      var settings = {
        size: 43,
        color: '#000',
        position: false,
        duration: '2s'
      };
      $.extend(settings, options);
      var $this = this;
      var spinner;
      // For iOS:
      var iOSBusy = function() {
        var webkitAnim = {'-webkit-animation-duration': settings.duration};
        spinner = $('<span class="busy"></span>');
        $(spinner).css({'background-color': settings.color, 'height': settings.size + 'px', 'width': settings.size + 'px'});
        $(spinner).css(webkitAnim);
        $(spinner).attr('role','progressbar');
        if (settings.position) $(spinner).addClass(settings.position);
        $this.append(spinner);
        return this;
      };
      // For Android:
      var androidBusy = function() {
        settings.id = $.Uuid();
        var androidActivityIndicator = null;
        var position = settings.position ? (' ' + settings.position) : '';
        if ($.isNativeAndroid) {
          androidActivityIndicator = '<svg class="busy' + position + '" version="1.1" id="' + settings.id + '" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g><path fill="none" stroke="' + settings.color + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M74.2,65c2.7-4.4,4.3-9.5,4.3-15c0-15.7-12.8-28.5-28.5-28.5S21.5,34.3,21.5,50c0,5.5,1.6,10.6,4.3,15"/></g><polyline fill="none" stroke="' + settings.color + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="89.4,56.1 74.3,65 65.4,49.9 "/></svg>';

          $this.append(androidActivityIndicator);
          return;
        } else {
          androidActivityIndicator = '<svg id="'+ settings.id +'" class="busy' + position + '" x="0px" y="0px" viewBox="0 0 100 100"><circle stroke="url(#SVGID_1_)" cx="50" cy="50" r="28.5"/></svg>';
          $this.append(androidActivityIndicator);
          $this.addClass('hasActivityIndicator');
          if (settings.position) {
            $('#' + settings.id).addClass(settings.position);
          }
          if (options.color) {
            $('#' + settings.id).find('circle').css('stroke', options.color);
          }
        }
        $('#' + settings.id).css({'height': settings.size + 'px', 'width': settings.size + 'px'});
        return $('#' + settings.id);
      };
      // For Windows 8/WP8:
      var winBusy = function() {
        spinner = $('<progress class="busy"></progress>');
        $(spinner).css({ 'color': settings.color });
        $(spinner).attr('role','progressbar');
        $(spinner).addClass('win-ring');
        if (settings.position) $(spinner).addClass(settings.position);
        $this.append(spinner);
        return this;
      };
      // Create Busy control for appropriate OS:
      if ($.isWin) {
        winBusy(options);
      } else if ($.isAndroid || $.isChrome) {
        androidBusy(options);
      } else if ($.isiOS || $.isSafari) {
        iOSBusy(options);
      }
    }
  });
})(window.$);