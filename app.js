var express = require('express');
var fs = require('fs')
var path = require('path');
var mime = require('mime');
var app = express()

cache = {}

// *http helper functions*
function send404(response) {
    response.writeHead(404, {'content-type': 'text/plain'});
    response.write('Error 404: resource not found');
    response.end()
}

// serve file
function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {'content-type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
};

app.use(express.logger());

//app.all('*', function(request, response, next) {
//	response.writeHead(200, {'Content-Type': 'text/plain'});
//	next();
//});

app.get('/', function(request, response){
	serveStatic(response, cache, './views/index.html');
});

app.get('/ajax/map', function(request, response) {
	data = '[{"lat": 41, "lng": -81}]'
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(data);
	console.log('SENT DATA');
});

app.listen(3000);
console.log('Listening on port 3000');