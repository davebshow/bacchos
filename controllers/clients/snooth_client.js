// dependency
var request = require('request')

// call to Snooth API 
// search for stores by country and zipcode
exports.storeQuery = function(country, zipcode, callback) {
    var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9';
    request({
        uri: 'http://api.snooth.com/stores',
        method: 'GET',
        qs: {'akey': apiKey, 'c': country, 'z': zipcode}
    }, 
        function(err, response, body) {
            if (!err && response.statusCode == 200) {
                var JSONobj = JSON.parse(body);
                var data = JSONobj.stores;
                callback(data);
            } else {
                console.log(error);
                // need custom error handler here
            }   
        }
    );
}

exports.winesByStore = function(store_id) {
    var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9';
    request({
        uri: 'http://api.snooth.com/wines',
        method: 'GET',
        qs: {'akey': apiKey, 'm': store_id}
        }, 
        function(err, response, body) {
            if (!err && response.statusCode == 200) {
                var JSONobj = JSON.parse(body);
                var data = JSONobj.wines;
                callback(data);
            } else {
                console.log(error);
                // need custom error handler here
            }   
        }
    );

}