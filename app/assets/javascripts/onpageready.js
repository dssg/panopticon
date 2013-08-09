$(document).ready(function(){

  if ($('#board-page').length){
    $.get(window.location.pathname + '/widgets', {}, function(data){
      MYAPP.widgets = {};
      var index = 0;
      for (index = 0; index < data.length; index++){
        MYAPP.widgets[data[index]._id] = data[index];
      }
      
      makeWidgets();
    }); 



    var x = $(".gridster ul").gridster({
        widget_margins: [5,5],
        widget_base_dimensions: [140, 140],
        draggable: {
          handle: 'div.header',
          stop: function(event, ui){
            console.log(this.serialize_changed());
            $.each(this.serialize_changed(), function(index, item){
              var id = item.id.slice(item.id.indexOf('-')+1);
              MYAPP.update_widget(id, MYAPP.format_changes(item));
            });
          },
        },
        collision: {
          // on_overlap_stop: function(event, ui){
            
          // }
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

  };

});