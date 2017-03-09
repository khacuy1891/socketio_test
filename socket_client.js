$(document).ready(function(){
	var socket = io.connect('http://192.168.1.7:8080/');
	
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
	
	