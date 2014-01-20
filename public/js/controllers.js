var bacchosControllers = angular.module('bacchosControllers', []).


    controller('MapCtrl', ['$scope', 'addStoreMarkers',
        function ($scope, addStoreMarkers) {
            $scope.$parent.stores = [];
            $scope.markers = {}
            $scope.centerLat = 40.095;
            $scope.centerLng = -3.823;
            $scope.zoom = 6;
            $scope.mapService = mapService;
            $scope.$parent.$watch('stores', function () {
                var data = $scope.$parent.stores;
                if (data.length>0) {
                    var processedData = mapService.process(data)
                    $scope.markers = processedData.markers;
                    $scope.centerLat = processedData.centerLat;
                    $scope.centerLng = processedData.centerLng;
                    $scope.zoom = 8;
                     angular.extend($scope, {
                        center: {
                            lat: $scope.centerLat,
                            lng: $scope.centerLng,
                            zoom: $scope.zoom
                        },
                        markers: $scope.markers,
                        defaults: {
                            scrollWheelZoom: false
                        }
                    });
                  
                }
            });
            angular.extend($scope, {
                center: {
                    lat: $scope.centerLat,
                    lng: $scope.centerLng,
                    zoom: $scope.zoom
                    },
                    markers: $scope.markers,
                    defaults: {
                        scrollWheelZoom: false
                    }
                });
        }
    ]).
            

    controller('GetStores', ['$scope', '$http',
        function ($scope, $http) {

            $scope.keys = {};

            $scope.addKeys = function (formData) {
                $scope.keys = angular.copy(formData);
            }
            
            $scope.processForm = function() {
                console.log('processing')
                $http({
                    method  : 'GET',
                    url     : '/stores',
                    params  : $scope.keys,  
                    headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
                }).
                // gonna have to handle this better
                success(function(data, status, headers, config) {
                    console.log('got stores');
                    $scope.$parent.stores = data;
                }).error(function(data, status, headers, config) {
                    console.log(status)
                })
            };
                
        }
    ]);
   

    