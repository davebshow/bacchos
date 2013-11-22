var express = require('express');
var app = express()
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('log'));
app.use(express.static(__dirname + '/public'))
app.use(app.router)

app.get('/', function(request, response){
	response.render('index', {title : 'Home'});
});

app.get('/ajax/map', function(request, response) {
	data = '[{"lat": 41, "lng": -81}, {"lat":44, "lng": -122}]'
	response.end(data);
	console.log('SENT DATA');
});

app.listen(3000);
console.log('Listening on port 3000');