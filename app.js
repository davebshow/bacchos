// dependencies
var express = require('express');
var async = require('async');

// create app and webserver
// add app as request handler
var app = express();
var server = require('http').createServer(app);

// piggyback socket on http server
var io = require('socket.io').listen(server);

// local dependencies
var errors = require('./middleware/errors');
var routes = require('./controllers/routes');
var snoothClient = require('./controllers/clients/snooth_client')

// view settings
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
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

    // data goes here :)
    var wineData = {};

    // find and store available wines by store
    // happens in background after zicode search
    socket.on('storeData', function(data) {

        // get zipcode data for winesByStore query
        var zipcode = data[0];
        var wineStores = data[1];

        // build data structures 
        var wineByStore = wineData[zipcode] = {};

        // get ids for async map
        async.map(wineStores, wineCall, function(err, results) {
            for (var i=0; i<results.length; i++) {
                var storeWines = results[i];
                if (storeWines) {
                    wineByStore[storeWines[0]] = storeWines[1];
                }
            }
        });
    });

    // get wines by store
    socket.on('storeId', function(data) {
        var zipcode = data.zip;
        var storeId = data.store;
        var wines = wineData[zipcode][storeId];
        console.log(wines);
        
    });

    // async iterator
    function wineCall(wineStore, doneCallback) {
        if (wineStore.num_wines>0) {
            var storeId = wineStore.id
            snoothClient.winesByStore(storeId, function(data) {
                var responseArray = [];
                responseArray[0] = storeId;
                responseArray[1] = data;
                return doneCallback(null, responseArray);
            });
        } else {
            return doneCallback(null, false);
        }   
    };
});
