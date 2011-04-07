/*

File: tile-transition.js

Abstract: JavaScript file for various TileTransition classes that subclass
  the basic Transition class in order to create more advance tiling effects.

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

const cNumRows = 5;
const cNumColumns = 8;
const cTileWidth = 128;
const cTileHeight = 136;

// TileTransition is a subclass of Transition, to customize it for special tiling effects.
TileTransition.prototype = new Transition;
function TileTransition(type, transitionContainer, duration)
{
  this.init(type, transitionContainer, duration);
  
  this.tileWidth = cTileWidth;
  this.tileHeight = cTileHeight;
  
  this.rowCount = cNumRows;
  this.columnCount = cNumColumns;
}

TileTransition.prototype.createTiles = function(incoming, tileContainer, imageURL)
{
  var backgroundImage = 'url(' + imageURL + ')';
  
  for (var row = 0; row < this.rowCount; ++row) {
    for (var col = 0; col < this.columnCount; ++col) {
      var curTile = document.createElement('div');
    
      var tileX = col * this.tileWidth;
      var tileY = row * this.tileHeight;
      
      curTile.style.width = this.tileWidth + 'px';
      curTile.style.height = this.tileHeight + 'px';

      curTile.style.left = tileX + 'px';
      curTile.style.top = tileY + 'px';
      curTile.style.backgroundImage = backgroundImage;

      // Set the background position style so that the correct part of the background image draws in this tile.
      curTile.style.backgroundPosition = (-tileX) + 'px ' + (-tileY) + 'px';
      curTile.style.backgroundSize = (this.columnCount * this.tileWidth) + 'px ' + (this.rowCount * this.tileHeight) + 'px';
    
      curTile = this.setInitialTileState(incoming, curTile, col, row);

      tileContainer.appendChild(curTile);
    }
  }
}

TileTransition.prototype.setInitialTileState = function(incoming, tile, column, row)
{
  // Subclasses can override this method.
  return tile;
}

TileTransition.prototype.prepareIncomingContents = function(incomingContents)
{
  this.tileContainer = document.createElement('div');
  this.tileContainer.className = 'tile-container';
  
  var images = incomingContents.querySelectorAll('img');
  if (images.length) {
    var originalImage = images[0];
    this.createTiles(true, this.tileContainer, originalImage.src);
    // Replace the image with the tile container.
    originalImage.parentNode.replaceChild(this.tileContainer, originalImage);
  }

  return incomingContents;
}

TileTransition.prototype.prepareOutgoingContents = function(outgoingContents)
{
  if (!this.oldContents)
    return outgoingContents;
  
  this.tileContainer = document.createElement('div');
  this.tileContainer.className = 'tile-container';

  var oldImageOrTileContainer = outgoingContents.firstChild;  // FIXME: this is rather fragile.

  this.createTiles(false, this.tileContainer, this.outgoingImageURL);
  oldImageOrTileContainer.parentNode.replaceChild(this.tileContainer, oldImageOrTileContainer);

  return outgoingContents;
}

/* --------------------------- DropTileTransition --------------------------------- */

DropTileTransition.prototype = new TileTransition;
function DropTileTransition(type, transitionContainer, duration)
{
  this.init(type, transitionContainer, duration);
}

DropTileTransition.prototype.setInitialTileState = function(incoming, tile, column, row)
{
  const maxDelay = 500;
  
  // Set a random value for the -webkit-animation-delay property to get neat staggered effects.
  var rowDelay = (this.rowCount - row - 1) * 200;
  if (incoming)
    tile.style.webkitAnimationDelay = rowDelay + 1000 + maxDelay * Math.random() + 'ms';
  else
    tile.style.webkitAnimationDelay = rowDelay + maxDelay * Math.random() + 'ms';

  return tile;
}

/* ------------------------- ImplodeTileTransition ----------------------------------- */

ImplodeTileTransition.prototype = new TileTransition;
function ImplodeTileTransition(type, transitionContainer, duration)
{
  this.init(type, transitionContainer, duration);
}

ImplodeTileTransition.prototype.setInitialTileState = function(incoming, tile, column, row)
{
  // This transition is a bit more complex. We use two nested divs for each tile. One runs an
  // animation that causes it to fly in/out of the screen, using keyframes that we create here.
  // The other runs a spin animation that is described in CSS.
  
  var flyingDiv = document.createElement('div');
  
  // Randomize the spin duration slightly (between 1100 and 1300ms)
  var spinDuration = 1100 + 200 * Math.random();
  if (this.slowMode)
    spinDuration *= 3;
  tile.style.webkitAnimationDuration = spinDuration + 'ms';
  
  flyingDiv.appendChild(tile);
  
  // Now the content looks like:
  // <div class="tile-container">
  //   <div><div class="tile"></div>  // outer div is the flyingDiv
  //   <div><div class="tile"></div>
  //   ...
  
  var tileX = column * this.tileWidth;
  var tileY = row * this.tileHeight;
  
  flyingDiv.style.left = tileX + 'px';
  flyingDiv.style.top = tileY + 'px';
  
  tile.style.top = '0';
  tile.style.left = '0';

  const cOffsetFactor = 500;
  var jiggle = 5 * Math.random();
  var xOffset = jiggle * cOffsetFactor * (column / this.columnCount - 0.5);
  var yOffset = jiggle * cOffsetFactor * (row / this.rowCount - 0.5);

  // Here we create keyframes on the fly. We do this so that we can use different keyframes for each tile,
  // which we have to do to get the effect of them flying out in all directions.
  var keyframesName;
  var keyframeValues;
  if (incoming) {
    keyframesName = 'ImplodeTileTransition_' + column + '_' + row;
    keyframeValues =
    'from { \
        -webkit-transform: translate3d(' + xOffset + 'px, ' + yOffset + 'px, 800px); \
        opacity: 0; \
     } \
     10% { \
        -webkit-transform: translate3d(' + xOffset + 'px, ' + yOffset + 'px, 800px); \
         opacity: 1; \
      } \
     to { \
       -webkit-transform: translate3d(0, 0, 0); \
       opacity: 1; \
    }';
  } else {
    keyframesName = 'ExplodeTileTransition_' + column + '_' + row;
    keyframeValues =
    'from { \
        -webkit-transform: translate3d(0, 0, 0); \
        opacity: 1; \
     } \
     90% { \
        -webkit-transform: translate3d(' + xOffset + 'px, ' + yOffset + 'px, 800px); \
         opacity: 1; \
      } \
     to { \
       -webkit-transform: translate3d(' + xOffset + 'px, ' + yOffset + 'px, 800px); \
       opacity: 0; \
    }';
  }
    
  createKeyframes(keyframesName, keyframeValues);
  flyingDiv.style.webkitAnimationName = keyframesName;
  
  return flyingDiv;
}

/* ------------------------- VerticalUnfoldTileTransition ----------------------------------- */

VerticalUnfoldTileTransition.prototype = new TileTransition;
function VerticalUnfoldTileTransition(type, transitionContainer, duration)
{
  this.init(type, transitionContainer, duration);

  this.rowCount = 3;
  this.columnCount = 1;

  var width = parseInt(window.getComputedStyle(transitionContainer).width);
  var height = parseInt(window.getComputedStyle(transitionContainer).height);

  this.tileWidth = width;
  this.tileHeight = Math.ceil(height / this.rowCount);
}

VerticalUnfoldTileTransition.prototype.setInitialTileState = function(incoming, tile, column, row)
{
  return tile;
}

/* ------------------------- HorizontalUnfoldTileTransition ----------------------------------- */

HorizontalUnfoldTileTransition.prototype = new TileTransition;
function HorizontalUnfoldTileTransition(type, transitionContainer, duration)
{
  this.init(type, transitionContainer, duration);

  this.rowCount = 1;
  this.columnCount = 4;

  var width = parseInt(window.getComputedStyle(transitionContainer).width);
  var height = parseInt(window.getComputedStyle(transitionContainer).height);

  this.tileWidth = Math.ceil(width / this.columnCount);
  this.tileHeight = height;
}

HorizontalUnfoldTileTransition.prototype.setInitialTileState = function(incoming, tile, column, row)
{
  return tile;
}
