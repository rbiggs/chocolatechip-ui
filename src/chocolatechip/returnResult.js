   
   // Method to validate the results of an operation before returning it:
   var returnResult = function ( result ) {
      if (typeof result === 'string') return [];
      if (result && result.length && result[0] === undefined) return [];
      if (result && result.length) return result;
      else return [];
   };