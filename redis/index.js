const {runServer} = require("../common-server");
const Redis = require('ioredis');

module.exports = runServer(8001, new Redis({host: 'localhost'}));
