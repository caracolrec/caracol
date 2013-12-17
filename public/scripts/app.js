'use strict';

angular.module('caracolApp', [
  'ngRoute',
  'ui.bootstrap',
  'caracolApp.services',
  'caracolApp.controllers'
])
.config(function($routeProvider) {
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
.config(function($httpProvider) {
  $httpProvider.interceptors.push('caracolInterceptor');
})
.run(function($rootScope, $location, AuthService) {
  if (AuthService.isAuthenticated()) {
    $rootScope.loggedIn = true;
    $rootScope.username = AuthService.currentUser.username;
  } else {
    $rootScope.loggedIn = false;
    $rootScope.username = null;
  }
  $rootScope.$on("$routeChangeStart", function(evt, next, current) {
    console.log('according to client-side, user is authenticated:', AuthService.isAuthenticated());
    if (!AuthService.isAuthenticated() &&
        next.controller !== "LoginCtrl" && next.controller !== "MainCtrl"
      ) {
        $location.path('/login');
    }
  });
});
