var snoothClient = require('./clients/snooth_client')
var request = require('request')

// app routes
module.exports = function(io) {

    var routes = {};

    routes.index = function(req, res) {
        res.render('index', {title : 'Bacchos'});
    };

    // find stores by zipcode  
    routes.storeQueryHandler = function(req, res) {
        var country = req.query['country'];
        var zipcode = req.query['zipcode'];

        // make request to Snooth using the client module
        snoothClient.storeQuery(country, zipcode, function(data) {
            console.log(data);
            res.json(data);
        });
    };
    return routes;
};
