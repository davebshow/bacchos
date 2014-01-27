'use strict';

var bacchosDirectives = angular.module('bacchosDirectives', []);

bacchosDirectives.directive('resize', ['$window', function ($window) {
    return function (scope, element, attrs) {
        scope.getWinHeight = function() {
            return $window.innerHeight;
        };
 
        var setMapHeight = function(newHeight) {
            element.css('height', newHeight+ 'px');
        };
 
        scope.$watch(scope.getWinHeight, function (newValue, oldValue) {
            scope.mapHeight = scope.getWinHeight() - 100
            setMapHeight(scope.mapHeight);
        }, true);

        angular.element($window).bind('resize', function () {
            scope.$apply();
        });
    };
}]);

bacchosDirectives.directive('winesHeight', ['$window', function ($window) {
    return  function (scope, element, attrs) {
        console.log('form', scope.formHeight);
        scope.$watch('storeHeight', function () {
            var h = scope.mapHeight - (scope.formHeight + scope.storeHeight + 20) + 'px'
            element.css('height', h)
        });
    }
}]);

bacchosDirectives.directive('storeHeight', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$watch('store', function () {
            $timeout(function () {
                scope.$apply(function () {
                    scope.storeHeight = element[0].offsetHeight
                });
            });
        });
    };
}]);

bacchosDirectives.directive('formHeight', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        $timeout(function () {
            scope.$apply(function () {
                scope.formHeight = element[0].offsetHeight
            });
        });
    }
}]);

bacchosDirectives.directive('wineryHeight', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$watch('formHeight', function () {
            var h = scope.mapHeight - (scope.formHeight + 20) + 'px'
            console.log('h', h)
            element.css('height', h)
        });
    }
}]);