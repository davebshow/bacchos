var bacchosControllers = angular.module('bacchosControllers', [
    'ngSanitize', 
]).
    controller('MapCtrl', [
        '$scope',
        '$rootScope',
        '$timeout', 
        '$window', 
        'mapService',
        'geoLocation',

        function ($scope, $rootScope, $window, $timeout, mapService, geoLocation) {

            var mapData = {};
            $scope.wineContent = false;
            $scope.hideWines = true;
            $scope.wineryContent = false;
           
            $scope.$on('leafletDirectiveMarker.click', function (event, markerName) {
                $scope.wineContent = true;
                $scope.hideWines = true;
                var name = markerName.markerName;
                var store = mapData.markers[name]['store'];
                $scope.store = store;
                $scope.$broadcast('viewStore');
                

            });

            $scope.search = true;
            // Update the scope store request
            $scope.updateScope = function(data) {
                console.log('updating')
                $scope.wines = {}; 
                mapData = data;
                $scope.markers = mapData.markers;
                $scope.center = {
                    lat: mapData.centerLat,
                    lng: mapData.centerLng,    
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
                    console.log('woop')
                    $scope.updateScope(data);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });
                
            };   

            $scope.getWines = function(storeId) {
                console.log('storeId', storeId)

                var wineData = mapService.get('/store/wines', {storeId: storeId});
                wineData.success(function (data, status, headers, config) {
                    console.log('woop', data);
                    $scope.hideWines = false;
                    $scope.wines = data;
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });

            };

            $scope.getWineries = function(wineId) {
                console.log('wineId', wineId)

                var wineData = mapService.get('/wine/winery', {wineId: wineId});
                wineData.success(function (data, status, headers, config) {
                    console.log('woop', data);
                    $scope.hideWines = true;
                    $scope.winery = data;
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log(status);
                });

            };

            geoLocation.get().then(function (position) {
                console.log('ctrl pos', position);
                $scope.center = {
                    lat: position.lat,
                    lng: position.lng,
                    zoom: 2
                }
            })
            // Set params for map init
            angular.extend($scope, {
                markers: {},
                center:  {
                    lat: 30,
                    lng: 10,    
                    zoom:  2
                },
                events: {
                    markers: {
                        enable: ['click', 'mouseover', 'mouseout'],
                        logic: 'emit'
                    }
                }
            }); 
        } // start func
    ]); //controller
