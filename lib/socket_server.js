var socketio = require('socket.io');
var async = require('async');
var snoothClient = require('./clients/snooth_client');

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    // web sockets
    io.sockets.on('connection', function(socket) {
        console.log('Socket connection established')

        // data goes here
        var zipcodeStores = {}
        ,   storeWines = {}
        ,   winesWineries = {};

        // find and store available wines by store
        // happens in backgro;und after zicode search
        socket.on('storeData', getWines);

        // get wines by store
        socket.on('storeId', getWineries);

        // find winery info for wine
        socket.on('wineryId', emitWinery);


        // upon client laying down store information-
        // we query snooth for the wines of all stores in zicode
        function getWines(data) {

            // get zipcode data for winesByStore query
            var zipcode = data.zip  
            ,   wineStores = data.stores;

            // build data structures 
            zipcodeStores[zipcode] = wineStores;

            // get ids for async map
            // Vineyard async requests too plus http://wiki.openstreetmap.org/wiki/Nominatim
            async.map(wineStores, wineCall, function (err, results) {

                // need to handle error
                
                for (var i=0; i<results.length; i++) {
                    var wines = results[i];
                    if (wines) {
                        storeWines[wines.storeId] = wines.wines;
                    }
                }
            });
        };


        // emit wines upon user request and start process of building winery-
        // information about all wines sold in store 
        function getWineries(data) {
            var zipcode = data.zip
            ,   storeId = data.store
            ,   wines = storeWines[storeId];

            // here will check socket storage call api if necessary
            
            if (!wines) {
                snoothClient.winesByStore(storeId, function (data) {
                    wines = data;
                });
            }
            
            // need to handle error
            if (wines) {
                socket.emit('wines', wines);
                async.map(wines, wineryCall, function (err, results) {
                    for (var i=0; i<results.length; i++) {
                        var wineryData = results[i]
                        ,   wine = wineryData.wineid
                        ,   winery = wineryData.winery;
                        if (winery) {
                            if (winery.lat && winery.lng) {
                                winesWineries[wine] = winery;
                            } else {// query the server for a zip code upon user form input
                                console.log('Geocoding necessary')
                            }
                        }
                    }
                });
            } else {
                socket.emit('No wines located for this store');
            }   
        };

        function emitWinery(data) {

            var wineId = data.wineid
            ,   wineryId = data.wineryid
            ,   winery = winesWineries[wineId];

            if (!winery) {
                console.log('searching api')
                snoothClient.wineryDetail(winery, function(data) {
                    winery = data;
                });
            } 
            if (winery) {
                socket.emit('winery', winery);
            } else {
                socket.emit('winery', 'No winery found for this wine');
            }
        };
        

        // async iterator
        function wineCall(wineStore, doneCallback) {
            if (wineStore.num_wines>0) {    
                var storeId = wineStore.id;
                snoothClient.winesByStore(storeId, function (data) {
                    var response = {storeId: storeId, wines:data};
                    return doneCallback(null, response);
                });
            } else {
                return doneCallback(null, false);
            }   
        };

        function wineryCall(wine, doneCallback) {
            var wineId = wine.code
            ,   wineryId = wine.winery_id;
            snoothClient.wineryDetail(wineryId, function (data) {
                if (data) {
                    var response = {wineid: wineId, winery:data};
                return doneCallback(null, response);
                } else {
                    return doneCallback(null, false);
                }

            });
        };  

    }); // socket.on
} // anonymous