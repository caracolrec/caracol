'use strict'

angular.module('caracolApp.services')
.factory('AuthService', ['$q', '$http', function($q, $http) {
  var service = {

    signup: function(username) {
      var d = $q.defer();
      $http.post('/signup', {
        username: username
      })
      .success(function(data, status) {
        console.log('thanks for signing up buddy');
        d.resolve(data);
      })
      .error(function(error, status) {
        d.reject(error);
      });
      return d.promise;
    },

    login: function(username) {
      var d = $q.defer();
      $http.get('/login', {
        username: username
      })
      .success(function(data, status) {
        console.log('thanks for logging in buddy');
        d.resolve(data);
      })
      .error(function(error, status) {
        d.reject(error);
      });
      return d.promise;
    }
  };
  return service;
}]);