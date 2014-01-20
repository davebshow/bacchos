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
                    params  : $scope.keys,  
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                })
                // gonna have to handle this better
                .success(function(data) {
                
                    console.log('data', data);

                    if (!data.success) {
                        console.log('fail', data)
                    } else {
                        $scope.stores = data.message;
                        
                    }
                });
            };
                
        }
    ]);

