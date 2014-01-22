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
})