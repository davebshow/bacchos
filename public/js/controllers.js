var bacchosControllers = angular.module('bacchosControllers', []).


    controller('MapCtrl', ['$scope', 'mapService',
        function ($scope, mapService) {
            var centerLat = 40.095
            ,   centerLng = -3.823
            ,   zoom = 6;
            $scope.markers = {}
            $scope.center = {
                lat: centerLat,
                lng: centerLng,
                zoom: zoom
            },
            $scope.$parent.stores = [];
            $scope.mapService = mapService;
            $scope.$parent.$watch('stores', function () {
                var data = $scope.$parent.stores;
                if (data.length>0) {
                    var processedData = mapService.processStores(data)
                    $scope.markers = processedData.markers;
                    $scope.center = {
                        lat: processedData.centerLat,
                        lng: processedData.centerLng,
                        zoom: 8
                    }
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
   

    