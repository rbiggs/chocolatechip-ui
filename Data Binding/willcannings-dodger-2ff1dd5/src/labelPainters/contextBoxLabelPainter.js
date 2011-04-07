var ContextBoxLabelPainter = function(options) {
  mergeOptions(ContextBoxLabelPainter.defaults, options, this);
}

ContextBoxLabelPainter.defaults = {
  xOffset: 0,
  yOffset: 0,
  width: 85,
  height: 40,
  contextArrowLength: 12,
  style: {
    fill: '#000',
    stroke: '#000'
  },
  label1: {
    top: 12,
    left: 0,
    style: {
      font: '11px Helvetica',
      fill: '#fff'
    }
  },
  label2: {
    top: 25,
    left: 0,
    style: {
      font: '13px Helvetica',
      fill: '#fff'
    }
  },
  animation: {
    duration: 1000,
    easing: '<>',
    from: {opacity: 0.0},
    to: {opacity: 1.0}
  }  
}

ContextBoxLabelPainter.prototype = {
  drawLabel: function(paper, point) {
    point.labelShape = paper.set();
    var symbolY = point.symbolShape.topY;
    var boxX = point.x + this.xOffset - this.halfBoxWidth();
    var boxY = symbolY + this.yOffset - this.height - this.contextArrowHeight();
    
    // left and bottom sides of the box
    var path = ['M', boxX, boxY, 'L', boxX, boxY + this.height];
    
    // context arrow
    var p1x = boxX + this.halfBoxWidth() - this.halfContextArrowLength();
    var p1y = boxY + this.height;
    var p2x = p1x + this.halfContextArrowLength();
    var p2y = p1y + this.contextArrowHeight();
    var p3x = p1x + this.contextArrowLength;
    var p3y = p1y;
    path.push('L', p1x, p1y, 'L', p2x, p2y, 'L', p3x, p3y);

    // bottom, right and top sides of the box
    path.push('L', boxX + this.width, boxY + this.height, 'L', boxX + this.width, boxY, 'Z');    
    point.labelShape.push(paper.path(path.join(',')).attr(this.style));
    
    // label text
    point.labelShape.push(paper.text(boxX + this.halfBoxWidth() + this.label1.left, boxY + this.label1.top, point.label1).attr(this.label1.style));
    point.labelShape.push(paper.text(boxX + this.halfBoxWidth() + this.label2.left, boxY + this.label2.top, point.label2).attr(this.label2.style));
    
    if(this.animation) {
      point.labelShape.attr(this.animation.from);
      animation = this.animation;
      
      point.symbolShape.node.onmouseover = function() {
        point.labelShape.animate(animation.to, animation.duration, animation.easing);
        paper.safari();
      }
      
      point.symbolShape.node.onmouseout = function() {
        point.labelShape.animate(animation.from, animation.duration, animation.easing);
        paper.safari();
      }
    }
  },
  
  contextArrowHeight: function() {
    if(!this._contextArrowHeight)
      this._cacheContextArrowDimensions();
    return this._contextArrowHeight;    
  },
  
  halfContextArrowLength: function() {
    if(!this._halfContextArrowLength)
      this._cacheContextArrowDimensions();
    return this._halfContextArrowLength;
  },
  
  halfBoxWidth: function() {
    if(!this._halfBoxWidth)
      this._cacheContextArrowDimensions();
    return this._halfBoxWidth;
  },
  
  _cacheContextArrowDimensions: function() {
    this._contextArrowHeight = Math.ceil(Math.sqrt(Math.pow(this.contextArrowLength, 2) / 2));
    this._halfContextArrowLength = Math.ceil(this.contextArrowLength / 2);
    this._halfBoxWidth = Math.ceil(this.width / 2);
  }
}
