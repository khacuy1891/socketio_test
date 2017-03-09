$(document).ready(function(){
	var socket = io.connect('https://tienlen.herokuapp.com/');
	socket.on('create_table', function(data){
		//alert(data);
		$('p').text('Data from Server: ' + data.player_id);
	})

	$('#go').click(function(){
		//socket.emit('user', $('#name').val());
		socket.emit('create_table', "{\"player_id\":\"web\"}");
	})
})
	
	