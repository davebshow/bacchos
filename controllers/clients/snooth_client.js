// dependency
var request = require('request')

exports.storeQuery = function(country, zipcode, callback) {
	var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9';
	request({
		uri: 'http://api.snooth.com/stores',
		method: 'GET',
		qs: {'akey': apiKey, 'c': country, 'z': zipcode}
	}, 
	function(err, response, body) {
		console.log(err);
		// need custom error handler here
		callback(body);
	});
} //