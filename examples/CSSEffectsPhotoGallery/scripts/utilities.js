/*

File: utilities.js

Abstract: Some handy JavaScript utilities.

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
Function.prototype.bind = function(thisObject)
{
    var func = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() { return func.apply(thisObject, args.concat(Array.prototype.slice.call(arguments, 0))) };
}

/**
 *  Indicates whether an object is undefined.
 */
function objectIsUndefined(object) {
  return (object === undefined);
}

/**
 *  Indicates whether an object is a Function.
 */
function objectIsFunction(object) {
  return (typeof object == 'function');
}

/**
 *  Indicates whether an object implements a given method, useful to check if a delegate
 *  object implements a given delegate method.
 */
function objectHasMethod(object, methodNameAsString) {
  return (  object !== null &&
            !this.objectIsUndefined(object[methodNameAsString]) &&
            this.objectIsFunction(object[methodNameAsString])
         );
}

/* ==================== Animation Keyframe helpers ==================== */

function findKeyframes(keyframesName)
{
  for (var i = 0; i < document.styleSheets.length; ++i) {
    var curSheet = document.styleSheets[i];

    for (var j = 0; j < curSheet.cssRules.length; ++j) {
      var curRule = curSheet.cssRules[j];
      if (curRule.type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && curRule.name == keyframesName)
        return curRule;
    }
  }
    
  return null;
}

function createKeyframes(name, keyframes)
{
  // FIXME: Maybe create our own sheet just for these rules so we can remove them all when done.
  var curSheet = document.styleSheets[0];
  curSheet.insertRule('@-webkit-keyframes ' + name + ' { ' + keyframes + ' }', curSheet.rules.length);
}

/* ==================== Element Extensions ==================== */

Element.prototype.removeAllChildren = function ()
{
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }
};

/**
 *  Indicates whether the element has a given class name within its class attribute.
 */
Element.prototype.hasClassName = function (className) {
  return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(this.className);
};

/**
 *  Adds the given class name to the element's class attribute if it's not already there.
 */
Element.prototype.addClassName = function (className) {
  if (!this.hasClassName(className)) {
    this.className = [this.className, className].join(' ').replace(/^\s*|\s*$/g, "");
  }
};

/**
 *  Removes the given class name from the element's class attribute if it's there.
 */
Element.prototype.removeClassName = function (className) {
  if (this.hasClassName(className)) {
    var curClasses = this.className;
    this.className = curClasses.replace(new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g'), ' ').replace(/^\s*|\s*$/g, "");
  }
};

