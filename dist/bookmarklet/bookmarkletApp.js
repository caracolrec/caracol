//angular app

var app = angular.module('app', ['app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);

app.run(function($rootScope, UploadService){
  //check for session
  //if session do this
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  $rootScope.hide = false;
  UploadService.sendURI(uri)
  .then(function(data){
    console.log('saved clipping to db, id:', data);
  }, function(data){
    console.log('failed to save clipping to db', data);
  });
  //else
  //change route to login
}).config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/login.html',
      controller: 'MainCtrl'
    })
    .when('/vote', {
      templateUrl: '/partials/vote.html',
      controller: 'LoginCtrl'
    })
    .otherwise({
      redirectTo: '/partials/login.html'
    });
});

var services = angular.module('app.services', []);

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
directives.directive('ngVote', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'dist/bookmarklet/templates/vote.html'
  };
}).directive('ngLogin', function(){
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'dist/bookmarklet/templates/login.html'
  }
});

directives.directive('ngHome', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'dist/bookmarklet/templates/vote.html'
  };
});
