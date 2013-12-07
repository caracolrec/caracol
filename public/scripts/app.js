'use strict';

angular.module('caracolApp', [
  'ngRoute',
  'ui.bootstrap',
  'angularLocalStorage',
  'caracolApp.services',
  'caracolApp.controllers'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/index.html',
      controller: 'MainCtrl'
    })
    .when('/login', {
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })
    .when('/clippings', {
     templateUrl: '/views/clippings.html',
     controller: 'ClippingsCtrl'
    })
    .when('/recommendations', {
      templateUrl: '/views/recommendations.html',
      controller: 'RecsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.run(function($rootScope, $location, AuthService) {
  $rootScope.$on("$routeChangeStart", function(evt, next, current) {
      if (!AuthService.isAuthenticated() &&
          next.controller !== "LoginCtrl" && next.controller !== "MainCtrl"
        ) {
          $location.path('/login');
      }
  });
});
