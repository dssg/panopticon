MYAPP = {};
MYAPP.update_widget = function(widget_id, json){
  PUT(window.location.pathname + '/widgets/' + widget_id, json);
};

function createDialog(widget){

  $("body").append('<div id="widgetid-' + widget._id + '"></div>');
  // var footer = '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix" id="dialog_footer"></div>';
  var currentDiv = "#widgetid-" + widget._id;

  $(currentDiv).dialog({
    modal       : false,
    autoOpen    : true,
    dialogClass : "widgetid-" + widget._id,
    height      : widget.size[1],
    width       : widget.size[0],
    position    : widget.location,
    title       : widget.title,
    //resize: function(event, ui){},
    dragStop    : function(event, ui){
      MYAPP.update_widget(widget._id, {"widget_id":widget._id ,"location":[ui.position.left, ui.position.top]});
    },
    resizeStop  : function(event, ui){
      MYAPP.update_widget(widget._id, {"widget_id":widget._id ,"size":[Math.round(ui.size.width), Math.round(ui.size.height)]});    
    }
  }).parents('.ui-dialog').draggable('option', 'snap', true);
  
  var titlebar = $(currentDiv).parents('.ui-dialog').find('.ui-dialog-titlebar');
  $('<span class="ui-icon ui-icon-gear">settings</span>')
        .appendTo(titlebar)
        .click(function() {
          var opt = { 
              change: function(data) { widget = data },
              propertyclick: function(path) { /* called when a property is clicked with the JS path to that property */ }
          };
          var divElem = $(document.createElement('div')).addClass("json-editor");
          var f = function(){
            console.log(widget);
          }
          bootbox.alert(divElem, f);

        $('.modal-body div').jsonEditor(widget, opt);
        });       

  return currentDiv;
}

function addDialog(widget){
  var domString = createDialog(widget);

  var params = widget.params;
  if (widget.widgettype == "text"){

    $(domString).text(params.content).editable(window.location.pathname + '/widgets/' + widget._id, { 
      method    : 'PUT',
      indicator : "Saving...",
      tooltip   : "Click to edit...",
      onblur    : "submit",
      name      : 'new-content',
      type      : 'textarea',
      data : function(value,settings) {
            value = value.replace(/(\r\n|\n|\r)/gm,"");
            return value.replace("<br>","\n");
            }
    });
  } else if (widget.widgettype == "twitter2"){
    $(domString + ".ui-dialog-content").css("background-color", "#000");
    $(domString + ".ui-dialog-content").append('<div id="tweets"></div>');
    $(domString + ' ' + "#tweets").tweetable({
      username: params.username, 
      limit: 5,
      onComplete: function(){
        // $(domString + ".ui-dialog-content").css("background-color", '');
      }
    }); 
  } else if (widget.widgettype === "flickr"){
    $(domString).html('<iframe align="center" src="http://www.flickr.com/slideShow/index.gne?user_id=97358734@N03" width="'+ widget.size[0] +'" height="' + widget.size[1] +'" frameBorder="0" scrolling="no"></iframe><br />');
      return;

    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{id: "97358734@N03", format: "json" },
      function(data) {
      $.each(data.items, function(i,item){
        // console.log(item)
            $("<img/>").attr({src : item.media.m.replace('_m.','.')}).appendTo(domString);
      });
     $(domString).slidesjs({
        width     : params.size[0],
        height    : params.size[1],
        navigation: {
          active  : false,
          effect  : "slide"
        },
        pagination: {
          active  : false
        },
        play      : {
          auto    : true,
          interval: params.interval || 5000,
        }
      });
    });
  } else if (widget.widgettype == "countdown"){
      $(domString).countdown({until: new Date(parseInt(widget.params.date) * 1000)});
  }
}

function POST(url, object){
  $.ajax(url, {
    data : JSON.stringify(object),
    contentType : 'application/json',
    type : 'POST'});
};

function PUT(url, object){
  $.ajax(url, {
    data : JSON.stringify(object),
    contentType : 'application/json',
    type : 'PUT'});
};