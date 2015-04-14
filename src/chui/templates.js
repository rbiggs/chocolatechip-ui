(function($) {
  "use strict";
  $.extend({
  /////////////////////////////
  // Templating:
  /////////////////////////////
    templates : {},
   
    template : function ( tmpl, variable ) {
      var regex;
      variable = variable || 'data';
      regex = /\[\[=([\s\S]+?)\]\]/g;
      var template =  new Function(variable, 
        "var p=[];" + "p.push('" + tmpl
        .replace(/[\r\t\n]/g, " ")
        .split("'").join("\\'")
        .replace(regex,"',$1,'")
        .split('[[').join("');")
        .split(']]').join("p.push('") + "');" +
        "return p.join('');");
      return template;
    }
  });

  // Define repeater.
  // This lets you output a template repeatedly,
  // using an array of data.
  $.template.repeater = function( element, tmpl, data) {
    var template = $.template(tmpl);
    // Exit if data is not repeatable:
    if (!$.isArray(data)) {
      console.error('$.template.repeater() requires data of type Array.');
      return '$.template.repeater() requires data of type Array.';
    }
    if ($.isArray(data)) {
      data.forEach(function(item) {
        $(element).append(template(item));
      });
    }
  };
})(window.$);