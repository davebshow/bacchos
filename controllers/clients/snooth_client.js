// dependency
var request = require('request')

// call to Snooth API 
// search for stores by country and zipcode
exports.storeQuery = function(country, zipcode, callback) {
    var apiKey = '**************************';
    request({
        uri: 'http://api.snooth.com/stores',
        method: 'GET',
        qs: {'akey': apiKey, 'c': country, 'z': zipcode}
    }, 
        function(err, response, body) {
            console.log(err);
            // need custom error handler here
            callback(body);
        }
    );
}