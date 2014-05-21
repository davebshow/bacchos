'use strict'


var bacchos = angular.module('bacchos', [
	'ngSanitize',
	'ngRoute',
	'bacchos.controllers',
	'bacchos.services',
	'bacchos.directives'
]);


bacchos.config([
    '$httpProvider',
    function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

bacchos.config([
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: '/partials/stores.html',
				controller: 'StoreCtrl'
			}).
			when('/:storeId/wines', {
				templateUrl: '/partials/wines.html',
				controller: 'WineCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
}]);