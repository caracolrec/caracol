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
    })
    .when('/login', {
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
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
});
