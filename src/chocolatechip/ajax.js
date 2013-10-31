   $.extend($, {
      /*
         options = {
            url : 'the/path/here',
            type : ('GET', 'POST', PUT, 'DELETE'),
            data : myData,
            async : 'synch' || 'asynch',
            user : username (string),
            password : password (string),
            dataType : ('html', 'json', 'text', 'script', 'xml'),
            headers : {},
            success : callbackForSuccess,
            error : callbackForError
         }
      */
      ajax : function ( options ) {
         var dataTypes = {
            script: 'text/javascript, application/javascript',
            json:   'application/json',
            xml:    'application/xml, text/xml',
            html:   'text/html',
            text:   'text/plain'
         };
         var o = options ? options : {};
         var success = null;
         var error = options.error || $.noop;
         if (!!options) {
            if (!!o.success) {
               success = o.success;
            }
         }
         var request = new XMLHttpRequest();
         var type = o.type || 'get';
         var async  = o.async || false;      
         var params = o.data || null;
         request.queryString = params;
         request.open(type, o.url, async);
           if (!!o.headers) {  
             for (var prop in o.headers) { 
                 if(o.headers.hasOwnProperty(prop)) { 
                     request.setRequestHeader(prop, o.headers[prop]);
                 }
             }
         }
         if (o.dataType) {
            request.setRequestHeader('Content-Type', dataTypes[o.dataType]);
         }
         request.handleResp = (success !== null) ? success : $.noop; 
         
         var handleResponse = function() {
            if(request.status === 0 && request.readyState === 4 || request.status >= 200 && request.status < 300 && request.readyState === 4 || request.status === 304 && request.readyState === 4 ) {
               if (o.dataType) {
                  if (o.dataType === 'json') {
                     request.handleResp(JSON.parse(request.responseText));
                  } else {
                     request.handleResp(request.responseText);
                  }
               } else {
                  request.handleResp(request.responseText);
               }
            } else {
               if (!!error) {
                  error(request);
               }
            }
         };
         if (async) {
            request.onreadystatechange = handleResponse;
         }
         request.send(params);
         if (!async) {
            handleResponse();
         }
         return this;
      },
      
      // Parameters: url, data, success, dataType.
      get : function ( url, data, success, dataType ) {
          if (!url) {
             return;
          }
          if (!data) {
             return;
          }
          if (typeof data === 'function' && !dataType) {
             if (typeof success === 'string') {
                dataType = success;
             }
             $.ajax({url : url, type: 'GET', success : data, dataType : dataType});
          } else if (typeof data === 'object' && typeof success === 'function') {
             $.ajax({url : url, type: 'GET', data : data, dataType : dataType});
          }
      },
      
      // Parameters: url, data, success.
      getJSON : function ( url, data, success ) {
          if (!url) {
             return;
          }
          if (!data) {
             return;
          }
          if (typeof data === 'function' && !success) {
             $.ajax({url : url, type: 'GET', success : data, dataType : 'json'});
          } else if (typeof data === 'object' && typeof success === 'function') {
             $.ajax({url : url, type: 'GET', data : data, dataType : 'json'});
          }
      },

      // Parameters: url, callback.
      JSONP : function ( url, callback ) {
         var fn = 'fn_' + $.uuidNum(),
         script = document.createElement('script'),
         head = $('head')[0];
         window[fn] = function(data) {
            head.removeChild(script);
            callback && callback(data);
            delete window[fn];
         };
         script.src = url.replace('callback=?', 'callback=' + fn);
         head.appendChild(script);
      },
      
      // Parameters: url, data, success, dataType.
      post : function ( url, data, success, dataType ) {
          if (!url) {
             return;
          }
          if (!data) {
             return;
          }
          if (typeof data === 'function' && !dataType) {
             if (typeof success === 'string') {
                dataType = success;
             }
             $.ajax({url : url, type: 'POST', success : data, dataType : dataType});
          } else if (typeof data === 'object' && typeof success === 'function') {
             $.ajax({url : url, type: 'POST', data : data, dataType : dataType});
          }
      }
   });