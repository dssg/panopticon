$(document).ready(function(){

  if ($('#board-page').length){
    $.get(window.location.pathname + '/widgets', {}, function(data){
      data = MYAPP.format_mongo_json(data);
      MYAPP.widgets = {};
      var index = 0;
      for (index = 0; index < data.length; index++){
        MYAPP.widgets[data[index].id] = data[index];
      }
      
      MYAPP.makeWidgets();
    }); 

    $(".gridster ul").gridster({
        widget_margins: [5,5],
        widget_base_dimensions: [140, 140],
        max_cols: 20,
        max_rows: 20,
        max_size_x: 10,
        max_size_y: 10,
        draggable: {
          handle: 'div.header',
          stop: function(event, ui){
            MYAPP.update_all();
          },
        },
        serialize_params: function($w, wgd) {
              return {
                  col: wgd.col,
                  row: wgd.row,
                  size_x: wgd.size_x,
                  size_y: wgd.size_y,
                  id: $($w).attr('id')
              };
          },
    });

  };
});