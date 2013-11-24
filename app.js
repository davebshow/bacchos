var express = require('express');
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

app.get('/', function(req, res){
	res.render('index', {title : 'Home'});
});

app.post('/ajax/map', function(req, res) {
	console.log(req.body);
	var is_ajax_request = req.xhr;
	console.log(req.xhr);
	if (is_ajax_request) {
		var data = '[{"lat": 41, "lng": -81}, {"lat":44, "lng": -122}]'
		res.end(data);
		console.log('SENT DATA');
	}
});

app.listen(3000);
console.log('Listening on port 3000');