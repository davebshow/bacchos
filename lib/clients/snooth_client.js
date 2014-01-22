// dependency
var request = require('request')
,   db = require('../db/models');

// call to Snooth API 
// search for stores by country and zipcode
exports.storeQuery = function(country, zipcode, callback) {
    var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9';
    request({
        uri: 'http://api.snooth.com/stores',
        method: 'GET',
        qs: {'akey': apiKey, 'c': country, 'z': zipcode}
        }, 
        function (err, response, body) {
            if (!err && response.statusCode == 200) {
                try {
                    var jsonObj = JSON.parse(body)
                    ,   data = jsonObj.stores;
                    var processedData = processStoreMarkers(data);
                    callback(processedData);
                } catch(e) {
                    callback(false);
                }
            } else {
                console.log(err);
            // need custom error handler here
            }   
        }
    );
}

exports.winesByStore = function(storeId, callback) {
    var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9';
    request({
        uri: 'http://api.snooth.com/wines',
        method: 'GET',
        qs: {'q': 'wine', 'akey': apiKey, 'm': storeId}
        }, 
        function (err, response, body) {
            if (!err && response.statusCode == 200) {
                try {
                    var jsonObj = JSON.parse(body)
                    ,   data = jsonObj.wines;
                    console.log(jsonObj.meta);
                    callback(data);
                } catch(e) {
                    callback(false);
                }
            } else {
                console.log(err);
            // need custom error handler here
            }   
        }
    );
}

exports.wineryDetail = function(wineryId, callback) {
    var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9';
    request({
        uri: 'http://api.snooth.com/winery',
        method: 'GET',
        qs: {'akey': apiKey, 'id': wineryId, 'format': 'json'}
        },  
        function (err, response, body) {
            if (!err && response.statusCode == 200) {
                try {
                    var jsonObj = JSON.parse(body)
                    ,   data = jsonObj.winery;
                    console.log(jsonObj.meta);
                    callback(data);
                } catch(e) {
                    callback(false);
                }
            } else {
                console.log(err);
            // need custom error handler here
            }   
        }
    );
}


var processStoreMarkers = function(data) {
    var   latArray = []
    ,     lngArray = []
    ,     markers = {}
    ,     centerLat = 0
    ,     centerLng = 0;
    for (var i=0; i<data.length; i++) {
        var store = data[i]
        ,   storeId = store.id
        ,   name = store.name
        ,   address = store.address
        ,   city = store.city
        ,   state = store.state
        ,   country = store.country
        ,   loc = address + ', ' + city + ', ' + state + ', ' + country;
        if (name && store.lat && store.lng) {
            var lat = parseFloat(store.lat)
            ,   lng = parseFloat(store.lng);
            latArray.push(lat);
            lngArray.push(lng);
            name = name.replace(/\W/g, '');
            markers[name] = {lat: lat, lng: lng, focus:true, draggable:false};
            var message;
            if (store.url) {
                message = "<b><a href=" + store.url + ">" + name +"</a></b><br>" + loc;
            } else {
                message = "<b>" + name + "</b><br>" + loc;
            }
            if (store.num_wines>0) {
                var winesButton = "<button class='btn btn-link' type='submit'>wines</button>";
                message = message + "<br>" + winesButton;
                opacity = '10';
            } else {
                opacity = '1';
            }  
            markers[name]['message'] = message;
            markers[name]['opacity'] = opacity;
        } else {
            // need some geoloc
            console.log('need geolocation for', loc);
        }
    }
    if (latArray.length>0 && lngArray.length>0) {
        var latSum = latArray.reduce(function (a, b) {return a + b})
        ,   lngSum = lngArray.reduce(function (a, b) {return a + b});
        centerLat = latSum/latArray.length;
        centerLng  = lngSum/lngArray.length;
    }

    var storeData = {
        markers: markers, 
        centerLat: centerLat, 
        centerLng: centerLng,
        zoom: 8
    }; 

    return storeData
}