MYAPP = {};
MYAPP.flickr_api_key = "302a4a49d1f85726239821d77caa7f50";

MYAPP.update_widget = function (widget_id, json) {
  PUT(window.location.pathname + '/widgets/' + widget_id, json);
};

MYAPP.directions = ['right', 'left', 'down', 'up'];
MYAPP.offsets = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

MYAPP.format_changes = function (orig) {
  return {
    location: [orig.row, orig.col],
    size: [orig.size_x, orig.size_y]
  };
};

MYAPP.change_size = function (widget, elem, offset) {
  // the size of a widget should never be 0, so default to 1
  var temp_x = (widget.size[0] + offset[0]) || 1;
  var temp_y = (widget.size[1] + offset[1]) || 1;

  widget.size = [temp_x, temp_y];

  MYAPP.update_widget(widget._id, {
    size: widget.size
  });

  MYAPP.gridster.resize_widget(elem, widget.size[0], widget.size[1]);
}

function createBox(widget) {
  console.log("creating box");

  var currentDiv = "#widgetid-" + widget._id;
  var params = widget.params;

  MYAPP.gridster = $(".gridster ul").gridster().data('gridster');

  $('.gridster ul').append(makeLI(currentDiv.slice(1), widget.location[0], widget.location[1], widget.size[0], widget.size[1], "test"));
  $(currentDiv + ' .title').text(widget.title);

  var currentDivAndHeader = currentDiv + ' .header .icon-arrow-';

  $.each(MYAPP.directions, function (index, item) {
    $(currentDivAndHeader + item).click(function () {
      MYAPP.change_size(widget, $(currentDiv), MYAPP.offsets[index]);
    });
  });

  $(currentDiv + ' .header .icon-wrench').click(function () {
    var opt = {
      change: function (data) {
        widget = data
      },
      propertyclick: function (path) { /* called when a property is clicked with the JS path to that property */
      }
    };
    var divElem = $(document.createElement('div')).addClass("json-editor");
    var f = function () {
        console.log(widget); // send update
      }
    bootbox.alert(divElem, f);
    $('.modal-body div').jsonEditor(widget, opt);
  });

  return currentDiv;
}

function makeWidget(widget) {
  var domString = createBox(widget) + ' .body';
  var params = widget.params;
  if (widget.widgettype == "text") {

    $(domString).text(params.content).editable(window.location.pathname + '/widgets/' + widget._id, {
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
  } else if (widget.widgettype == "twitter2") {
    $(domString + ".ui-dialog-content").css("background-color", "#000");
    $(domString + ".ui-dialog-content").append('<div id="tweets"></div>');
    $(domString + ' ' + "#tweets").tweetable({
      username: params.username,
      limit: 5,
      onComplete: function () {
        // $(domString + ".ui-dialog-content").css("background-color", '');
      }
    });
  } else if (widget.widgettype === "flickr") {

    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getList", {
      api_key: MYAPP.flickr_api_key,
      user_id: "97358734@N03",
      format: "json",
      nojsoncallback: 1,
      per_page: 50
    }, function (data) {
      MYAPP.sets = data.photosets.photoset;
      MYAPP.setIndex = 0;
      loadMoreSets(domString);

      // console.log(data);
    });
  } else if (widget.widgettype === "countdown") {
    $(domString).countdown({
      until: new Date(parseInt(params.date) * 1000)
    });
  } else if (widget.widgettype === "image-dynamic") {
    var myVar = setInterval(function () {
      $(domString + ' img').attr('src', params.url);
    }, 4000);
    $(domString).append($("<img/>").attr("src", params.url));
  }
}

function loadSlideJS(domString){
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
      interval: 5000,
    }
  });
}

function loadMoreSets(domString){
  console.log("more sets");
  if (MYAPP.setIndex >= MYAPP.sets.length )
    MYAPP.setIndex = 0;

  $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos", {
    api_key: MYAPP.flickr_api_key,
    photoset_id: MYAPP.sets[MYAPP.setIndex].id,//"72157634939324677",
    extras: "url_m",
    format: "json",
    nojsoncallback: 1,
    per_page: 50
  }, function (data) {
    // console.log(data.photoset.photo);

    $.each(data.photoset.photo, function (i, item) {
      $("<img/>").attr({
        src: item.url_m
      }).appendTo(domString);
    });

    // console.log("done");

    loadSlideJS(domString);
  });
  MYAPP.setIndex += 1;  
}

function makeLI(id, row, col, sizex, sizey, title) {
  var real_content = '<div class="header"><span class="title">Title</span><span class="icons pull-right">';
  real_content += '<i class="icon-arrow-up"></i><i class="icon-arrow-left"></i><i class="icon-arrow-down"></i><i class="icon-arrow-right"></i><i class="icon-wrench"></i></div></div>';
  real_content += '<div class="body"></div>';

  return MYAPP.gridster.add_widget(sprintf('<li id="%s" class="new">%s</li>', id, real_content), sizex, sizey, col, row);
}

function POST(url, object) {
  $.ajax(url, {
    data: JSON.stringify(object),
    contentType: 'application/json',
    type: 'POST'
  });
};

function PUT(url, object) {
  $.ajax(url, {
    data: JSON.stringify(object),
    contentType: 'application/json',
    type: 'PUT'
  });
};