MYAPP.WidgetsTemplate = {}

MYAPP.WidgetsTemplate.TextBox = function (widget, domString) {

  var url = window.location.pathname + '/widgets/' + widget.id;

  $(domString).text(widget.params.content).editable(url, {
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

MYAPP.WidgetsTemplate.FlickrBox = function (widget, domString) {

  $.post("/services/flickr_user_photos", {
    user_id: widget.params.user_id
  }, function (data) {
    MYAPP.photos = data;

    $.each(MYAPP.photos, function (i, item) {
      $("<img/>").attr({
        src: item.url_m
      }).appendTo(domString);
    });

    var x = $(domString).slidesjs({
      width: $(domString).parent().width(),
      height: $(domString).parent().height(),
      navigation: {
        active: false,
        effect: "fade"
      },
      pagination: {
        active: false
      },
      play: {
        auto: true,
        interval: widget.params.interval,
      },
      callback: {
        start: function(num){
          $(sprintf("[slidesjs-index=%d]", num)).imagefit(); // not working
        }
      }
    });
    
  }, "json"); // json request
}

MYAPP.WidgetsTemplate.CountdownBox = function (widget, domString) {
  $(domString).countdown({
    until: new Date(parseInt(widget.params.date) * 1000)
  });
}

MYAPP.WidgetsTemplate.ImageDynamicBox = function (widget, domString) {

  $.get(widget.params.url).done(function(){
    var myVar = setInterval(function () {
      $(domString + ' img').attr('src', widget.params.url);
    }, widget.params.interval);
    $(domString).append($("<img/>").attr("src", widget.params.url));  
  }).fail(function(){
    console.log("image won't load");
  });

  
}