var Graph = function(options) {
  ensurePropertiesPresent(options, 'width', 'height');
  mergeOptions(Graph.defaults, options, this);
  this.setAxisPainter(this.axisPainter);
  this.painters = [];
  this.paper    = Raphael(this.element, this.width, this.height);
}

Graph.defaults = {
  gutter: 10,
  width: null,
  height: null,
  element: document.body,
  axisPainter: null
}


Graph.prototype = {
  draw: function() {
    // draw the axis and background
    if(this.axisPainter != null)
      this.axisPainter.draw();
    
    // draw the series data
    for(var i = 0, ii = this.painters.length; i < ii; i++)
      this.painters[i].draw();
    
    // force a redraw
    this.paper.safari();
  },
  
  scaleSeries: function(series) {
    var scaledSeries = new Series();
    var minX    = series.minX();
    var maxY    = series.maxY();
    var rangeX  = series.maxX() - series.minX();
    var rangeY  = series.maxY() - series.minY();
    var gWidth  = this.width - (2 * this.gutter);
    var gHeight = this.height - (2 * this.gutter);
    
    for(var i = 0, ii = series.points.length; i < ii; i++) {
      var point = cloneObject(series.points[i]);
      point.x = (((point.x - minX) / rangeX) * gWidth) + this.gutter + 0.5;
      point.y = (((maxY - point.y) / rangeY) * gHeight) + this.gutter + 0.5;
      scaledSeries.addPoint(point);
    }
    return scaledSeries;
  },
  
  setAxisPainter: function(painter) {
    if(painter == undefined || painter == null)
      return;
    painter.graph = this;
    this.axisPainter = painter;
  },
  
  contentWidth: function() {
    if(!this._contentWidth)
      this._cacheContentDimensions();
    return this._contentWidth;      
  },
  
  contentHeight: function() {
    if(!this._contentHeight)
      this._cacheContentDimensions();
    return this._contentHeight;
  },
  
  contentLeftX: function() {
    return this.gutter;
  },
  
  contentTopY: function() {
    return this.gutter;
  },
  
  contentRightX: function() {
    return this.width - this.gutter;
  },
  
  contentBottomY: function() {
    return this.height - this.gutter;
  },
  
  _cacheContentDimensions: function() {
    this._contentWidth = this.width - (2 * this.gutter);
    this._contentHeight = this.height - (2 * this.gutter);
  }
}
