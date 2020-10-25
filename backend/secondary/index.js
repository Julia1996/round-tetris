const http = require('http');
require('dotenv').config();
const server = require('./server');

const srv = http.createServer(server.accept);
srv.listen(0, () => {
  const { port } = srv.address();
  console.log('Server is running on port ' + port);
  const options = {
    host: process.env.PRIMARY_HOST,
    path: '/new-secondary',
    port: process.env.PRIMARY_PORT,
    method: 'POST'
  };
  const req = http.request(options);
  req.on('error', (error) => {
    console.error(error);
  });
  req.write(JSON.stringify({
    host: process.env.HOST,
    port: port,
    availableRooms: process.env.MAX_ROOMS - Object.keys(server.rooms).length,
  }));
  req.end();
});
