//angular app
'use strict'

var app = angular.module('app', ['ngRoute',
                                 'app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);
app.run(function($rootScope, $location, UploadService){
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
