var socketio = require('socket.io');
var async = require('async');
var snoothClient = require('./controllers/clients/snooth_client');

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    // web sockets
    io.sockets.on('connection', function(socket) {
        console.log('Socket connection established');

        // data goes here
        var zipcodesStoresWines = {};
        var winesWineries = {}

        // find and store available wines by store
        // happens in backgro;und after zicode search
        socket.on('storeData', getWines);

        // get wines by store
        socket.on('storeId', getWineries);

        function getWines(data) {

            // get zipcode data for winesByStore query
            var zipcode = data[0];
            var wineStores = data[1];

            // build data structures 
            var wineByStore = zipcodesStoresWines[zipcode] = {};

            // get ids for async map
            // Vineyard async requests too plus http://wiki.openstreetmap.org/wiki/Nominatim
            async.map(wineStores, wineCall, function(err, results) {

                // need to handle error
                for (var i=0; i<results.length; i++) {
                    var storeWines = results[i];
                    if (storeWines) {
                        wineByStore[storeWines[0]] = storeWines[1];
                    }
                }
            });
        };

        function getWineries(data) {
            var zipcode = data.zip;
            var storeId = data.store;

            // here will check socket storage call api if necessary
            var wines = zipcodesStoresWines[zipcode][storeId];
            if (!wines) {
                snoothClient.winesByStore(storeId, function(data) {
                    wines = data;
                });
            }
            
            // need to handle error
            if (wines) {
                socket.emit('wines', wines);
                async.map(wines, wineryCall, function(err, results) {
                    for (var i=0; i<results.length; i++) {
                        var  wineryData = results[i];
                        var wine = wineryData[0];
                        var winery = wineryData[1];
                        console.log(winery);
                        if (winery) {
                            if (winery.lat && winery.lng) {
                                winesWineries[wine] = winery;
                            } else {
                                console.log('Geocoding necessary')
                            }
                        }
                    }
                });
            } else {
                socket.emit('wines', 'No wines located for this store');
            }   
        };
        

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

        function wineryCall(wine, doneCallback) {
            var wineId = wine.code;
            var wineryId = wine.winery_id;
            snoothClient.wineryDetail(wineryId, function(data) {
                if (data) {
                    var responseArray = [];
                    responseArray[0] = wineId;
                    responseArray[1] = data;
                return doneCallback(null, responseArray);
                } else {
                    return doneCallback(null, false);
                }

            });
        };  

    }); // socket.on
} // anonymous