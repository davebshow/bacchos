// dependencies
var express = require('express');

// create app and webserver
// add app as request handler
var app = express();
var http = require('http');
var server = http.createServer(app);

// piggyback socket on http server
var socketServer = require('./lib/socket_server')
socketServer.listen(server);

// local dependencies
var errors = require('./lib/middleware/errors');
var routes = require('./lib/routes');


// view settings
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler({thowStack: true, dumpExceptions: true}));
app.use(errors.pageNotFound);

// routes
app.get('/', routes.index);
app.get('/ajax/zipcode', errors.protectAjax, routes.storeQueryHandler);

// http server bind and listen to port 3000
server.listen(3000);
console.log('Listening on port 3000');
