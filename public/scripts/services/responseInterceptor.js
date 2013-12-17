angular.module('caracolApp')
.factory('caracolInterceptor', ['$q', '$location', '$cookieStore', function($q, $location, $cookieStore) {
  var interceptor = {
    responseError: function(rejection) {
      console.log('401 response from server intercepted, redirecting to /login.');
      $cookieStore.remove('user');
      $location.path('/login');
      return $q.reject(rejection);
    }
  };

  return interceptor;
}]);

