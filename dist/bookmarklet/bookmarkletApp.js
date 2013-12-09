//angular app

var app = angular.module('app', ['ngRoute',
                                 'app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/login.html',
      controller: 'LoginCtrl'
    })
    .when('/vote', {
      templateUrl: '/partials/vote.html',
      controller: 'LoginCtrl'
    })
    .otherwise({
      redirectTo: '/partials/login.html'
    });
}).run(function($rootScope, $location, UploadService){
  //check for session
  //if session do this
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  $rootScope.hide = false;
  UploadService.sendURI(uri)
  .then(function(data){
    $location.path('/vote');
    console.log('saved clipping to db, id:', data);
  }, function(error){
    console.log('failed to save clipping to db', error);
  });
  //else
  //change route to login
});

var services = angular.module('app.services', []);

services.factory('LoginService', function($q, $http) {
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
});

services.factory('UploadService', function($q, $http){
  var service = {
    sendURI: function(uri){
      var d = $q.defer();
      $http.post('/uri', {
        uri: uri
      }, {
        withCredentials: true
      }).success(function(data){
        d.resolve(data);
      }).error(function(data){
        d.reject(data);
        console.log('error parsing article', data);
      });
      return d.promise;
    }
  };
  return service;
});

services.factory('VoteService', function($q, $http) {
  var service = {
    vote: function(vote, uri){
      var d = $q.defer();
      $http.post('/vote/'+uri, {
        vote: vote
      }, {
        withCredentials: true
      }).success(function(data){
        d.resolve(data);
      }).error(function(data){
        console.log('vote posting error', data);
        d.reject(data);
      });
      return d.promise;
    }
  };
  return service;
});

var controllers = angular.module('app.controllers', []);

controllers.controller('LoginCtrl', function($scope, LoginService, $rootScope){
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    LoginService.login($scope.user.loginUser, $scope.user.loginPassword)
    .then(function(user){
      LoginService.setAuthenticated(user);
      $scope.$emit('logged_in', user.username);
      console.log('current user is:', LoginService.currentUser);
      $location.path('/vote');
    }, function(err) {
      console.log('error logging in:', err);
      $scope.user.error = err;
    });
  };
});

controllers.controller('VoteCtrl', function($scope, VoteService, $rootScope){
  $scope.voted = false;

  $scope.log = function(vote){
    !!vote ? ($scope.like = true) : ($scope.dislike = true);
  };

  $scope.hide = function(){
    $rootScope.hide = true;
  };

  $scope.vote = function(vote){
    //grabs uri and vote status
    var url = (window.location !== window.parent.location) ? document.referrer: document.location;
    var uri = encodeURIComponent(url);
    VoteService.vote(vote, uri);
    $scope.log(vote);
    $scope.voted = true;
  };
  
  $scope.revert = function(preference){
    $scope.voted = false;
    $scope[preference] = false;
  };

});

var directives = angular.module('app.directives', []);


