'use strict';

var bacchosControllers = angular.module('bacchosControllers', [
    'ngSanitize', 
]);

bacchosControllers.controller('MapCtrl', [
    '$scope', 
    'mapService',
    'geoLocation',

    function ($scope, mapService, geoLocation) {
        var mapData = {};
        $scope.wineContent = false;
        $scope.hideWines = true;
        $scope.wineryContent = false;
           
        $scope.$on('leafletDirectiveMarker.click', function (event, markerName) {
            
            $scope.wineContent = true;
            $scope.hideWines = true;
            $scope.wineryContent = false;
            var name = markerName.markerName;
            var store = mapData.markers[name]['store'];
            $scope.store = store;
        });

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
        };

        // Country and zip for stores request
        $scope.keys = {};

        // add the kwys from the form
        $scope.addKeys = function(formData) {
            console.log('keys loaded');
            $scope.keys = angular.copy(formData);
        };
        
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

        $scope.showWines = function() {
            console.log('yuo')
            $scope.hideWines = false;
            $scope.wineContent = true;
            $scope.wineryContent = false;
        };

        $scope.getWinery = function(wineryId) {
            console.log('wineId', wineryId)
            var wineData = mapService.get('/wine/winery', {wineryId: wineryId});
            wineData.success(function (data, status, headers, config) {
                console.log('woop', data);
                $scope.hideWines = true;
                $scope.wineContent = false;
                $scope.wineryContent = true;
                $scope.winery = data;
                //var lat = parseFloat(data.lat)
                //,   lng = parseFloat(data.lng)
                //,   name = data.name;
                //console.log(lat, lng)
                //if (lat && lng) {
                //    $scope.markers = {
                //        name: {
                //            lat: lat, 
                //            lng: lng, 
                //            focus:true, 
                //            draggable:false,
                //        },
                //        kind: 'winery'
                //    };

                    //$scope.center = {
                    //    lat: lat,
                    //    lng: parseFloat(data.lng),    
                    //    zoom: 8 
                    //};

                //}
            }).
            error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
            });
        };

        geoLocation.get().then(function (position) {
            if (position.coords) {
                $scope.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 5
                };
            }
        });
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
