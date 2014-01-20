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
