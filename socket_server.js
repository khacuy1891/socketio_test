var http = require('http');
var express = require('express');
var app = express();
var	socketIO = require('socket.io');
var	port = process.env.PORT || 8080;
//var	ip = process.env.IP || '192.168.1.5';

server = http.createServer(app).listen(port, function(){
	console.log('Socket.IO server started at: %s!', port);
}),

app.get('/index', function(req, res){
	res.send("<font color=red>HELLO WORLD</font>");
	//res.sendFile(__dirname + '/index.html');
});

/* server = http.createServer().listen(port, function(){
	console.log('Socket.IO server started at: %s!', port);
}), */

io = socketIO.listen(server);
io.set('match origin protocol', true);
io.set('origins', '*:*');

var count_client = 0;
	
var run = function(socket){
	count_client++;
	console.log('%s. Client %s connected to server!', count_client, socket.id);
	
	socket.emit('connected', "Connected successfuly to " + socket.handshake.address);
	
	// Receive data from client
	socket.on('create_table', function(data){
		console.log('create_table: ' + data);
		//var table_id = Math.floor((Math.random() * 10) + 1);
		// Send data to client
		socket.emit('create_table', JSON.parse(data));
		socket.broadcast.emit('create_table', JSON.parse(data));
	})
	
	// Receive data from client
	socket.on('client_sent', function(data){
		// Send data to client
		console.log('client_sent: ' + data);
		socket.broadcast.emit('server_sent', data);
		socket.emit('server_sent', data);
	})
	
	// Receive data from client
	socket.on('user', function(data){
		var address = socket.handshake.address;
		console.log('New connection from ' + address.address + ':' + address.port);
		console.log('Data from client: ', data);
		// Send data to client
		socket.broadcast.emit('hello-user', data);
	})
}

io.sockets.on('connection', run);