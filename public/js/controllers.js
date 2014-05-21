'use strict';


var controllers = angular.module('bacchos.controllers', []);


controllers.controller('StoreCtrl', [
    '$scope',
    '$q',
    'apiFactory',
    'mapService',
    function ($scope, $q, apiFactory, mapService) {
        $scope.location = {};
        $scope.stores = {};
        $scope.header = 'asdfas'

        $scope.getStores = function (location) { 
            console.log('clicked')
            var storeData = apiFactory.get('/stores', location);  
            storeData.success(function (data, status, headers, config) {
                console.log('success', status)
                mapService.setMarkers(data.stores);
                console.log('stores', data)
            }).
            error(function (data, status, headers, config) {
                console.log(data);
                console.log(status);
            });            
        }; 

        var promiseGetStore = function (data) {
            var deferred = $q.defer();
            angular.forEach(mapService.markers, function (elem) {
                if (elem.id === data.id) deferred.resolve(elem);
            });
            return deferred.promise;
        }

        $scope.$on('markerClick', function (event, data) {
            mapService.getMarker(data).then(function (store) {
                $scope.stores.current = store;
            }) 
        });
}]);


controllers.controller('WineCtrl', [
    '$scope',
    '$routeParams',
    'apiFactory',
    function ($scope, $routeParams, apiFactory) { 
        $scope.wines = [];
        var params = {q: 'wine', m: $routeParams.storeId, 'n':100};
        console.log('params', params)
        var wineData = apiFactory.get('/wines', params);
        wineData.success(function (data, status, headers, config) {
            $scope.wines = data.wines;
        }).
        error(function (data, status, headers, config) {
            console.log(data);
            console.log(status);
        }); 
}]);


controllers.controller('Extras', [
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

        $scope.getWines = function(storeId) {
            console.log('storeId', storeId)
            var wineData = mapService.get('/wines', {m: storeId, q: 'wine', n: 100});
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
            var wineData = mapService.get('/winery', {id: wineryId});
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
