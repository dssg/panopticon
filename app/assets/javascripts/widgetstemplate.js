MYAPP.WidgetsTemplate = {}

MYAPP.WidgetsTemplate.TextBox = function (widget, domString) {

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

MYAPP.WidgetsTemplate.FlickrBox = function (widget, domString) {

  $.post("/services/flickr_user_photos", {
    user_id: widget.params.user_id
  }, function (data) {
    MYAPP.sets = data;

    MYAPP.setIndex = 0;
    $.each(MYAPP.sets, function (i, item) {
      $("<img/>").attr({
        src: item.url_m
      }).appendTo(domString);
    });

    $(domString).slidesjs({
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
        interval: 1000,
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
  var myVar = setInterval(function () {
    $(domString + ' img').attr('src', widget.params.url);
  }, widget.params.interval);
  $(domString).append($("<img/>").attr("src", widget.params.url));
}