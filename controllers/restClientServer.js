// dependency
var socketio = require('socket.io')

// local dependency
var snoothClient = require('./clients/snooth_client')

// export to piggyback of http server
// push API call data to client
exports.listen = function(server) {
	io = socketio.listen(server);
	io.set('log level', 1);
}// dependency