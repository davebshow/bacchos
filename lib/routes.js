'use strict'


var http = require('http')
,   url = require('url')
,   net = require('net');


exports.index = function(req, res) {
    res.render('index', {title : 'Bacchos'});
}


// change to simple api
exports.api = function(req, res) {
    var options = getOptions(req.url)
    ,   request = http.request(options, function (response) {

        res.writeHead(200, {'Content-Type': 'application/json'});

        response.on('data', function (chunk) {
            res.write(chunk);
        });

        response.on('end', function () {
            console.log('pop pop')
            res.end();
        }); 
    });

    request.on('error', function (e) {
        console.log('request failed' + e.message);
    });
    
    request.end();
};

// Parse request url and generate options for host
function getOptions(reqUrl) {
    var apiKey = 'hz2k7lvd6cu0lzidolxp6csbt6hjf86ru57cbyqphzm019m9'
    ,   parsedUrl = url.parse(reqUrl)
    ,   path = parsedUrl.path + '&akey=' + apiKey;
    return {
        hostname: 'api.snooth.com',
        path: path,
        method: 'GET' 
    };
}
