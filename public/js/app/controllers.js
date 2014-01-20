var bacchosControllers = angular.module('bacchosControllers', []).


	controller("MapCtrl", ['$scope',
		function ($scope) {
		    angular.extend($scope, {
				center: {
		            lat: 40.095,
		            lng: -3.823,
		            zoom: 6
		        },
		        markers: {},
		        defaults: {
		            scrollWheelZoom: false
		        }
		    });
	}]);

