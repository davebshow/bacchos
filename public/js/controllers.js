var bacchosControllers = angular.module('bacchosControllers', []).


    controller('MapCtrl', ['$scope', 'mapService',
        function ($scope, mapService) {

            var mapData = {};

            // Set params for map init
            angular.extend($scope, {
                markers: {},
                center:  {
                    lat: 40.095,
                    lng: -3.823,    
                    zoom:  6
                },
                events: {
                    markers: {
                        enable: ['click', 'mouseover'],
                        logic: 'emit'
                    }
                }
            });
            
            $scope.$on('leafletDirectiveMarker.mouseover', function (event, markerName) {
                var name = markerName.markerName;
                console.log(mapData.markers[name]['sidebar']);
                //console.log(sidebar)
            })

            
            // Update the scope store request
            var updateScope = function(data) {
                console.log('updating')
                mapData = data;  
                console.log(mapData)
                $scope.markers = mapData.markers || {};
                $scope.center = {
                    lat: mapData.centerLat || 40.095,
                    lng: mapData.centerLng || -3.823,    
                    zoom: mapData.zoom 
                }
            }

            // Country and zip for stores request
            $scope.keys = {};

            // add the kwys from the form
            $scope.addKeys = function(formData) {
                console.log('keys loaded');
                $scope.keys = angular.copy(formData);
            }
            
            // Request the store data from the service
            $scope.processForm = function(url) {
                var mapData = mapService.get(url, $scope.keys);  
                mapData.success(function (data, status, headers, config) {
                    console.log('woop', data)
                    updateScope(data);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });
                
            };  

            $scope.getWines = function(storeId) {
                console.log('query for wines')
                var wineData = mapService.get('/store/wines', {storeId: storeId});
                mapData.success(function (data, status, headers, config) {
                    console.log('woop', data)
                    updateScope(data);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });

            } ;  
        } // start func
    ]); //controller