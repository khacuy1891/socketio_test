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

var m_room_array = [];
var m_room_id_array = [];

function get_miss_room_id() {
	var room_id = 0;
	var number_room = m_room_id_array.length;
	for (room_id = 0; room_id < number_room; room_id++) {
		var i = 0;
		for (i = 0; i < number_room; i++) {
			if(room_id == m_room_id_array[0]) {
				break;
			}
		}

		if( i == number_room) {
			break;
		}
	}

	return room_id;
}

function array_to_string(array) {
	var str = '';
	for (i = 1; i < array.length - 2; i++) {
		str += array[i].toString() + '  ';
	}
	if(i = array.length - 1) {
		str += array[i].toString();
	}

	return str;
}

function show_list_room() {
	console.log(m_room_id_array);
	console.log(m_room_array);
}

function remove_player_id_in_room(room_id, player_id) {
	var number_room = m_room_id_array.length;
	for (var i = 0; i < number_room; i++) {
		if(m_room_id_array[i] == room_id) {
			var room = m_room_array[i];
			if ( room.length == 1 ) {
				m_room_id_array.splice(i, 1);
				m_room_array.splice(i, 1);
			}
			else {
				for (var j = 0; j < 4; j++) {
					if( player_id == room[j] ) {
						room.splice(j, 1);
						return 1;
					}
					
				}
			}
			
		}
	}

	return 0;
}

function add_player_id_in_room(room_id, player_id) {
	var number_room = m_room_id_array.length;
	for (var i = 0; i < number_room; i++) {
		if(m_room_id_array[i] == room_id) {
			var room = m_room_array[i];
			if(room.length < 4) {
				room.push(player_id);
				return 1;
			}
			else {
				return 0;
			}
			
		}
	}
	return -1;
}
	
var run = function(socket){
	var m_playerId = -1;
	var m_roomId = -1;

	count_client++;
	console.log('%s. Client %s connected to server!', count_client, socket.id);
	
	socket.emit('connected', 'Connected successfuly to: ' + socket.handshake.address + ':' + port);

	function get_list_room_id() {
		// list_room_id.splice(0, list_room_id.length);
		// for (var i = 0; i < list_room.length; i++) {
		// 	list_room_id.push(list_room[i][0]);
		// }

		socket.emit('list_room', m_room_id_array);
		socket.broadcast.emit('list_room', m_room_id_array);
	}

	 get_list_room_id();

	//***********************************************************************
	//disconnect
	socket.on('disconnect', function () {
		console.log('%s disconnected...', m_playerId);
      	count_client--;

      	// if(m_roomId >= 0) {
      	// 	remove_player_id_in_room(m_roomId, m_playerId);
      	// 	show_list_room();
      	// }

		socket.emit('disconnected');
  	});
	
	//***********************************************************************
	// Receive data from client
	socket.on('create_room', function(data) {
		console.log('***********************************************************************');
		console.log('create_room: ' + data);
		var dataJson = JSON.parse(data);

		m_playerId = dataJson.player_id;
		m_roomId = get_miss_room_id();
		console.log('room_id: ' + m_roomId);

		var room = [];
		m_room_id_array.push(m_roomId);
		room.push(m_playerId);

		m_room_array.push(room);
		show_list_room();

		var json = {
			"player_id" : m_playerId,
			"room_id" : m_roomId
		};

		console.log('json: ' + JSON.stringify(json));
		console.log('***********************************************************************');
		socket.emit('create_room', json);
		get_list_room_id();
	})

	//***********************************************************************
	// Receive data from client
	socket.on('join_room', function(data) {
		console.log('***********************************************************************');
		console.log('join_room: ' + data);
		var dataJson = JSON.parse(data);

		if(m_playerId < 0) {
			m_playerId = dataJson.player_id;
		}

		var result = 0;
		if(m_roomId < 0 ) {
			m_roomId = dataJson.room_id;
			result = add_player_id_in_room(m_roomId, m_playerId);
			show_list_room();
		}

		var json = {
			"player_id" : m_playerId,
			"room_id" : m_roomId,
			"result" : result
		};

		console.log('json: ' + JSON.stringify(json));
		console.log('***********************************************************************');
		socket.emit('join_room', json);
		socket.broadcast.emit('join_room', json);
	})

	//***********************************************************************
	socket.on('leave_room', function(data){
		console.log('leave_room: ' + data);
		
		var dataJson = JSON.parse(data);
		if(m_playerId < 0) {
			m_playerId = dataJson.player_id;
		}
		if(m_roomId < 0 ) {
			m_roomId = dataJson.room_id;
		}
		console.log( 'Player : (' + m_playerId + ', ' + m_roomId + ') has left' );

		var result = remove_player_id_in_room(m_roomId, m_playerId);
		if (result == 1) {
			m_roomId = -1;
		}		

		show_list_room();
		get_list_room_id();
		
		//socket.broadcast.emit('create_room', JSON.stringify(msg));
	})
	
	//***********************************************************************
	// Receive data from client
	socket.on('client_sent', function(data){
		// Send data to client
		console.log('client_sent: ' + data);
		socket.emit('server_sent', data);
		socket.broadcast.emit('server_sent', data);
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
