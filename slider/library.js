////////////////////////////////////////////////////////////////////////////////
//
// GENERAL UTILITIES
//
////////////////////////////////////////////////////////////////////////////////
var NS = (navigator.appName == "Netscape");
/////////////////////////////////////////////////////////////////////////////////////////
// addEvent( [object|string] oHTMLElement, string eventName, string handler )          //
//   Adds an event handler to an HTMLElement.  Note that the eventName must be passed  //
//   in without the "on" prefix.                                                       //
/////////////////////////////////////////////////////////////////////////////////////////
function addEvent( oHTMLElement, eventName, handler ) {
  try   {
    if (typeof(oHTMLElement)=="string")  { 
      oHTMLElement = document.getElementById(oHTMLElement); 
    }
    if (NS) {
      oHTMLElement.addEventListener(eventName, handler, false);
    } else {
      oHTMLElement.attachEvent("on" + eventName, handler);
    }
  }
  catch(err) {  
  }
}
/////////////////////////////////////////////////////////////////////////////////////////
// removeEvent( [object|string] oHTMLElement, string eventName, string handler )       //
//   Removes an event handler to an HTMLElement.  Note that the eventName must be      //
//   passed in without the "on" prefix.                                                //
/////////////////////////////////////////////////////////////////////////////////////////
function removeEvent( oHTMLElement, eventName, handler ) {
  try   {
    if (typeof(oHTMLElement)=="string")  { 
      oHTMLElement = document.getElementById(oHTMLElement); 
    }
    if (NS) {
      oHTMLElement.removeEventListener(eventName, handler, false);
    } else {
      oHTMLElement.detachEvent("on" + eventName, handler);
    }
  }
  catch(err) {  
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
// centerDivs( array HTMLElementIDs, OPTIONAL int topPosOverrideValue)                 //
//   Maintains a series of HTMLElements, provided as an array of HTMLElementIDs        //
//   as being centered on the page.  NOTE - div must be visible first for this to work //
//   Sending in topPosOverrideValue will ensure that the tops are at least set to that //
/////////////////////////////////////////////////////////////////////////////////////////
function centerDivs( HTMLElementIDs, topPosOverrideValue ) {
  var thePageWidth      = document.body.clientWidth;
  var thePageHeight     = document.body.clientHeight;
  for (var i=0;i<HTMLElementIDs.length; i++) {
    var aDiv = document.getElementById( HTMLElementIDs[i] );
    if ( aDiv ) {
      var theDivWidth  = aDiv.clientWidth;
      var theDivHeight = aDiv.clientHeight;
      var theLeftPos = ( thePageWidth > theDivWidth ) ? ( thePageWidth - theDivWidth )/2:0;
      var theTopPos = (topPosOverrideValue) ? topPosOverrideValue : ( thePageHeight - theDivHeight > 0 ) ? ( thePageHeight - theDivHeight )/2:0;
      var scrolledBy = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;  // Determine how far down from the top the user has scrolled
      aDiv.style.top   = scrolledBy + theTopPos + "px";  // Note "px" suffix had to be added for Firefox support
      aDiv.style.left  = theLeftPos + "px";
    }
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// fetchNVPValue( string aNVPName, string aURL )
//           Extracts the value of a Named Value Pair (NVP) from a URL
//       eg: fetchNVPValue( "name", "http://mypage.com?id=123&name=Shannon&foo=bar" ) returns "Shannon"
//
////////////////////////////////////////////////////////////////////////////////
function fetchNVPValue( aNVPName, aURL ) {
  var retVal = "";
  var bItsInThereSomeWhere = (aURL.toLowerCase().indexOf(aNVPName) > -1);
  // If we have a URL, a name to look for and it's in there somewhere ...
  if ( aNVPName && aURL && bItsInThereSomeWhere ) {
    var theURL = aURL.toLowerCase().replace(/\+/g, ' ');    // Turn all '+' signs back into spaces, if applicable
    var args = theURL.split("&");
    for (var i=0;i<args.length;i++) {
      var nvp = args[i].split("="); // Break out each argument out into a NVP
      var name  = unescape(nvp[0]);
      if (name==aNVPName) {
        retVal = nvp[1];
        break;
      }
    }
  }
  // If we still haven't extracted it and it's in there somewhere, the Named value follows a "?" in the URL, rather than a &
  if (( retVal == "") && bItsInThereSomeWhere) {
    if (aURL.toLowerCase().indexOf("?" + aNVPName) > -1) {
      retVal = aURL.split("?")[1].split("=")[1];
    }
  }
  return retVal;
}
////////////////////////////////////////////////////////////////////////////////
//
// showOrHide([object|string] oHTMLElement, boolean bShowOrHide)
//           Shows or Hides an HTMLElement.  
//           You can pass in the id to an object or the actual object
//
////////////////////////////////////////////////////////////////////////////////
function showOrHide(oHTMLElement, bShowOrHide) {
  try   {
    if (typeof(oHTMLElement)=="string")  { 
      oHTMLElement = document.getElementById(oHTMLElement); 
    }
    if (oHTMLElement && oHTMLElement.style) {
      if (bShowOrHide == 'inherit') {
        oHTMLElement.style.visibility = 'inherit';
      } else {
        if (bShowOrHide) {
          oHTMLElement.style.visibility = 'visible';
        } else {
          oHTMLElement.style.visibility = 'hidden';
        }
        try {
          if (bShowOrHide) {
            oHTMLElement.style.display = 'block';
          } else {
            oHTMLElement.style.display = 'none';
          }
        }
        catch (ex) {
        }
      }
    }
  }
  catch (ex) {
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// setClass(oHTMLElement, className) - sets a CSS Class on an HTMLElement
//
////////////////////////////////////////////////////////////////////////////////
function setClass(oHTMLElement, className) { 
  if ("" + oHTMLElement != "undefined") {
    if (typeof(oHTMLElement)=="string") { 
      oHTMLElement = document.getElementById(oHTMLElement); 
    }
    if (oHTMLElement) {
      oHTMLElement.oldClass = oHTMLElement.className; // Save off old CSS Class for restoring later 
      oHTMLElement.className = className;
    }
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// Log(string aMessage) - does logging based on GLOBAL bDebugging flag
//
////////////////////////////////////////////////////////////////////////////////
function Log( aMessage ) {
  if ( XOJET.bDebugMode ) {
    // for now, just show an alert box
    alert( aMessage );
  }
}
////////////////////////////////////////////////////////////////////////////////
//
// setImage(oHTMLElement, imageURL) - places an image into an element
//                                    applying alphaImageLoader as necessary
//
////////////////////////////////////////////////////////////////////////////////
function setImage(oHTMLElement, imageURL) {  
  if (typeof(oHTMLElement)=="string") { 
    oHTMLElement = document.getElementById(oHTMLElement); 
  }
  if (gGadgetMode) {
    oHTMLElement.src = imageURL;
  } else {
    oHTMLElement.style.backgroundImage = "url(images/1px.gif)";
    oHTMLElement.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imageURL + "',sizingMethod='scale')";
  }
}