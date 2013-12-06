angular.module('caracolApp.services')
.factory('AuthService', ['$q', '$http', function($q, $http) {
  var service = {

    signup: function(username, password) {
      var d = $q.defer();
      $http.post('/signup', {
        params: {
          username: username,
          password: password
        }
      })
      .success(function(data, status) {
        console.log('thanks for signing up buddy');
        d.resolve(data);
      })
      .error(function(error, status) {
        console.log('login error', error);
        d.reject(error);
      });
      return d.promise;
    },

    login: function(username, password) {
      var d = $q.defer();
      $http.get('/login', {
        params: {
          username: username,
          password: password
        }
      })
      .success(function(data, status) {
        console.log('thanks for logging in buddy');
        d.resolve(data);
      })
      .error(function(error, status) {
        console.log('login error', error);
        d.reject(error);
      });
      return d.promise;
    }
  };
  return service;
}]);