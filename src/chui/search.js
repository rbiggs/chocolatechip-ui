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
      var settings = {
        articleId : $('article').eq(0)[0].id,
        id: $.Uuid(),
        placeholder: 'search',
        results: 1
      };
      if (options) {
        $.extend(settings, options);
      }
      var article = settings.articleId;
      var searchID = settings.id;
      var placeholder = settings.placeholder;
      var results = settings.results;
      var widget = '<div class="searchBar"><input placeholder="' + placeholder +'" type="search" results="' + results + '" id="'+ searchID + '"></div>';
      $(article).find('section').prepend(widget);
      if ($.isWin) {
        $(article).prev().append(widget);
        $('#' + searchID).parent().append('<span class="searchGlyph">&#xe11A;</span>');
      }
    }
  });
})(window.$);