MYAPP.WidgetsTemplate = {}

MYAPP.WidgetsTemplate.TextBox = function(widget, domString){

  $(domString).text(widget.params.content).editable(window.location.pathname + '/widgets/' + widget._id, {
    method: 'PUT',
    indicator: "Saving...",
    tooltip: "Click to edit...",
    onblur: "submit",
    name: 'new-content',
    type: 'textarea',
    data: function (value, settings) {
      value = value.replace(/(\r\n|\n|\r)/gm, "");
      return value.replace("<br>", "\n");
    }
  });       
}

MYAPP.WidgetsTemplate.FlickrBox = function(widget, domString){

  $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getList", {
    api_key: MYAPP.flickr_api_key,
    user_id: widget.params.user_id,
    format: "json",
    nojsoncallback: 1,
    per_page: 50
  }, function (data) {
    MYAPP.sets = data.photosets.photoset;

    MYAPP.setIndex = Math.floor(Math.random()*MYAPP.sets.length); ;
    loadMoreSets(domString);
    
    // console.log(data);
  });
}

MYAPP.WidgetsTemplate.CountdownBox = function(widget, domString){
  $(domString).countdown({
    until: new Date(parseInt(widget.params.date) * 1000)
  });
}

MYAPP.WidgetsTemplate.ImageDynamicBox = function(widget, domString){
  var myVar = setInterval(function () {
    $(domString + ' img').attr('src', widget.params.url);
  }, widget.params.interval);
  $(domString).append($("<img/>").attr("src", widget.params.url));
}