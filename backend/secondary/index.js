const http = require('http');
const ws = require('ws');

const wss = new ws.Server({noServer: true});

const rooms = {};

function accept(req, res) {
  // все входящие запросы должны использовать websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    res.end();
    return;
  }

  // может быть заголовок Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
  let currentRoom;
  let competitor;

  ws.on('message', function (message) {
  	const parsedMessage = JSON.parse(message);
  	if (parsedMessage.newPlayer) {
      // this is initiallization. add to a room
      const roomId = parsedMessage.newPlayer.roomId;
      if (rooms[roomId]) {
        rooms[roomId].players.push(ws);
        competitor = rooms[roomId].players[0];
      } else {
        const newRoom = { players: [ws] };
        rooms[roomId] = newRoom;
      }
      currentRoom = rooms[roomId];
    } else {
      // send data to competitor
	    if (!competitor) {
	      competitor = currentRoom.players.find(player => player !== ws);
	    }
	    competitor.send(message);
    }
  });
}

if (!module.parent) {
  http.createServer(accept).listen(9000);
} else {
  exports.accept = accept;
}