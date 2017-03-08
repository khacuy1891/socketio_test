$(document).ready(function(){
	var socket = io.connect('http://192.168.1.5:8080');
	socket.on('create_table', function(data){
		//alert(data);
		$('p').text('Data from Server: ' + data);
	})

	$('#go').click(function(){
		//socket.emit('user', $('#name').val());
		socket.emit('create_table', "{\"player_id\":\"web\"}");
	})
})
	
	