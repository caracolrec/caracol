'use strict';

angular.module('caracolApp.services')
.factory('AuthService', ['$q', '$http', function($q, $http) {
  var service = {
    
    getCurrentUser: function() {
      if (service.isAuthenticated()) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/current_user', {
          withCredentials: true
        }).success(function(data) {
          if (data.identifier) {
            return service.currentUser = data.identifier;
          }
        });
      }
    },

    currentUser: null,

    isAuthenticated: function() {
      return !!service.currentUser;
    },

    setAuthenticated: function(data) {
      service.currentUser = data;
    },

    signup: function(username, password) {
      var d = $q.defer();
      $http.post('/signup', {
        params: {
          username: username,
          password: password
        }
      }, {
        withCredentials: true
      })
      .success(function(data) {
        console.log('thanks for signing up buddy:', data);
        d.resolve(data);
      })
      .error(function(error) {
        console.log('signup error', error);
        d.reject(error);
      });
      return d.promise;
    },

    login: function(username, password) {
      var d = $q.defer();
      $http.post('/login', {
        params: {
          username: username,
          password: password
        }
      }, {
        withCredentials: true
      })
      .success(function(data) {
        console.log('thanks for logging in,', data);
        d.resolve(data);
      })
      .error(function(error) {
        console.log('login error:', error);
        d.reject(error);
      });
      return d.promise;
    },

    logout: function() {
      var d = $q.defer();
      $http.post('/logout', {}, {
        withCredentials: true
      })
      .success(function(data) {
        d.resolve(data);
      }).error(function(data) {
        d.reject(data);
      });
      return d.promise;
    }
  };
  return service;
}]);