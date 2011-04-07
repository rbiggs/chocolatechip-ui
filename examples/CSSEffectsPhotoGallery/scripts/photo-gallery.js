/*

File: photo-gallery.js

Abstract: JavaScript file containing logic related to creating the photo
  gallery, and handling keyboard and touch events.

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

// The Gallery class manages the entire photo gallery. It creates the slide show,
// and hooks up event listeners for user input.

function Gallery(container)
{
  this.galleryContainer = container;

  this.photoContainer = document.getElementById('photo-container');
  
  // Create the slide show. It does most of the heavy lifting in the gallery.
  this.slideShow = new Slideshow(this.photoContainer, this.galleryContainer, cImageAssets);

  // Register touchEnd listener for iPhone/iPad
  this.photoContainer.addEventListener('touchend', this, false);
  
  // Register click and keyboard listeners for desktop
  this.photoContainer.addEventListener('click', this, false);
  window.addEventListener('keydown', this, false);
}

Gallery.prototype.handleEvent = function (event) {
  
  var target = event.target;
  switch (event.type) {
    case "touchend":
      this.slideShow.nextImage(event.shiftKey);
      event.preventDefault(); // prevent click from firing, so we don't advance twice.
      return;

    case "click":
      this.slideShow.nextImage(event.shiftKey);
      break;

    case "keydown":
      if (event.keyCode == 39) {  // RIGHT
        event.preventDefault();
        if (!this.slideShow.flipped)
          this.slideShow.nextImage(event.shiftKey);
      } else if (event.keyCode == 37) {  // LEFT
        event.preventDefault();
        if (!this.slideShow.flipped)
          this.slideShow.previousImage(event.shiftKey);
      } else if (event.keyCode == 13) { // RETURN/ENTER
        event.preventDefault();
        this.slideShow.toggleFlip();
      }
      break;
  }
};

// This method finds all the elements with the "image-container" class in the document, and adds
// a click event listener to each one.
function makeImagesClickable()
{
  var lightboxContainers = document.querySelectorAll('.image-container');
  for (var i = 0; i < lightboxContainers.length; ++i) {
    var curContainer = lightboxContainers[i];
    // ".bind()" calls Function.prototype.bind (in utilities.js); it's a convenient way to
    // hook up an event listener with 'this' as the target, inside a loop.
    curContainer.addEventListener('click', imageClicked.bind(this, curContainer), false);
  }
}

function showOverlay()
{
  var overlay = document.getElementById('overlay');
  overlay.removeClassName('hidden');
  // The "setTimeout" ensures that the initial style is rendered, and hence allows the transition to run.
  window.setTimeout(function() {
    overlay.addClassName('visible');
  }, 0);
}

var gGallery;
function imageClicked()
{
  if (gGallery)
    return;

  var galleryContainer = document.getElementById('gallery-container');
  gGallery = new Gallery(galleryContainer);

  showOverlay();
}

// The preferred way to call a function when the page loads.
window.addEventListener('load', makeImagesClickable, false);
