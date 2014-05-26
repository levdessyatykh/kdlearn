(function($){
  var el;
  var settings = {};

  var methods = {
    init: function(options) {
      el = this;

      settings = {
                   token: false,
                   query_param: 'query'
                 };

      if (options) {
        $.extend(settings, options);
      }

      if (!settings.token || settings.query_param == '') {
        return this;
      }

      el.html('<div>Searching...</div>')

      $.getJSON(
        'http://tapirgo.com/api/1/search.json?token=' + settings.token + '&query=' + paramValue(settings.query_param) + '&callback=?', function(data){
          if(settings['complete']) { settings.complete(!!data.length, data) }
          if (!data.length) {
            el.html('<div>No results found</div>');
            return
          }
          el.html('')
          $.each(data, function(key, val) {
            summary = val.summary;
            if (settings.summary_limit != null) {
              summary = summary.slice(0, settings.summary_limit);
              summary = summary.slice(0, summary.lastIndexOf(' '));
              summary += '...';
            }
            el.append('<div class="result"><h3><a href="' + val.link + '">' + val.title + '</a></h3><p>' + summary + '</p></div>');
          });
        }
      );

      return this;
    }
  };

  // Extract the param value from the URL.
  function paramValue(query_param) {
    var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
    return results ? results[1] : false;
  }

  $.fn.tapir = function(method) {
    if (methods[method]) {
      return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.tapir');
    }
  };

})( jQuery );
