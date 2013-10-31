   $.extend($, {
      
      templates : {},
       
      template : function ( tmpl, variable ) {
         var regex, delimiterOpen, delimiterClosed;
         variable = variable ? variable : 'data';
         regex = /\[\[=([\s\S]+?)\]\]/g;
         delimiterOpen = '[[';
         delimiterClosed = ']]'; 
         var template =  new Function(variable, 
            "var p=[];" + "p.push('" + tmpl
            .replace(/[\r\t\n]/g, " ")
            .split("'").join("\\'")
            .replace(regex,"',$1,'")
            .split(delimiterOpen).join("');")
            .split(delimiterClosed).join("p.push('") + "');" +
            "return p.join('');");
         return template;
      }
   });