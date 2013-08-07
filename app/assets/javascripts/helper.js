MYAPP = {};
MYAPP.update_widget = function (widget_id, json) {
    PUT(window.location.pathname + '/widgets/' + widget_id, json);
};


function createBox(widget) {

    var currentDiv = "#widgetid-" + widget._id;
    var params = widget.params;

    MYAPP.gridster = $(".gridster ul").gridster().data('gridster');


    $('.gridster ul').append(makeLI(currentDiv.slice(1), widget.location[0], widget.location[1], widget.size[0], widget.size[1], "test"));
    $(currentDiv + ' .title').text(widget.title);

    
    $(currentDiv + ' .header .icon-arrow-right').click( function(){
      widget.size = [widget.size[0] + 1, widget.size[1]];
      MYAPP.update_widget(widget._id, {"size" : widget.size});
      MYAPP.gridster.resize_widget($(currentDiv), widget.size[0],widget.size[1]);
    });

    $(currentDiv + ' .header .icon-arrow-down').click( function(){
      widget.size = [widget.size[0], widget.size[1] + 1];
      MYAPP.update_widget(widget._id, {"size" : widget.size});
      MYAPP.gridster.resize_widget($(currentDiv), widget.size[0],widget.size[1]);
    });


    $(currentDiv + ' .header .icon-arrow-left').click( function(){
      widget.size = [widget.size[0] - 1, widget.size[1]];
      MYAPP.update_widget(widget._id, {"size" : widget.size});
      MYAPP.gridster.resize_widget($(currentDiv), widget.size[0],widget.size[1]);
    });


    $(currentDiv + ' .header .icon-arrow-up').click( function(){
      widget.size = [widget.size[0], widget.size[1] - 1];
      MYAPP.update_widget(widget._id, {"size" : widget.size});
      MYAPP.gridster.resize_widget($(currentDiv), widget.size[0],widget.size[1]);
    });




    $(currentDiv + ' .header .icon-wrench').click(function () {
        var opt = {
            change: function (data) {
                widget = data
            },
            propertyclick: function (path) { /* called when a property is clicked with the JS path to that property */ }
        };
        var divElem = $(document.createElement('div')).addClass("json-editor");
        var f = function () {
            console.log(widget);
        }
        bootbox.alert(divElem, f);

        $('.modal-body div').jsonEditor(widget, opt);
    });


    return currentDiv;
}

function addDialog(widget) {
    var domString = createBox(widget);
    domString = domString + ' .body';
    var params = widget.params;
    console.log(domString);
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
        // $(domString).html('<iframe align="center" src="http://www.flickr.com/slideShow/index.gne?user_id=97358734@N03" width="'+ widget.size[0] +'" height="' + widget.size[1] +'" frameBorder="0" scrolling="no"></iframe><br />');
        // return;

        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
                id: "97358734@N03",
                format: "json"
            },
            function (data) {
                $.each(data.items, function (i, item) {
                    // console.log(item)
                    $("<img/>").attr({
                        src: item.media.m.replace('_m.', '.')
                    }).appendTo(domString);
                });
                var w = $(domString).parent().width();
                console.log(w);
                $(domString).slidesjs({
                    width: $(domString).parent().width(),
                    height: $(domString).parent().height(),
                    navigation: {
                        active: false,
                        effect: "slide"
                    },
                    pagination: {
                        active: false
                    },
                    play: {
                        auto: true,
                        interval: params.interval || 5000,
                    }
                });
            });
    } else if (widget.widgettype == "countdown") {
        $(domString).countdown({
            until: new Date(parseInt(widget.params.date) * 1000)
        });
    }
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