$( document ).ready(function() {
  /*global io*/
  const socket = io();

  
   
  // Form submittion with new message in field with id 'm'
  $('form').submit(function(){
    var messageToSend = $('#m').val();
    //send message to server here
    socket.emit('chat message', messageToSend);
    $('#m').val('');
    return false; // prevent form submit from refreshing page
  });

  //listen for chat message
  socket.io('message chat', (data) =>{
    $('#messages').append($('<li>').html(`${data.name}: ${data.message}`));
  })
  
  //listen for user count
  socket.on('user', function(data){
    console.log(data);
    $('#num-users').text(`${data.currentUsers} users online`);
    $('#messages')
    .append($('<li>')
    .html(`<b>${data.name} has ${data.connected ? 'joined' : 'left'} the chat.</b>`));
  })

  
  
  
});
