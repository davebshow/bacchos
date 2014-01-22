var bacchosServices = angular.module('bacchosServices', []).

    factory('mapService', ['$http', '$q', function ($http, $q) {
        
        // custom promise $http request
        function PromiseRequest (keys) {
            this.defferedResponse = $q.defer();
        }

        PromiseRequest.prototype.get = function(url, keys) {
            var self = this;
            $http({
                method  : 'GET',
                url     : url,
                params  : keys,  
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
            }).
            success(function(data, status, headers, config) {
                self.defferedResponse.resolve(data);
            }).error(function(data, status, headers, config) {
                self.defferedResponse.reject(data);
            });
            return this.defferedResponse.promise
        }
        return {

            promiseRequest: function () {
                return new PromiseRequest()
            } 
                
        } // return
    }]);
  
 



