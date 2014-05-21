'use strict';


var directives = angular.module('bacchos.directives', []);

directives.directive('resize', ['$window', function ($window) {
    return function (scope, element, attrs) {
        scope.getWinHeight = function() {
            return $window.innerHeight;
        };
 
        var setMapHeight = function(newHeight) {
            element.css('height', newHeight+ 'px');
        };
 
        scope.$watch(scope.getWinHeight, function (newValue, oldValue) {
            console.log('resize', scope.getWinHeight())
            scope.mapHeight = scope.getWinHeight() - 100
            setMapHeight(scope.mapHeight);
        }, true);

        angular.element($window).bind('resize', function () {
            scope.$apply();
        });
    };
}]);


directives.directive('maxHeightResize', ['$window', function ($window) {
    return function (scope, element, attrs) {
        scope.getWinHeight = function() {
            return $window.innerHeight;
        };
 
        var setMapHeight = function(newHeight) {
            element.css('max-height', newHeight+ 'px');
        };
 
        scope.$watch(scope.getWinHeight, function (newValue, oldValue) {
            console.log('resize', scope.getWinHeight())
            scope.mapHeight = scope.getWinHeight() - 100
            setMapHeight(scope.mapHeight);
        }, true);

        angular.element($window).bind('resize', function () {
            scope.$apply();
        });
    };
}]);


directives.directive('bcMap', ['mapService', function (mapService) {
    return {
        controller: function($scope, $q, $window, mapService) {
            // Initialize with no markers. Geolocate if allowed.
            $scope.markers = [];
            $scope.center = [40, -90]

            var getGeoLocation = function () {
                var deferred = $q.defer();
                $window.navigator.geolocation.getCurrentPosition(function(position) {
                    deferred.resolve(position);
                }, function(err) {
                    console.log('err', err); 
                });
                return deferred.promise;
            };

            getGeoLocation().then(function (position) {
                if (position.coords) {
                    var newPosition = [position.coords.latitude, position.coords.longitude];
                    $scope.map.updateCenter(newPosition)
                }
            });

            // Watch markers. Update as needed.
            var watched = function () {return mapService.markers};
            $scope.$watchCollection(watched, function (newVal) {
                if (newVal.length > 0) {
                    console.log('changed')
                    console.log($scope.map)
                    $scope.map.addMarkers(newVal)
                }
            }, true);

        },
        link: function (scope, elem, attrs) {

            function Map(elem) {
                this.map = L.map(elem[0]).setView(scope.center, 8);
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(this.map);
            }

            Map.prototype.updateCenter = function(newCenter) {
                this.map.setView(newCenter, 8)
            }

            Map.prototype.addMarkers = function(markers) {
            
                var latLngArray = [];

                var wineIcon = L.icon({
                    iconUrl: '/media/wine_icon.png',
                    iconSize: [60,60]
                });
                for (var i=0; i<markers.length; i++) {
                    var marker = markers[i];
                    if (marker.lat && marker.lng) {
                        var lat = marker.lat
                        ,   lng = marker.lng;
                        latLngArray.push([parseFloat(lat), parseFloat(lng)])
                        if (marker.num_wines > 0) {
                            var marker = L.marker([lat, lng], {id: marker.id, icon: wineIcon})
                                .addTo(this.map);
                        } else {
                            var marker = L.marker([lat, lng], {'id':marker.id}).addTo(this.map);
                        }
                        marker.on('click', function (obj) {
                            var markerId = obj.target.options.id;
                            console.log(markerId)
                            scope.$broadcast('markerClick', {id: markerId})
                        });
                    } else {
                        console.log('geoloc');
                    }
                }  
                this.map.fitBounds(latLngArray);
            };
            scope.map = new Map(elem)
        }
    };
}]);
