/*

File: transitions.js

Abstract: JavaScript file for the Transitions class, which is used to
  manage and run basic inter-image transitions.

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

const cDefaultDuration = 1000;

// This Transition class manages a transition between one asset and the next.
// It's not directly related to a CSS Transition (though it may use one).

function Transition(type, transitionContainer, duration)
{
  this.init(type, transitionContainer, duration);
};

Transition.prototype.init = function(type, transitionContainer, duration)
{
  this.transitionType = type;
  this.transitionContainer = transitionContainer;
  // Store the duration, as milliseconds.
  this.duration = (typeof duration == "undefined") ? cDefaultDuration : duration;
}

// Start doing work to make the transition happen (e.g. load the image)
Transition.prototype.initiateTransition = function(oldContents, newContent, slowMode)
{
  this.transitionContainer.addClassName(this.transitionType);
  this.slowMode = slowMode;
  if (this.slowMode)
    this.transitionContainer.addClassName("slowmode");
  
  this.oldContents = oldContents;
  this.contents = newContent;
}

Transition.prototype.initiateElementTransition = function(element, slowMode)
{
  this.transitionContainer.addClassName(this.transitionType);
  this.slowMode = slowMode;
  if (this.slowMode)
    this.transitionContainer.addClassName("slowmode");
  
  this.contents = element;

  var _self = this;
  setTimeout(function() {
    _self.startTransition();
  }, 0);
}

// This tells us that the image or video have loaded, and we're ready to run the transition.
Transition.prototype.contentsReady = function()
{
  var videos = this.contents.querySelectorAll('video');
  if (videos.length)
    videos[0].play();

  this.startTransition();
}

Transition.prototype.startTransition = function()
{
  this.isPlaying = true;

  // Set up the CSS classnames to describe the initial state.
  this.transitionContainer.addClassName('initial');

  this.newContents = this.prepareIncomingContents(this.contents);
  this.newContents.addClassName('incoming');
  this.transitionContainer.appendChild(this.newContents);

  var outgoingContents = this.prepareOutgoingContents(this.oldContents);
  if (outgoingContents != this.oldContents)
    this.transitionContainer.replaceChild(outgoingContents, this.oldContents);

  outgoingContents.addClassName('outgoing');

  var _self = this;
  // This short timer gives the browser chance to render the initial style, and
  // therefore to subsequently show the CSS transition.
  window.setTimeout(function() {
    _self.transitionContainer.addClassName('final');

    var duration = _self.duration;
    if (_self.slowMode)
    //  duration *= 5;
      duration *= 20;

    // We have effects that use both CSS transitions and keyframe animations. To avoid
    // having to register listeners for both, we'll just use a JS timer to know when
    // the effect is complete.
    window.setTimeout(function() {
      _self.transitionDone();
    }, duration);
    
  }, 100);
}

Transition.prototype.prepareIncomingContents = function(incomingContents)
{
  // For subclassers to override.
  return incomingContents;
}

Transition.prototype.prepareOutgoingContents = function(outgoingContents)
{
  // For subclassers to override.
  return outgoingContents;
}

// Called when the transition is done.
Transition.prototype.transitionDone = function()
{
  this.isPlaying = false;

  var oldContents = this.transitionContainer.firstChild;
  this.transitionContainer.removeChild(oldContents);

  this.newContents.removeClassName('incoming');

  this.transitionContainer.removeClassName('final');
  this.transitionContainer.removeClassName(this.transitionType);
  if (this.slowMode)
    this.transitionContainer.removeClassName("slowmode");
}

Transition.prototype.playing = function()
{
  return this.isPlaying;
}
