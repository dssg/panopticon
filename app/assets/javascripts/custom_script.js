$(document).ready(function(){

  $(".gridster ul").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [140, 140],
      draggable: {
        handle: 'div.header',
        stop: function(event, ui){
          var changes = this.serialize_changed();
          $.each(changes, function(index, item){
            var id = item.id.slice(item.id.indexOf('-')+1);
            console.log(id);

            MYAPP.update_widget(id, MYAPP.changesFormat(item));
          });
        },
        start: function(event, ui){
          console.log("dragged")
        }

      },
      serialize_params: function($w, wgd) {
            return {
                col: wgd.col,
                row: wgd.row,
                size_x: wgd.size_x,
                size_y: wgd.size_y,
                id: $($w).attr('id'),
            };
        },
  });


  if ($('#board-page').length){
    $.get(window.location.pathname + '/widgets', {}, function(data){
      var index = 0;
      for (index = 0; index< data.length; index++){
        $("#content").append(data[index]._id+'<br>')
      }

      for (index = 0; index< data.length; index++){
        addDialog(data[index]);
      }
    }); 
    
    // $(".gridster ul").gridster().data('gridster').on_stop_drag = function (event, ui){
      // var ser = MYAPP.gridster.serialize_changed();
      // console.log(ser);
    // }

  };

});