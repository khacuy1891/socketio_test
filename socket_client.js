$(document).ready(function(){
	//var socket = io.connect('http://127.0.0.1:8080/');
	var socket = io.connect('http://tienlen.herokuapp.com:80');
	
	socket.on('connected', function(data){
		alert(data);
	})
	
	socket.on('create_table', function(data){
		//alert(data);
		$('#hw1').text(data.player_id);
	})
	
	socket.on('server_sent', function(data){
		//alert(data);
		$('#hw2').text(data);
	})

	$('#go').click(function(){
		socket.emit('client_sent', $('#name').val());
		socket.emit('create_table', "{\"player_id\":\"web\"}");
	})
})
	
	