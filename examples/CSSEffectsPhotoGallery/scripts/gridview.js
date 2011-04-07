/*

File: gridview.js

Abstract: A JavaScript class that creates a simple grid view programmatically.
  Used to create the list of thumbnails in the image gallery.

Version: 1.0

Disclaimer: IMPORTANT:  This Apple software is supplied to you by 
Apple Inc. ("Apple") in consideration of your agreement to the
following terms, and your use, installation, modification or
redistribution of this Apple software constitutes acceptance of these
terms.  If you do not agree with these terms, please do not use,
install, modify or redistribute this Apple software.

In consideration of your agreement to abide by the following terms, and
subject to these terms, Apple grants you a personal, non-exclusive
license, under Apple's copyrights in this original Apple software (the
"Apple Software"), to use, reproduce, modify and redistribute the Apple
Software, with or without modifications, in source and/or binary forms;
provided that if you redistribute the Apple Software in its entirety and
without modifications, you must retain this notice and the following
text and disclaimers in all such redistributions of the Apple Software. 
Neither the name, trademarks, service marks or logos of Apple Inc. 
may be used to endorse or promote products derived from the Apple
Software without specific prior written permission from Apple.  Except
as expressly stated in this notice, no other rights or licenses, express
or implied, are granted by Apple herein, including but not limited to
any patent rights that may be infringed by your derivative works or by
other works in which the Apple Software may be incorporated.

The Apple Software is provided by Apple on an "AS IS" basis.  APPLE
MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND
OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS.

IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL
OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION,
MODIFICATION AND/OR DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED
AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE),
STRICT LIABILITY OR OTHERWISE, EVEN IF APPLE HAS BEEN ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

Copyright (C) 2010 Apple Inc. All Rights Reserved.

*/

// GridView creates a one- or two-dimensional grid of divs. The content of the thumbnails
// is obtained via the data source, and notifications about focus changes are sent to the
// delegate, both of which should be set by the client (SlideShow in this case).

function GridView(element)
{
  this._rowWidth = 800;
  this._rowElementWidth = 20;
  this._visibleColumns = 6;
  this._activeElementIndex = 0;
  
  this.currentLeftColumn = 0;
  
  this.element = element ? element :  document.createElement("div");
  this.element.addClassName('grid-view');
}

GridView.prototype.init = function(dataSource, delegate)
{
  this.dataSource = dataSource;
  this.delegate = delegate;

  // create the grid container
  this.gridContainer = document.createElement("div");
  this.gridContainer.addClassName('grid-container-view');
  this.element.appendChild(this.gridContainer);

  // Ask the data source how many elements we should contain.
  var numElements = this.dataSource.gridViewNumberOfElements(this);

  // Create the grid contents, asking the dataSource to create elements for us.
  for (var i=0; i < numElements; i++) {
    var el = this.dataSource.gridViewElementAtIndex(this, i);
    el.addClassName('grid-element');
    this.gridContainer.appendChild(el);
  }

  this.layout();
};

GridView.prototype.setRowWidth = function(newRowWidth)
{
  this._rowWidth = newRowWidth;
  this.layout();
};

GridView.prototype.setRowElementWidth = function(newRowElementWidth)
{
  this._rowElementWidth = newRowElementWidth;
  this.layout();
};

GridView.prototype.setVisibleColumns = function(visibleColumns)
{
  this._visibleColumns = visibleColumns;
  this.layout();
};

GridView.prototype.setActiveElementIndex = function(newActiveElementIndex)
{
  if (newActiveElementIndex >= 0 &&
      newActiveElementIndex < this.dataSource.gridViewNumberOfElements(this) &&
      newActiveElementIndex != this._activeElementIndex) {

    // Call delegate to inform blur of current active element
    if (objectHasMethod(this.delegate, 'gridViewDidBlurElementAtIndex'))
      this.delegate.gridViewDidBlurElementAtIndex(this, this._activeElementIndex);
    
    this._activeElementIndex = newActiveElementIndex;
    
    // Call delegate to inform focus of new active element
    if (objectHasMethod(this.delegate, 'gridViewDidFocusElementAtIndex'))
      this.delegate.gridViewDidFocusElementAtIndex(this, this._activeElementIndex);

    this.revealSelection();
  }
};

GridView.prototype.canMoveLeft = function()
{
  return (this._activeElementIndex > 0);
};

GridView.prototype.canMoveRight = function()
{
  return (this._activeElementIndex < (this.dataSource[GridViewNumberOfElements](this) - 1));
};

GridView.prototype.layout = function()
{
  this.positionCells();
  this.revealSelection();
};

GridView.prototype.positionCells = function()
{
  if (!this.dataSource)
    return;
  
  var numElements = this.dataSource.gridViewNumberOfElements(this);

  for (var i = 0; i < numElements; i++) {
    var x = this.gridXForElement(i);
    this.dataSource.gridViewElementAtIndex(this, i).style.webkitTransform = "translate3d(" + x + "px, 0, 0)";
  }
};

GridView.prototype.revealSelection = function()
{
  var offset;
  if (this.currentLeftColumn <= (this._activeElementIndex - this._visibleColumns)) {
    this.currentLeftColumn = this._activeElementIndex - this._visibleColumns + 1;
    offset = this.currentLeftColumn * this._rowElementWidth;
    this.gridContainer.style.webkitTransform = "translate3d(-" + offset + "px, 0, 0)";
  } else if (this.currentLeftColumn > this._activeElementIndex) {
    this.currentLeftColumn = this._activeElementIndex;
    offset = this.currentLeftColumn * this._rowElementWidth;
    this.gridContainer.style.webkitTransform = "translate3d(-" + offset + "px, 0, 0)";
  }
};

GridView.prototype.gridXForElement = function(index)
{
  return index * this._rowElementWidth;
};
