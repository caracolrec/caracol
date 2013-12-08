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
