const secondaryServers = [];

async function checkHealth(secondaryServer) {
    try {
        const response = await new Promise((resolve, reject) => {
            const options = {
                host: secondaryServer.host,
                path: '/health-check',
                port: secondaryServer.port,
                method: 'GET',
            };
            const callback = function(response) {
                const str = '';
            
                //another chunk of data has been received, so append it to `str`
                response.on('data', function (chunk) {
                    str += chunk;
                });
            
                //the whole response has been received, so we just print it out here
                response.on('end', function () {
                    try {
                        const data = JSON.parse(str);
                        resolve(data);
                    } catch (e) {
                        const error = `Something went wrong. The response was ${data}`;
                        console.log(error);
                        reject(error);
                    }
                });
            }
            const req = http.request(options, callback);
            req.on('error', (error) => {
                console.error(error);
                reject(error);
            });
            req.end();
        });
        secondaryServer.availableRooms = response.availableRooms;
        return true;
    } catch (e) {
        return false;
    }
}

async function checkHealthOfAllSecondary() {
    for (let i; i < secondaryServers.length; i++) {
        const secondaryServer = secondaryServers[i];
        const awailable = await checkHealth(secondaryServer);
        if (!awailable) {
            secondaryServers.splice(i, 1);
            console.log(`Server ${secondaryServer.address} is dead and deleted`);
            i--;
        }
    }
}

function addNewSecondary(req, res) {
    let body = '';

    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        const secondaryInfo = JSON.parse(body);
        secondaryServers.push(secondaryInfo);
        console.log('New secondary server subcribed ', secondaryInfo);
        res.end('OK');
    });
}

async function getFreeSecondary() {
    if (!secondaryServers.length) return false; // TODO: programmatically raise new server

    const availableSecondary = secondaryServers.find(server => server.availableRooms > 0);
    const awailable = await checkHealth(secondaryServer);
    if (awailable && availableSecondary.availableRooms > 0) {
        availableSecondary.availableRooms--;
        const { host, port } = availableSecondary;
        return `ws://${host}:${port}`; 
    } {
        secondaryServers.splice(i, 1);
        console.log(`Server ${secondaryServer.address} is dead and deleted`);
        return getFreeSecondary();
    }
}

module.exports = {
    addNewSecondary,
    getFreeSecondary,
    checkHealthOfAllSecondary,
}