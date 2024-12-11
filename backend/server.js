const http = require('http');
const app = require('./app');
const config = require('./config/config');


http.createServer(app).listen(config.server.port, () => {
    console.log(`Server running on http://localhost:${config.server.port}`);
});
