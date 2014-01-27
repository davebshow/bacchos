var snoothClient = require('./clients/snooth_client')
var request = require('request')

// app routes
exports.index = function(req, res) {
    res.render('index', {title : 'Bacchos'});
}

// find stores by zipcode  
exports.storeQueryHandler = function(req, res) {
    var country = req.query['country']
    ,   zipcode = req.query['zipcode'];
    // make request to Snooth using the client module
    console.log('handling query in routes');
    snoothClient.storeQuery(country, zipcode, function (data) {
        //console.log(data)
        res.json(data);
    });
}

exports.wineQueryHandler = function(req, res) {
	console.log('wines request')
	var storeId = req.query['storeId'];
	snoothClient.winesByStore(storeId, function (data) {
		console.log(data);
		res.json(data);
	});
}

exports.wineryQueryHandler = function(req, res) {
    console.log('winery request')
    var wineryId = req.query['wineryId'];
    console.log('winery', wineryId)
    snoothClient.wineryDetail(wineryId, function (data) {
        console.log(data);
        res.json(data);
    });
}