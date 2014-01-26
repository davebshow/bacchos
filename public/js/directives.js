var bacchosDirectives = angular.module('bacchosDirectives', []).

	directive('resize', function ($window) {
        return function (scope, element, attrs) {
                scope.getWinHeight = function() {
                    return $window.innerHeight;
                }
 
                var setMapHeight = function(newHeight) {
                	element.css('height', newHeight+ 'px');
                }
 
                scope.$watch(scope.getWinHeight, function (newValue, oldValue) {
                    setMapHeight(scope.getWinHeight() - 20);
                }, true);
 
                angular.element($window).bind('resize', function () {
                    scope.$apply();
                });
        };
    }).

    directive('sizeWines', function ($window) {
        return function (scope, element, attrs) {
            var height = $window.innerHeight / 2.5 + 'px';
            console.log('height', height);
            element.css('height', height);
        }
    }).

    directive('getWines', function ($http, mapService) {
        return {
            link: function (scope, element, attrs) {
                function getWines () {
                    var id = scope.store.storeId
                    var result = mapService.get('store/wines', {storeId: id})
                    result.success(function (data, status, headers, config) {
                    console.log('woop', data);
                        scope.hideWines = false;
                        scope.clicked = false;
                        scope.wines = data;
                    }).
                    error(function (data, status, headers, config) {
                        console.log(data);
                        console.log(status);
                    });
                }
                element.on('click', function () {
                    scope.$apply(getWines)
                    console.log('wines', scope.wines)
                }); 
            }
        }
    });