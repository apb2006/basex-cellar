// global 400 handler
//	http://stackoverflow.com/questions/11971213/error-401-handling-with-angularjs
angular.module('Error', [])
    .config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('Interceptor400');
    })
// register the interceptor as a service, intercepts ALL angular ajax http calls
    .factory('Interceptor400', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                return response;

            }, function (response) {
                var status = response.status;
                if (status == 400) {
                var deferred = $q.defer();
                var req = {
                    config:response.config,
                    deferred:deferred
                }
                alert("Error (code=400) : "+ response.data);
            }
            // otherwise
            return $q.reject(response);
            });
        };
    })	