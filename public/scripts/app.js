'use strict';

angular.module('caracolApp', [
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html'
      })
      //.when('/in', {
      //  templateUrl: '/app/views/main.html',
      //  controller: 'MainCtrl'
      //})
      .otherwise({
        redirectTo: '/'
      });
  });
