$( document ).ready(function() {
  /*global*/
  const socket = io();
  
   
  // Form submittion with new message in field with id 'm'
  $('form').submit(function(){
    var messageToSend = $('#m').val();
    //send message to server here?
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
  
  //listen for user count
  socket.on('user count', function(data){
    console.log(data);
  })
  
  
});
