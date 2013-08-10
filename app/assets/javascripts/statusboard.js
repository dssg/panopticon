MYAPP = {};
MYAPP.directions = ['right', 'left', 'down', 'up'];
MYAPP.offsets = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

MYAPP.format_mongo_json = function(data){
  $.each(data, function(index, item){
    item.id = item._id;
    delete item._id;
  });
  return data;
}

MYAPP.update_widget = function (widget_id, updated_properties) {
  var index = widget_id.indexOf('-');

  // slicing out the #widgetid- part if it exists, should be taken out later
  if (index >= 0){
    widget_id = widget_id.slice(index + 1);
  }
  
  MYAPP.widgets[widget_id].location = [updated_properties.col, updated_properties.row];
  MYAPP.widgets[widget_id].size = [updated_properties.size_x, updated_properties.size_y];

  PUT(window.location.pathname + '/widgets/' + widget_id, MYAPP.widgets[widget_id]);
  console.log("sending all" + JSON.stringify(MYAPP.widgets[widget_id]));
};

MYAPP.change_size = function (widget_id, offset) {
  var temp_size = MYAPP.get_size(widget_id);

  // the size of a widget should never be 0, so default to 1
  var temp_x = (temp_size[0] + offset[0]) || 1;
  var temp_y = (temp_size[1] + offset[1]) || 1;

  MYAPP.gridster.resize_widget($("#widgetid-" + widget_id), temp_x, temp_y, MYAPP.update_all);
}

MYAPP.get_size = function(widget_id){
  var index = 0;
  var serialize = MYAPP.gridster.serialize();
  for (index = 0; index < serialize.length; index++){
    if (serialize[index].id.indexOf(widget_id) != -1)
      return [serialize[index].size_x, serialize[index].size_y];
  }
}

MYAPP.update_all = function(){
  $.each(MYAPP.gridster.serialize(), function(index, item){
    MYAPP.update_widget(item.id, item);
  });
}

MYAPP.createBox = function(widget){

  var widgetDomID = "#widgetid-" + widget.id;

  var params = widget.params;

  MYAPP.gridster = $(".gridster ul").gridster().data('gridster');

  // slice currentDiv to remove #
  $('.gridster ul').append(MYAPP.makeLI(widgetDomID.slice(1), widget.location[0], widget.location[1], widget.size[0], widget.size[1], "This text should be replaced"));
  $(widgetDomID + ' .title').text(widget.title);

  var widgetDomIDAndHeader = widgetDomID + ' .header .icon-arrow-';

  $.each(MYAPP.directions, function (index, item) {
    $(widgetDomIDAndHeader + item).click(function () {
      MYAPP.change_size(widget.id, MYAPP.offsets[index]);
    });
  });

  $(widgetDomID + ' .header .icon-wrench').click(function () {
    var opt = {
      change: function (data) {
        MYAPP.widgets[widget.id] = data;
      },
      propertyclick: function (path) { /* called when a property is clicked with the JS path to that property */
        console.log(path);
      }
    };
    var jsonEditorElem = $(document.createElement('div')).addClass("json-editor");
    var f = function () {
        PUT(window.location.pathname + '/widgets/' + widget.id, MYAPP.widgets[widget.id]);
      }
    bootbox.alert(jsonEditorElem, f);
    $('.modal-body div').jsonEditor(widget, opt);
  });

  return widgetDomID;
}

MYAPP.makeWidgets = function(){
  for (widget in MYAPP.widgets){
    MYAPP.makeWidget(widget);
  }
}

MYAPP.makeWidget = function(widget_id){
  var widget = MYAPP.widgets[widget_id];
  var domString = MYAPP.createBox(widget) + ' .body';
  var params = widget.params;
  if (widget.widgettype == "text") {
    MYAPP.WidgetsTemplate.TextBox(widget, domString);
  } else if (widget.widgettype === "flickr") {
    MYAPP.WidgetsTemplate.FlickrBox(widget, domString);
  } else if (widget.widgettype === "countdown") {
    MYAPP.WidgetsTemplate.CountdownBox(widget, domString);
  } else if (widget.widgettype === "image-dynamic") {
    MYAPP.WidgetsTemplate.ImageDynamicBox(widget, domString);
  }
}

MYAPP.makeLI = function (id, col, row, size_x, size_y, title) {
  var real_content = '<div class="header"><span class="title">Title</span><span class="icons pull-right">';
  real_content += '<i class="icon-arrow-up"></i><i class="icon-arrow-left"></i><i class="icon-arrow-down"></i><i class="icon-arrow-right"></i><i class="icon-wrench"></i></div></div>';
  real_content += '<div class="body"></div>';
  return MYAPP.gridster.add_widget(sprintf('<li id="%s" class="new">%s</li>', id, real_content), size_x, size_y, col, row);
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