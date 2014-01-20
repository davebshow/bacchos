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
        var responseData = {zip: zipcode, stores: data};
        console.log(responseData)
        res.json(responseData);
    });
}
