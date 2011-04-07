var GraphPaperAxisPainter = function(options) {
  mergeOptions(GraphPaperAxisPainter.defaults, options, this);
}

GraphPaperAxisPainter.defaults = {
  length: 15,
  style: {
    fill: '#fff',
    stroke: '#f2f2f2'
  },
  animation: {
    duration: 1000,
    easing: '<>',
    from: {'stroke-opacity': 0.0},
    to: {'stroke-opacity': 1.0}
  }
}

GraphPaperAxisPainter.prototype = {
  draw: function() {
    var boxesWide = Math.ceil((this.graph.width - (2 * this.graph.gutter)) / this.length);
    var boxesHigh = Math.ceil((this.graph.height - (2 * this.graph.gutter)) / this.length);
    var paper  = this.graph.paper;
    var boxSet = paper.set();
    var offset = this.graph.gutter + 0.5;
    
    for(var x = 0; x < boxesWide; x++)
      for(var y = 0; y < boxesHigh; y++)
        boxSet.push(paper.rect((x * this.length) + offset, (y * this.length) + offset, this.length, this.length));
    boxSet.attr(this.style);
    
    if(this.animation) {
      boxSet.attr(this.animation.from);
      boxSet.animate(this.animation.to, this.animation.duration, this.animation.easing);
    }
  }
}
