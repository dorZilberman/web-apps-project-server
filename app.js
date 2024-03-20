const initApp = require('./server');
const https = require('https');
const http = require('http');
const fs = require('fs');

const httpPort = process.env.HTTP_PORT || 3001;
const httpsPort = process.env.HTTPS_PORT || 3001;

initApp().then((app) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('development');
        http.createServer(app).listen(httpPort, () => {
            console.log('server started listening on port ' + httpPort)
        });
    } else {
        const options = {
            key: fs.readFileSync('./client-key.pem'),
            cert: fs.readFileSync('./client-cert.pem')
        };
        https.createServer(options, app).listen(httpsPort, () => {
            console.log('server started secure listening on port ' + httpsPort)
        });
    }
});