/*

File: slideshow.js

Abstract: JavaScript file containing a class that manages the slide show.

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

/*
  assets paramter is JSON data like:
  
  [
    {
      'src' : 'foo/bar/baz.jpg',
      'thumb' : 'foo/bar/baz_thumb.jpg',
      'caption' : 'This is the caption',
      'uploaded' : 'John Doe',
      'date' : new Date(2005, 11, 28),
      'rating' : 4
    },
    ...
  ]
*/

// This class does most of the heavy lifting for the photo gallery.

function Slideshow(photoContainer, slideshowContainer, assets)
{
  // Store references to the two elements that the slideshow cares about.
  this.photoContainer = photoContainer;
  this.slideshowContainer = slideshowContainer;
  
  // assets contains the list of images, with metadata.
  this.assetData = assets;
  
  this.thumbs = [];
  
  // This is the list of transitions that will run.
  this.transitions = [
     /* { name: "crossfade", transition: Transition },
      { name: "push", transition: Transition },
      { name: "pushdown", transition: Transition },
      { name: "zoomout", transition: Transition },
      { name: "scaleout", transition: Transition },
      { name: "drop", transition: Transition },
      { name: "pop", transition: Transition },
      { name: "spin", transition: Transition },*/
      { name: "batspin", transition: Transition },
      { name: "horizontalflip", transition: Transition },
      
      /*{ name: "fall", transition: Transition },*/
      { name: "door", transition: Transition },
      { name: "swap", transition: Transition },
      { name: "cube", transition: Transition },

      { name: "swap", transition: Transition },
      { name: "cube", transition: Transition },
      { name: "door", transition: Transition }/*,
      
      { name: "tile-drop", transition: DropTileTransition, duration: 4000 },
      { name: "tile-fall", transition: DropTileTransition, duration: 6000 },
      { name: "tile-unfold-right", transition: HorizontalUnfoldTileTransition, duration: 3000 },
      { name: "tile-unfold-down", transition: VerticalUnfoldTileTransition, duration: 3000 },
      { name: "tile-implode", transition: ImplodeTileTransition, duration: 2700 },
      
      { name: "push", transition: Transition },
      { name: "pushdown", transition: Transition },
      { name: "crossfade", transition: Transition },
      { name: "spin",  transition: Transition }*/
    ];
        
  this.iPad = navigator.userAgent.indexOf('iPad') != -1;
        
  this.currentIndex = 0;
  this.flipped = false;

  this.thumbContainer = document.getElementById('thumbs');
  this.thumbScroller = document.getElementById('thumb-scroller');
  this.setupThumbnails();

  this.showPhoto();

  this.highlightThumb();
};

Slideshow.prototype.setupThumbnails = function ()
{
  this.thumbGridView = new GridView(this.thumbScroller);
  
  // Size the grid view for the thumbnails appropriately.
  if (this.iPad) {
    this.thumbGridView.setVisibleColumns(8);
    this.thumbGridView.setRowWidth(800);
    this.thumbGridView.setRowElementWidth(101);
  } else {
    this.thumbGridView.setVisibleColumns(9);
    this.thumbGridView.setRowWidth(1024);
    this.thumbGridView.setRowElementWidth(115);
  }
  this.thumbGridView.init(this, this);
}

// Flips the image over (via the Return key). Note how it just toggles a CSS classname.
Slideshow.prototype.toggleFlip = function ()
{
  if (this.isBusy())
    return;
  
  if (this.flipped) {
    this.slideshowContainer.removeClassName("flipped");
    this.flipped = false;
  } else {
    this.slideshowContainer.addClassName("flipped");
    this.flipped = true;
  }
};

Slideshow.prototype.handleEvent = function(event)
{
  switch (event.type)
  {
    // We wait for the next image or video to load before we start the transition to that asset.
    case 'load':  // called for images
    case 'canplaythrough':  // called for video
      if (this.currentTransition)
        this.currentTransition.contentsReady();
      break;
  }
};

Slideshow.prototype.isBusy = function()
{
  return (this.currentTransition && this.currentTransition.playing());
};

// Return a Transition object for the asset at the given index.
Slideshow.prototype.transitionForImageIndex = function(index)
{
  this.transitionIndex = index % this.transitions.length;

  var currTransition = this.transitions[this.transitionIndex];
  
  var transitionType = currTransition.name;
  var transitionClass = currTransition.transition;
  var duration = currTransition.duration;

  return new transitionClass(transitionType, this.photoContainer, duration);
};

// Here's the function that actually kicks off the transition to the next image.
Slideshow.prototype.transitionToIndex = function(slowMode, newIndex)
{
  var oldContents = this.photoContainer.firstChild;
  if (!oldContents) {
    // Add a placeholder to simplify logic in transitionDone().
    oldContents = document.createElement('div');
    this.transitionContainer.appendChild(oldContents);
  }

  // Get the transition to use for this image.
  this.currentTransition = this.transitionForImageIndex(this.currentIndex);
  // Remember the url of the current image. Some effects (like the tile effects) need this.
  this.currentTransition.outgoingImageURL = this.assetData[this.currentIndex].src;
  this.currentIndex = newIndex;

  // Create the content for the incoming asset. This might be a an <img>, <video> or a <div> containing children.
  var newContent = this.createElementForAssetAtIndex(this.currentIndex);
  // Start running the transition.
  this.startTransitionToPhoto(oldContents, newContent, this.currentTransition, slowMode);
  // Highlight the new thumbnail.
  this.highlightThumb();
}

Slideshow.prototype.nextImage = function(slowMode)
{
  if (this.isBusy())
    return;

  if (this.currentTransition && this.currentTransition.playing()) {
    // we're busy - do nothing
    return;
  }
  
  var newIndex = (this.currentIndex + 1) % this.assetData.length;
  this.transitionToIndex(slowMode, newIndex)
};

Slideshow.prototype.previousImage = function(slowMode)
{
  if (this.isBusy())
    return;
  
  var newIndex = (this.currentIndex - 1) % this.assetData.length;
  if (newIndex < 0)
    newIndex = this.assetData.length - 1;

  this.transitionToIndex(slowMode, newIndex)
};

Slideshow.prototype.createElementForAssetAtIndex = function(assetIndex)
{
  if (assetIndex < 0 || assetIndex >= this.assetData.length)
    return undefined;

  var container = document.createElement('div');
  container.className = 'contents';

  var asset = this.assetData[assetIndex];
  var mediaElement;
  if (asset.src.match(/[.jpg|.png|.gif]$/)) {
    // If the asset has an image extension, make an image element.
    mediaElement  = new Image();
    // Register a load listener; when it fires, our handleEvent() method will get called.
    mediaElement.addEventListener('load', this, false);
    mediaElement.src = this.iPad ? asset.medium : asset.src;
  } else if (asset.src.match(/[.mov|.mp4|.m4v]$/)) {
    // For movies, create a video element.
    mediaElement = document.createElement('video');
    // Register a canplaythrough listener; when it fires, our handleEvent() method will get called.
    mediaElement.addEventListener('canplaythrough', this, false);
    mediaElement.src = asset.src;
    mediaElement.loop = true;
  }
  
  // The dataElement contains the metadata for display on the back of the image (when flipped).
  var dataElement = this.createDataElementForAssetAtIndex(assetIndex);
  
  container.appendChild(mediaElement);
  container.appendChild(dataElement);
  
  return container;
}

// Create nodes for one line of metadata.
Slideshow.prototype.createDataLine = function(label, content)
{
  var caption = document.createElement('p');
  caption.innerText = content;
  return caption;
}

// Create the content for the metadata display on the back of the image.
Slideshow.prototype.createDataElementForAssetAtIndex = function(assetIndex)
{
  var asset = this.assetData[assetIndex];
  var dataContainer = document.createElement('div');
  dataContainer.className = 'data-container';
  
  dataContainer.appendChild(this.createDataLine('Title: ', asset.caption));
  dataContainer.appendChild(this.createDataLine('Author: ', asset.uploaded));
  dataContainer.appendChild(this.createDataLine('Date: ', asset.date.toLocaleDateString()));
  
  return dataContainer;
}

// Instantaneous switch. Only used when there is no transition.
Slideshow.prototype.showPhoto = function()
{
  this.photoContainer.removeAllChildren();
  
  var newContent = this.createElementForAssetAtIndex(this.currentIndex);
  this.photoContainer.appendChild(newContent);
};

Slideshow.prototype.startTransitionToPhoto = function(oldContents, newContents, transition, slowMode)
{
  if (transition)
    transition.initiateTransition(oldContents, newContents, slowMode);
  else
    this.showPhoto();
};

Slideshow.prototype.highlightThumb = function()
{
  var images = this.thumbContainer.querySelectorAll('img.selected');
  // Unhighlight the old one
  for (var i = 0; i < images.length; ++i) {
    var curThumb = images[i];
    curThumb.removeClassName('selected');
  }
  // Highlight the new one.
  this.thumbs[this.currentIndex].addClassName('selected');

  this.thumbGridView.setActiveElementIndex(this.currentIndex);
};

Slideshow.prototype.thumbClicked = function(event)
{
  if (!"_thumbIndex" in event.target)
    return;

  var newIndex = event.target._thumbIndex;
  if (newIndex == this.currentIndex)
    return;

  this.transitionToIndex(false, newIndex)
};

// GridView data source methods.
Slideshow.prototype.gridViewNumberOfElements = function(grid)
{
  return this.assetData.length;
};

Slideshow.prototype.gridViewElementAtIndex = function(grid, index)
{
  if (index >= 0 && index < this.assetData.length) {
    if (!this.thumbs[index]) {
      var thumb = new Image();
      thumb.src = this.assetData[index].thumb;
      var _self = this;
      thumb.onclick = function(event) { _self.thumbClicked(event); };
      thumb._thumbIndex = index;
      this.thumbs[index] = thumb;
    }
    return this.thumbs[index];
  }
};
