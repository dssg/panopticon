$(document).ready(function(){

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