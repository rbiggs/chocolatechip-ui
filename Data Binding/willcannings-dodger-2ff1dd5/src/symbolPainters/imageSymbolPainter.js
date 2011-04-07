var ImageSymbolPainter = function(options) {
  ensurePropertiesPresent(options, 'image');
  mergeOptions(ImageSymbolPainter.defaults, options, this);
}

ImageSymbolPainter.defaults = {
  image: null,
  animation: {
    duration: 1000,
    easing: 'bounce',
    from: {scale: '0.001 0.001', opacity: 0.0},
    to: {scale: '1.0 1.0', opacity: 1.0}
  }
}

ImageSymbolPainter.prototype = {
  drawSymbol: function(paper, point) {
    var x = point.x - this.halfWidth();
    var y = point.y - this.halfHeight();
    point.symbolShape = paper.image(this.image.src, x, y, this.image.width, this.image.height);
    point.symbolShape.topY = y;
    if(this.animation) {
      point.symbolShape.attr(this.animation.from);
      point.symbolShape.animate(this.animation.to, this.animation.duration, this.animation.easing);
    }
  },
  
  halfWidth: function() {
    if(!this._halfWidth)
      this._cacheImageDimensions();
    return this._halfWidth;
  },
  
  halfHeight: function() {
    if(!this._halfHeight)
      this._cacheImageDimensions();
    return this._halfHeight;    
  },
  
  _cacheImageDimensions: function() {
    this._halfWidth = Math.ceil(this.image.width / 2);
    this._halfHeight = Math.ceil(this.image.height / 2);
  }
}
