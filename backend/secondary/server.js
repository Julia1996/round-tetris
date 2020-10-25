const ws = require('ws');

const wss = new ws.Server({noServer: true});

const rooms = {};

function respondWithHealthCheck(req, res) {
  res.write(JSON.stringify({
    availableRooms: process.env.MAX_ROOMS - Object.keys(rooms).length
  }));
  res.end();
}

function accept(req, res) {
  let isWebsocket = true;
  // все входящие запросы должны использовать websockets
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    isWebsocket = false;
  }

  // может быть заголовок Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    isWebsocket = false;
  }

  if (isWebsocket) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
  } else if (req.url === '/health-check' && req.method === 'GET') {
    respondWithHealthCheck(req, res);
  } else {
    res.end();
    return;
  }
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

module.exports = {
    accept,
    rooms
};
