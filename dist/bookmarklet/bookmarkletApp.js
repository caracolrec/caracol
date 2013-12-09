//angular app
'use strict'

var app = angular.module('app', ['ngRoute',
                                 'app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/vote.html',
      controller: 'VoteCtrl'
    })
    .when('/vote', {
      templateUrl: '/partials/vote.html',
      controller: 'LoginCtrl'
    })
    .when('/recs', {
      templateUrl: '/partials/recommendation.html',
      controller: 'RecCtrl'
    })
    .otherwise({
      redirectTo: '/partials/login.html'
    });
}).run(function($rootScope, $location, UploadService){
  //check for session
  //if session do this
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  $rootScope.hidden = false;
  UploadService.sendURI(uri)
  .then(function(data){
  $location.path('/vote');
    console.log('saved clipping to db, id:', data);
  }, function(error){
      $location.path('/login');
    console.log('failed to save clipping to db', error);
  });

  $rootScope.hide = function(){
    $rootScope.hidden = !$rootScope.hidden;
  };
}).config(function ($routeProvider) {
  $routeProvider
    .when('/vote', {
      templateUrl: '/partials/vote.html',
      controller: 'VoteCtrl'
    })
    .when('/recs', {
      templateUrl: '/partials/recommendation.html',
      controller: 'RecCtrl'
    })
    .when('/login', {
      templateUrl: '/partials/login.html',
      controller: 'LoginCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});

var services = angular.module('app.services', []);

services.factory('FetchService', ['$q', '$http', function($q, $http) {
  var service = {
    fetch: function(clippings_or_recs, lastId, batchSize) {
      console.log('lastId is:', lastId);
      var route, d = $q.defer();

      if (clippings_or_recs === 'clippings') {
        route = '/fetchMyClippings';
      } else if (clippings_or_recs === 'recs') {
        route = '/fetchMyRecommendations';
      }

      $http.get(route, {
        params: {
          lastId: lastId,
          batchSize: batchSize
        }
      }, {
        withCredentials: true
      })
      .success(function(data) {
        console.log('success fetching', ':', data);
        d.resolve(service.massage(data));
      })
      .error(function(reason) {
        console.log('error getting old:', reason);
        d.reject(reason);
      });
      return d.promise;
    },

    massage: function(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].content_sans_html = data[i].clipping.content_sans_html || '';
        data[i].displayedExcerpt = data[i].content_sans_html.slice(0,250) + ' ...';
        data[i].elegantDate = service.elegantizeTimestamp(data[i]);
      }
      return data;
    },

    elegantizeTimestamp: function(article) {
      var numMilliseconds = new Date().getTime() - Date.parse(article.clipping.first_insert);
      var numSeconds = numMilliseconds/1000;
      var numMinutes = numSeconds/60;
      var numHours = numMinutes/60;
      if (numHours >= 24) {
        var month = article.clipping.first_insert.slice(5,7);
        var day = article.clipping.first_insert.slice(8,10);
        if (day[0] === '0') {
          day = day[1];
        }
        switch (month) {
          case '01':
            month = 'Jan';
            break;
          case '02':
            month = 'Feb';
            break;
          case '03':
            month = 'Mar';
            break;
          case '04':
            month = 'Apr';
            break;
          case '05':
            month = 'May';
            break;
          case '06':
            month = 'Jun';
            break;
          case '07':
            month = 'Jul';
            break;
          case '08':
            month = 'Aug';
            break;
          case '09':
            month = 'Sep';
            break;
          case '10':
            month = 'Oct';
            break;
          case '11':
            month = 'Nov';
            break;
          case '12':
            month = 'Dec';
            break;
        }
        return month + ' ' + day;
      } else {
        return 'today';
      }
    }
  };

  return service;
}]);
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

services.factory('RecService', function($q, $http, FetchService) {
  var service = {
        // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentRecs: [],
    lastRecId: 0,
    batchSize: 1,

    getRecs: function() {
      return FetchService.fetch('recs', 0, 3)
        .then(function(data) {
          service.updateState(data);
        });
    }
  };
  return service;
});

services.factory('UploadService', function($q, $http){
  var service = {
    uri: null,
    sendURI: function(uri){
      service.uri = uri;
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

controllers.controller('LoginCtrl', function($scope, $location, $rootScope, UploadService, LoginService){
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    LoginService.login($scope.user.loginUser, $scope.user.loginPassword)
    .then(function(user){
      LoginService.setAuthenticated(user);
      UploadService.sendURI(UploadService.uri).then(function(data){
        console.log('Sent uri after login', data);
        $location.path('/vote');
      }, function(err){
        console.log('Failed to send uri after login', err);
      });
      $scope.$emit('logged_in', user.username);
      console.log('current user is:', LoginService.currentUser);
    }, function(err) {
      console.log('error logging in:', err);
      //TODO add error message on bookmarklet
      $scope.user.error = err;
    });
  };
});

controllers.controller('RecCtrl', function($scope, LoginService, RecService, $rootScope){

  var afterGottenRecs = function(recs) {
    $scope.recs = recs;
  };

  $scope.loadRecs = function() {
    RecService.getRecs()
    .then(function(data) {
      $scope.recs = data;
      console.log('grabbed recs', data);
    });
  };

  $scope.loadRecs();

});

controllers.controller('VoteCtrl', function($scope, VoteService, $location, $rootScope){
  $scope.voted = false;
  console.log('b');
  $scope.log = function(vote){
    !!vote ? ($scope.like = true) : ($scope.dislike = true);
  };

  $scope.vote = function(vote){
    //grabs uri and vote status
    console.log('a');
    var url = (window.location !== window.parent.location) ? document.referrer: document.location;
    var uri = encodeURIComponent(url);
    VoteService.vote(vote, uri);
    $scope.log(vote);
    $scope.voted = true;
    
    setTimeout(function(){
      $rootScope.$apply(function(){
        $rootScope.hide();
      });
    }, 750);
    // $location.path('/recs');
  };
  
  $scope.revert = function(preference){
    $scope.voted = false;
    $scope[preference] = false;
  };

});

var directives = angular.module('app.directives', []);


