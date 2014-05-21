'use strict'


// dependencies
var express = require('express');

// create app and webserver
// add app as request handler
var app = express();
var http = require('http');
var server = http.createServer(app);

// local dependencies
var errors = require('./lib/errors');
var routes = require('./lib/routes');

// view settings
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.use(express.cookieSession());
app.use(express.csrf());
app.use(errors.xsrfProtect);

// errors
app.use(express.errorHandler({thowStack: true, dumpExceptions: true}));
app.use(errors.pageNotFound);

// routes
app.get('/', routes.index);
app.get('/stores', errors.protectAjax, routes.api);
app.get('/wines', errors.protectAjax, routes.api);
app.get('/winery', errors.protectAjax, routes.api);

// http server bind and listen to port 3000
server.listen(8080);
console.log('Listening on port 8080');

