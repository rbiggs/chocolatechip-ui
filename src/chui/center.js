(function($) {
  "use strict";
  $.fn.extend({
    //////////////////////////////
    // Center an Element on Screen
    //////////////////////////////
    UICenter : function ( position ) {
      var position = position;
      if (!this[0]) return;
      var $this = $(this);
      var parent = $this.parent();
      if (position) {
        $(this.css('position', position));
      } else if ($this.css('position') === 'absolute') {
        position = 'absolute';
      } else {
        position = 'relative';
      }
      var height, width, parentHeight, parentWidth;
      if (position === 'absolute') {
        height = $this[0].clientHeight;
        width = $this[0].clientWidth;
        parentHeight = parent[0].clientHeight;
        parentWidth = parent[0].clientWidth;
      } else {
        height = parseInt($this.css('height'),10);
        width = parseInt($this.css('width'),10);
        parentHeight = parseInt(parent.css('height'),10);
        parentWidth = parseInt(parent.css('width'),10);
        $(this).css({'margin-left': 'auto', 'margin-right': 'auto'});
      }
      var tmpTop, tmpLeft;
      if (parent[0].nodeName === 'body') {
        tmpTop = ((window.innerHeight /2) + window.pageYOffset) - height /2 + 'px';
        tmpLeft = ((window.innerWidth / 2) - (width / 2) + 'px');
      } else {
        tmpTop = (parentHeight /2) - (height /2) + 'px';
        tmpLeft = (parentWidth / 2) - (width / 2) + 'px';
      }
      if (position !== 'absolute') tmpLeft = 0;
      // if (parseInt(tmpLeft,10) <= 0) tmpLeft = '10px';
      $this.css({left: tmpLeft, top: tmpTop});
    }
  });
})(window.$);