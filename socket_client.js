$(document).ready(function(){
	//var socket = io.connect('http://127.0.0.1:8080/');
	var socket = io.connect('http://tienlen.herokuapp.com');

	var m_playerId = Math.floor((Math.random() * 100) + 1);
	var m_roomId = -1;

	function checkCreatedRoom() {
		if(m_roomId < 0) {
			$('#create_room').attr("disabled", false);
			$('#leave_room').attr("disabled", true);
		}
		else {
			$('#create_room').attr("disabled", true);
			$('#leave_room').attr("disabled", false);
		}
	}

	checkCreatedRoom();;

	socket.on('connected', function(data){
		$('#hw1').text(data);
		checkCreatedRoom();
	})

	socket.on('disconnect', function(data){
		$('#hw1').text(data);
		checkCreatedRoom();

		m_roomId = -1;
	})

	socket.on('server_sent', function(data){
		//alert(data);
		$('#hw1').text(data.player_id);
	})
	
	socket.on('create_room', function(data){
		//alert(data);
		console.log(data);
		m_roomId = data.room_id;
		if(m_roomId >= 0) {
			checkCreatedRoom();
			$('#hw2').text('room_id: ' + m_roomId);
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

	$('#go').click(function(){
		//socket.emit('client_sent', $('#name').val());
		//socket.emit('create_room', "{\"player_id\":\"10\"}");
		list_room_id['%s', m_playerId] = Math.floor((Math.random() * 100) + 1);
		m_playerId ++;
		console.log(list_room_id);
	})
})
	
	