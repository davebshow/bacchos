angular.module('bacchosApp', [])

	

	.directive('map', function ($parse) {

	var directiveDefObj = {
		restrict: 'E',
		replace: false,
		link: function(scope, element, attrs) {
			// instantiate map
    		var map = L.map(element[0]).setView([44, -82], 8);
    		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    		}).addTo(map);
    	}
			
	};
	return directiveDefObj;

})


//bacchosApp.