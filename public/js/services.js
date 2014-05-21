'use strict';


var services = angular.module('bacchos.services', []);

services.factory('apiFactory', ['$http', function ($http) {

    function getHttp(url, keys) {
        var response = $http({
            method  : 'GET',
            url     : url,
            params  : keys,  
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        return response
    }
    return {
        get: function (url, keys) {
            return new getHttp(url, keys)
        }  
    }; // return
}]);


services.service('mapService', ['$q', function ($q) {
    this.markers = [];

    this.setMarkers = function (newMarkers) {
        this.markers = newMarkers;
    };

    this.getMarker = function (data) {
        var deferred = $q.defer();
        angular.forEach(this.markers, function (elem) {
            if (elem.id === data.id) deferred.resolve(elem);
        });
        return deferred.promise;
    };
}]);