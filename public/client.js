$( document ).ready(function() {
  /*global io*/
  const socket = io();
  const jquery = jquery();
  
   
  // Form submittion with new message in field with id 'm'
  $('form').submit(function(){
    var messageToSend = $('#m').val();
    //send message to server here?
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
  
  //listen for user count
  socket.on('user', function(data){
    console.log(data);
    $('#num-users').text(`${data.currentUsers} users online`);
    $('#messeages')
    .append($('<li>'))
    .text(`${data.name} has ${data.connected ? joined : left} the chat`);
  })

  
  
  
});
