const http = require('http');
const ws = require('ws');
const uniqueId = require('lodash.uniqueid');
require('dotenv').config();

const secondaryServersKeeper = require('./secondaryServersKeeper');

const wss = new ws.Server({noServer: true});

const awaitingPlayers = [];

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
  } else if (req.url === '/new-secondary' && req.method === 'POST') {
    secondaryServersKeeper.addNewSecondary(req, res);
  } else {
    res.end();
  }
}

function onConnect(ws) {
  ws.on('message', function (message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.newPlayer && awaitingPlayers.length > 0) {
      const competitor = awaitingPlayers.shift();
      const roomId = uniqueId();
      secondaryServersKeeper.getFreeSecondary()
        .then((secondaryServerAddress) => {
          ws.send(JSON.stringify({
            competitor: competitor.playerInfo,
            roomId: roomId,
            server: `ws://${secondaryServerAddress}`,
          }));
          ws.close(1000, "data is sent");
    
          competitor.ws.send(JSON.stringify({
            competitor: parsedMessage.newPlayer,
            roomId: roomId,
            server: `ws://${secondaryServerAddress}`,
          }));
          ws.close(1000, "data is sent");
        });
    } else {
      awaitingPlayers.push({
        ws,
        playerInfo: parsedMessage.newPlayer,
      });
    }
  });
}

http.createServer(accept).listen(process.env.PORT);
