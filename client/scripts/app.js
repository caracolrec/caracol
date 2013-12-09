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
    .when('/rec', {
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
