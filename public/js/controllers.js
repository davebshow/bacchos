var bacchosControllers = angular.module('bacchosControllers', []).


    controller('MapCtrl', ['$scope', 'mapService',
        function ($scope, mapService) {

            // Set params for map init
            angular.extend($scope, {
               markers: {},
                center:  {
                    lat: 40.095,
                    lng: -3.823,    
                    zoom:  6
                }
            })

            // Update the scope store request
            $scope.updateScope = function(data) {
                console.log('updating')
                $scope.mapData = data;  
                $scope.markers = $scope.mapData.markers || {};
                $scope.center = {
                    lat: $scope.mapData.centerLat,
                    lng: $scope.mapData.centerLng,    
                    zoom: $scope.mapData.zoom 
                }
            }

            // Country and zip for stores request
            $scope.keys = {};

            // add the kwys from the form
            $scope.addKeys = function (formData) {
                console.log('keys loaded');
                $scope.keys = angular.copy(formData);
            }
            
            // Request the store data from the service
            $scope.processForm = function() {
                var mapData = mapService.get('/stores', $scope.keys);  
                mapData.success(function (data, status, headers, config) {
                    console.log('woop', data)
                    $scope.updateScope(data);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });
                
            };     
        }
    ]);