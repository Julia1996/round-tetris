const http = require('http');
const ws = require('ws');
const uniqueId = require('lodash.uniqueid');

const wss = new ws.Server({noServer: true});

const awaitingPlayers = [];

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
  ws.on('message', function (message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.newPlayer && awaitingPlayers.length > 0) {
      const competitor = awaitingPlayers.shift();
      const roomId = uniqueId();

      ws.send(JSON.stringify({
        competitor: competitor.playerInfo,
        roomId: roomId,
        server: 'ws://localhost:9000',
      }));
      ws.close(1000, "data is sent");

      competitor.ws.send(JSON.stringify({
        competitor: parsedMessage.newPlayer,
        roomId: roomId,
        server: 'ws://localhost:9000',
      }));
      ws.close(1000, "data is sent");
    } else {
      awaitingPlayers.push({
        ws,
        playerInfo: parsedMessage.newPlayer,
      });
    }
  });
}

if (!module.parent) {
  http.createServer(accept).listen(8888);
} else {
  exports.accept = accept;
}
