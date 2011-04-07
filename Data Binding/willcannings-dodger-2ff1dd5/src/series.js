// object representing a series of points in a graph
var Series = function(initialPoints) {
  this.points = [];
  
  // some calculations are cached because they are referred to
  // frequently and won't change unless the data is changed
  this._invalid   = true;
  this._maxX      = null;
  this._maxY      = null;
  this._minX      = null;
  this._minY      = null;
  this._sortedByX = null;
  this._sortedByY = null;
  
  // load the initial set of points if supplied
  if(initialPoints != undefined && initialPoints != null && initialPoints.length > 0) {
    for(var i = 0, ii = initialPoints.length; i < ii; i++)
      this.addPoint(initialPoints[i]);
  }
}

Series.prototype = {
  validatePoint: function(point) {
    ensurePropertiesPresent(point, 'x', 'y');
  },
  
  addPoint: function(point) {
    this.validatePoint(point);
    this.points.push(point);
    this._invalid = true;
  },
  
  maxX: function() {
    if(this._invalid)
      this._recacheRangeAndSort();
    return this._maxX;
  },
  
  maxY: function() {
    if(this._invalid)
      this._recacheRangeAndSort();
    return this._maxY;
  },
  
  minX: function() {
    if(this._invalid)
      this._recacheRangeAndSort();
    return this._minX;
  },
  
  minY: function() {
    if(this._invalid)
      this._recacheRangeAndSort();
    return this._minY;
  },
  
  pointsSortedByX: function() {
    if(this._invalid)
      this._recacheRangeAndSort();
    return this._sortedByX;
  },
  
  pointsSortedByY: function() {
    if(this._invalid)
      this._recacheRangeAndSort();
    return this._sortedByY;
  },

  _recacheRangeAndSort: function() {
    if(!this._invalid)
      return;
    
    this._maxX = this.points[0].x;
    this._maxY = this.points[0].y;
    this._minX = this.points[0].x;
    this._minY = this.points[0].y;
    
    for(var i = 1, ii = this.points.length; i < ii; i++) {
      this._maxX = Math.max(this.points[i].x, this._maxX);
      this._maxY = Math.max(this.points[i].y, this._maxY);
      this._minX = Math.min(this.points[i].x, this._minX);
      this._minY = Math.min(this.points[i].y, this._minY);
    }
    
    // clone the data array before sorting
    this._sortedByX = this.points.slice(0).sort(function(a, b) {
      return (a.x - b.x);
    });
    
    this._sortedByY = this.points.slice(0).sort(function(a, b) {
      return (a.y - b.y);
    });
    
    this._invalid = false;
  }
}
