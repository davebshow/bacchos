var snoothClient = require('./clients/snooth_client')
var request = require('request')
// bacchos homepage

module.exports = function(io) {
	var routes = {};
	routes.index = function(req, res) {
	    res.render('index', {title : 'Bacchos'});
	};

	// find stores by zipcode
	routes.storeQueryHandler = function(req, res) {
		var country = req.query['country'];
	    var zipcode = req.query['zipcode'];
	    console.log(country);
	    console.log(zipcode);
	    snoothClient.storeQuery(country, zipcode, function(data) {
	    	console.log(data);
	    	console.log('callback');
	    });
	};
	return routes;
};
