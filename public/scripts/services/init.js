'use strict';

angular.module('caracolApp.services', ['ngCookies'])
.config(function ($routeProvider, $httpProvider) {
  $httpProvider.defaults.withCredentials = true;
});