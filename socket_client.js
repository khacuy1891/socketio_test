$(document).ready(function(){
	var socket = io.connect('http://tienlen.herokuapp.com/');
	
	socket.on('create_table', function(data){
		//alert(data);
		$('p').text('Data from Server: ' + data.player_id);
	})
	
	socket.on('server_sent', function(data){
		//alert(data);
		$('p').text('Data from Server: ' + data);
	})

	$('#go').click(function(){
		socket.emit('client_sent', $('#name').val());
		//socket.emit('create_table', "{\"player_id\":\"web\"}");
	})
})
	
	