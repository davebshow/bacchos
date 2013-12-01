// dependency
var express = require('express');

// create app and webserver
// add app as request handler
var app = express();
var server = require('http').createServer(app);

// piggyback socket on http server
var io = require('socket.io').listen(server);

// local dependencies
var errors = require('./middleware/errors');
var routes = require('./controllers/routes');

// view settings
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));

// generate csrf tokens
app.use(express.cookieParser());
app.use(express.session({ 
	secret: 'keyboard cat', 
	key: 'sid',
	cookie: { secure: true }
}));
app.use(express.csrf());
app.use(function(req, res, next){
    res.locals.token = req.csrfToken;
    next();
});

app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({thowStack: true, dumpExceptions: true}));
app.use(errors.pageNotFound);

// routes
app.get('/', routes.index);
app.get('/ajax/zipcode', errors.protectAjax, routes.storeQueryHandler);

// http server bind and listen to port 3000
server.listen(3000);
console.log('Listening on port 3000');

// web sockets
io.sockets.on('connection', function(socket) {
	console.log('Socket connection established');

	socket.on('storeData', function(data) {
		console.log('got store data');
	});

	socket.on('storeId', function(data) {
		console.log('got store id')
	});
});
