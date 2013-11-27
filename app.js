// dependency
var express = require('express');

// create app and bind to server
var app = express();
var server = require('http').createServer(app)

// local dependencies
var errors = require('./middleware/errors');
var routes = require('./controllers/routes');

// serve views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// set up middlewar
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({thowStack: true, dumpExceptions: true}));
app.use(errors.pageNotFound);

// routes
app.get('/', routes.index);

app.get('/ajax/zipcode', errors.protectAjax, routes.storeQueryHandler);

// http server bound to port 3000
server.listen(3000);
console.log('Listening on port 3000');

// socket.io server for handling blocking API calls
var restClientServer = require('./controllers/restClientServer');
restClientServer.listen(server);
