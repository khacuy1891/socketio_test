var http = require('http');
var express = require('express');
var app = express();
var	socketIO = require('socket.io');
var	port = process.env.PORT || 8080;
//var	ip = process.env.IP || '192.168.1.5';

server = http.createServer(app).listen(port, function(){
	console.log('Socket.IO server started at: %s!', port);
}),

app.get('/client', function(req, res){
	//res.send("<font color=red>NGUYEN KHAC UY</font>");
	res.sendFile(__dirname + '/client.html');
});

app.get('/', function(req, res){
	//res.send("<font color=red>NGUYEN KHAC UY</font>");
	res.sendFile(__dirname + '/index.html');
});

app.get('/socket.io/1/?EIO=2&transport=polling&b64=true', function(req, res){
	//res.send('97:0{"sid":"kGOyxESR2SyIgD_AAEIH","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":60000}');
	res.sendFile(__dirname + '/index.html');
});

/* server = http.createServer().listen(port, function(){
	console.log('Socket.IO server started at: %s!', port);
}), */

io = socketIO.listen(server);
io.set('match origin protocol', true);
io.set('origins', '*:*');

var count_client = 0;

var list_player_id = [];
var list_room_id = [];

function get_miss_room_id() {
	var room_id = 0;
	var number_room = list_room_id.length;
	for (room_id = 0; room_id < number_room; room_id++) {
		var i = 0;
		for (i = 0; i < number_room; i++) {
			if(room_id == list_room_id[i]) {
				break;
			}
		}

		if( i == number_room) {
			break;
		}
	}

	return room_id;
}

function show_list_room_id() {
	var str = '';
	for (i = 0; i < list_room_id.length; i++) {
		str += list_room_id[i].toString() + '  ';
	}
	console.log("room_id: " + str);
}

function array_to_string(array) {
	var str = '';
	for (i = 0; i < array.length; i++) {
		str += array[i].toString() + '  ';
	}

	return str;
}
	
var run = function(socket){
	var m_playerId = -1;
	var m_roomId = -1;

	count_client++;
	console.log('%s. Client %s connected to server!', count_client, socket.id);
	
	socket.emit('connected', "Connected successfuly to: " + socket.handshake.address +  ":" + port);

	//***********************************************************************
	//disconnect
	socket.on('disconnect', function () {
		console.log('%s disconnected...', m_playerId);
      	count_client--;

      	var number_room = list_room_id.length;
		for (var i = 0; i < number_room; i++) {
			if(list_player_id[i] == m_playerId) {
				list_player_id.splice(i, 1);
				list_room_id.splice(i, 1);
			}
		}

		console.log('room_id: ' + array_to_string(list_room_id));
		console.log('player_id: ' + array_to_string(list_player_id));

		socket.emit('disconnected');
  	});
	
	//***********************************************************************
	// Receive data from client
	socket.on('create_room', function(data){
		console.log('create_room: ' + data);
		var dataJson = JSON.parse(data);

		m_playerId = dataJson.player_id;
		m_roomId = get_miss_room_id();

		list_player_id.push(m_playerId);
		list_room_id.push(m_roomId);

		console.log('room_id: ' + array_to_string(list_room_id));
		console.log('player_id: ' + array_to_string(list_player_id));

		var json = {
			"player_id" : m_playerId,
			"room_id" : m_roomId
		};

		console.log('json: ' + JSON.stringify(json));
		socket.emit('create_room', json);
	})

	//***********************************************************************
	socket.on('leave_room', function(data){
		console.log('leave_room: ' + data);
		
		var dataJson = JSON.parse(data);
		var player_id = dataJson.player_id;
		var room_id = dataJson.room_id;
		console.log( 'Player : (' + player_id + ', ' + room_id + ') has left' );

		if(player_id == m_playerId && room_id == m_roomId) {
			number_room = list_room_id.length;
			for (var i = 0; i < number_room; i++) {
				if(list_player_id[i] == m_playerId) {
					list_player_id.splice(i, 1);
					list_room_id.splice(i, 1);
				}
			}
		}

		console.log('room_id: ' + array_to_string(list_room_id));
		console.log('player_id: ' + array_to_string(list_player_id));
		
		//socket.broadcast.emit('create_room', JSON.stringify(msg));
	})
	
	//***********************************************************************
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