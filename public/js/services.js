var bacchosServices = angular.module('bacchosServices', []).

    factory('mapService', ['$http', function ($http) {

        function getHttp(url, keys) {
            var response = $http({
                method  : 'GET',
                url     : url,
                params  : keys,  
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            })
            return response
        }
        return {
            get: function (url, keys) {
                return new getHttp(url, keys)
            }  
        } // return
    }]);
  
 



