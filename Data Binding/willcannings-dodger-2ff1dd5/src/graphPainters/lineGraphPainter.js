var LineGraphPainter = function(graph, options) {
  ensurePropertiesPresent(options, 'series');
  mergeOptions(LineGraphPainter.defaults, options, this);
  this.graph = graph;
}

LineGraphPainter.defaults = {
  series: null,
  smooth: true,
  labels: null,
  symbols: null,
  style: {
    stroke: '#333',
    fill: 'rgba(150,150,150,0.80)'
  },
  animation: {
    duration: 1000,
    easing: '>'
  }
}


LineGraphPainter.prototype = {
  draw: function() {
    var paper = this.graph.paper;
    var points = this.graph.scaleSeries(this.series).pointsSortedByX();
    
    // draw the graph path and animate
    if(this.smooth)
      this.graphPath = this.drawSmoothLines(paper, points);
    else
      this.graphPath = this.drawStraightLines(paper, points);
    this.animateGraph(paper);
    
    // draw data point symbols and labels
    this.drawSymbolsAndLabels(paper, points);
  },
  
  drawSymbolsAndLabels: function(paper, points) {
    for(var i = 0, ii = points.length; i < ii; i++) {
      var point = points[i];

      if(point.symbol)
        point.symbol.drawSymbol(paper, point);
      else if(this.symbols)
        this.symbols.drawSymbol(paper, point);
      
      if(point.label)
        point.label.drawLabel(paper, point);
      else if(this.labels)
        this.labels.drawLabel(paper, point);
    }
  },

  drawStraightLines: function(paper, points) {
    var path = ['M', points[0].x, points[0].y];
    for(var i = 1, ii = points.length; i < ii; i++)
      path.push('L', points[i].x, points[i].y);
    return paper.path(path.join(',')).attr(this.style);
  },
  
  drawSmoothLines: function(paper, points) {
    var path = ['M', points[0].x, points[0].y, 'C', points[0].x, points[0].y];
    
    for(var i = 1, ii = points.length - 1; i < ii; i++) {
      var previousPoint = points[i - 1];
      var point = points[i];
      var nextPoint = points[i + 1];
      
      // the rate of change affects the curve height
      var change1  = (point.x - previousPoint.x) / 2;
      var change2  = (nextPoint.x - point.x) / 2;
      
      // determine the curve size
      var arc1 = Math.atan((point.x - previousPoint.x) / Math.abs(point.y - previousPoint.y));
      var arc2 = Math.atan((nextPoint.x - point.x) / Math.abs(nextPoint.y - point.y));
      
      // rotate the curve depending on the ordering of the points
      arc1 = previousPoint.y < point.y ? Math.PI - arc1 : arc1;
      arc2 = nextPoint.y < point.y ? Math.PI - arc2 : arc2;
      
      var alpha = Math.PI / 2 - ((arc1 + arc2) % (Math.PI * 2)) / 2;
      var dx1 = change1 * Math.sin(alpha + arc1);
      var dy1 = change1 * Math.cos(alpha + arc1);
      var dx2 = change2 * Math.sin(alpha + arc2);
      var dy2 = change2 * Math.cos(alpha + arc2);
      
      path.push(point.x - dx1, point.y + dy1, point.x, point.y, point.x + dx2, point.y + dy2);
    }
    
    var lastPoint = points[points.length - 1];
    path.push(lastPoint.x, lastPoint.y, lastPoint.x, lastPoint.y);
    path.push('L', this.graph.contentRightX() + 0.5, this.graph.contentBottomY() + 0.5);
    path.push('L', this.graph.contentLeftX() + 0.5, this.graph.contentBottomY() + 0.5);
    path.push('Z');
    
    return paper.path(path.join(',')).attr(this.style);
  },
  
  animateGraph: function(paper) {
    if(!this.animation)
      return;
    
    var width = this.graph.contentRightX() + 1;
    var height = this.graph.contentBottomY() + 1;
    this.graphPath.attr({'clip-rect': '0 0 0 ' + height});
    this.graphPath.animate({'clip-rect': '0 0 ' + width + ' ' + height}, this.animation.duration, this.animation.easing);
  }
}

Graph.prototype.addLineGraph = function(options) {
  this.painters.push(new LineGraphPainter(this, options));
}
