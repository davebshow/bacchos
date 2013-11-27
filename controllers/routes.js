var snoothClient = require('./clients/snooth_client')
var request = require('request')
// bacchos homepage
exports.index = function(req, res) {
    res.render('index', {title : 'Bacchos'});
}

// find stores by zipcode
exports.storeQueryHandler = function(req, res) {
	var country = req.query['country'];
    var zipcode = req.query['zipcode'];
    console.log(country);
    console.log(zipcode);
    snoothClient.storeQuery(country, zipcode, function(err, response, body) {
    	console.log(body);
    	console.log('callback');
    });
}

