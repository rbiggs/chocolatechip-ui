(function($) {
  "use strict";
  /////////////////////////
  // Create a search input:
  /////////////////////////
  /*
    $.UISearch({
      articleId: '#products',
      id: 'productSearch',
      placeholder: 'Find a product',
      results: 5
    })
  */
  $.extend({
    UISearch : function(options) {
      var article = options && options.articleId || $('article').eq(0);
      var searchID = options && options.id || $.Uuid();
      var placeholder = options && options.placeholder || 'search';
      var results = options && options.results || 1;
      var widget = '<div class="searchBar"><input placeholder="' + placeholder +'" type="search" results="' + results + '" id="'+ searchID + '"></div>';
      $(article).find('section').prepend(widget);
      if ($.isWin) {
        $(article).prev().append(widget);
        $('#' + searchID).parent().append('<span class="searchGlyph">&#xe11A;</span>');
      }
    }
  });
})(window.$);