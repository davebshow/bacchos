var middleware = require('./lib/middleware');
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(middleware.protectAjax);
app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.errorHandler({thowStack: true, dumpExceptions: true}));
app.use(middleware.pageNotFound);

app.get('/', function(req, res){
    res.render('index', {title : 'Bacchos'});
});

app.get('/ajax/map', function(req, res) {
    console.log(req.query);
    var data = '[{"lat": 41, "lng": -81}, {"lat":44, "lng": -122}]';
    res.writeHead(200, {'Content-Type': 'application/json'}); 
    data.pipe(res);

    //res.end(data);
});

app.listen(3000);
console.log('Listening on port 3000');