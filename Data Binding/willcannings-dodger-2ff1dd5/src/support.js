// TODO: deep assertion and merging; i.e rather than blanket copying over a top
// level property like: {style:{}}; copy inner properties of style, and allow for
// testing that certain inner properties exist in a value

// uses a variable number of parameters to get the properties
// that should be checked. Used for checking option values.
// ensurePropertiesPresent(options, 'width', 'height')
function ensurePropertiesPresent(options) {
  if(!options)
    throw "Options not supplied";
  
  for(var i = 1, ii = arguments.length; i < ii; i++)
    if(options[arguments[i]] == undefined || options[arguments[i]] == null)
      throw arguments[i] + " is a required property";
}

// takes a set of default options and overwrites the values
// with any options found from options
function mergeOptions(defaultOptions, userOptions, object) {
  if(!userOptions)
    userOptions = {};
  
  for(option in defaultOptions) {
    if(userOptions[option] != undefined)
      object[option] = userOptions[option];
    else
      object[option] = defaultOptions[option];
  }
}

function cloneObject(object) {
  var newObject = {};
  for(var property in object)
    newObject[property] = object[property];
  return newObject;
}
