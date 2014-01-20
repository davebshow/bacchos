var bacchosControllers = angular.module('bacchosControllers', []).


	controller('MapCtrl', ['$scope',
		function ($scope) {
			$scope.stores = {};
				$scope.$watch('stores', function () {
					console.log('stores scope changed');
			})
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
	}]).

	controller('GetStores', ['$scope', '$http',
		function ($scope, $http) {

			$scope.keys = {};

    		$scope.addKeys = function (formData) {
        		$scope.keys = angular.copy(formData);
    		}
			

			$scope.processForm = function() {

				$http({
				    method  : 'GET',
				    url     : '/stores',
			        params  : $scope.keys,  // pass in data as strings
				    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
				})
		        .success(function(data) {
			   	
	   				console.log('data', data);

				  	if (!data.success) {
				  		console.log('fail', data)
				        // if not successful, bind errors to error variables
				            //$scope.errorName = data.errors.name;
				            //$scope.errorSuperhero = data.errors.superheroAlias;
		            } else {
		                $scope.stores = data.message;
		                
			        }
			    });
			};
				
		}
	]);

