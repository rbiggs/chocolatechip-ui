var CircleSymbolPainter = function(options) {
  mergeOptions(CircleSymbolPainter.defaults, options, this);
}

CircleSymbolPainter.defaults = {
  radius: 4,
  style: {
    stroke: '#555',
    fill: '#aaa'
  },
  animation: {
    duration: 1000,
    easing: 'bounce',
    from: {scale: '0.001 0.001', opacity: 0.0},
    to: {scale: '1.0 1.0', opacity: 1.0}
  }
}

CircleSymbolPainter.prototype = {
  drawSymbol: function(paper, point) {
    point.symbolShape = paper.circle(point.x, point.y, this.radius).attr(this.style);
    point.symbolShape.topY = point.y - this.radius;
    if(this.animation) {
      point.symbolShape.attr(this.animation.from);
      point.symbolShape.animate(this.animation.to, this.animation.duration, this.animation.easing);
    }
  }
}
