var bacchosApp = angular.module('bacchosApp', [
	'ngRoute',
	'bacchosControllers',
	'leaflet-directive'
]);

bacchosApp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/index.jade',
				controller: 'MapCtrl'
			}).
			otherwise({
        		redirectTo: 'partials/index.jade'
      		});
}]);


