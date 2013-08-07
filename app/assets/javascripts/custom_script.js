$(document).ready(function(){

  $(".gridster ul").gridster({
      widget_margins: [10, 10],
      widget_base_dimensions: [140, 140],
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
    

  };

});