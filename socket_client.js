$(document).ready(function(){
	var socket = io.connect('http://127.0.0.1:8080/');
	//var socket = io.connect('http://tienlen.herokuapp.com');

	var m_playerId = Math.floor((Math.random() * 100) + 1);
	var m_roomId = -1;

	var m_isJoining = false;

	function checkCreatedRoom() {
		if(m_roomId < 0) {
			$('#create_room').attr("disabled", false);
			$('#leave_room').attr("disabled", true);
			$('#join').attr("disabled", false);
		}
		else {
			$('#create_room').attr("disabled", true);
			$('#leave_room').attr("disabled", false);
			$('#join').attr("disabled", true);
		}
	}

	checkCreatedRoom();

	socket.on('connected', function(data){
		$('#hw1').text(data);
		checkCreatedRoom();
	})

	socket.on('disconnect', function(data){
		$('#hw1').text(data);
		checkCreatedRoom();

		//m_roomId = -1;
	})

	socket.on('server_sent', function(data){
		//alert(data);
		$('#hw1').text(data.player_id);
	})

	socket.on('join_room', function(data){
		//alert(data);
		if(m_isJoining == true && m_roomId < 0) {
			m_roomId = data.room_id;
		}
		
		m_isJoining = false;
		var msg = 'Cannot join this room!';
		if(data.result == 0) {
			msg = 'Room ' + data.room_id + ' full';
		}
		else if(data.result == 1) {
			msg = data.player_id + ' join ' + data.room_id + ' successfuly!';
			$('#hw2').text('room_id: ' + m_roomId);
		}

		$('#hw1').text(msg);
		checkCreatedRoom();
	})
	
	socket.on('create_room', function(data){
		//alert(data);
		console.log(data);
		m_roomId = data.room_id;
		if(m_roomId >= 0) {
			$('#hw2').text('room_id: ' + m_roomId);
		}
		checkCreatedRoom();
	})

	socket.on('list_room', function(data){
		console.log(data);
		$("#select_room option[value='room_id']").remove();
		for (var i = 0; i < data.length; i++) {
			$("#select_room").append(new Option(data[i].toString(), "room_id"));
		}
	})

	$('#create_room').click(function(){
		$('#hw1').text('player_id: ' + m_playerId);
		socket.emit('create_room', '{"player_id" : ' + m_playerId + '}');
	})

	$('#leave_room').click(function(){
		if(m_roomId >= 0) {
			var json = {
				"player_id" : m_playerId,
				"room_id" : m_roomId
			};

			m_roomId = -1;
			checkCreatedRoom();
			socket.emit('leave_room', JSON.stringify(json));
		}
	})

	$('#join').click(function(){
		var room_id_str = $('#select_room option:selected').text();
		var room_id = parseInt(room_id_str);
		m_isJoining = true;
		if(room_id >= 0) {
			var json = {
				"player_id" : m_playerId,
				"room_id" : room_id
			};
			checkCreatedRoom();
			socket.emit('join_room', JSON.stringify(json));
		}
	})
})
	
	