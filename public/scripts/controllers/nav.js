'use strict';

angular.module('caracolApp.controllers')
.controller('NavCtrl', function($rootScope, $scope, $location, $cookieStore, AuthService) {
  $rootScope.active = [false, false]; // this keeps track of which view the user is currently in

  $scope.$on('logged_in', function(event) {
    $rootScope.loggedIn = true;
    $rootScope.username = AuthService.currentUser.username;
  });

  $scope.onLogOut = function() {
    $rootScope.loggedIn = false;
    $rootScope.username = null;
  };

  $scope.logout = function() {
    AuthService.logout()
    .then(function(data){
      console.log('successfully logged out:', data);
      console.log('is authenticated still:', AuthService.isAuthenticated());
      console.log('current user:', AuthService.currentUser);
      $scope.onLogOut();
      $location.path('/login');
    }, function(err){
      console.log('failed to logout:', err);
    });
  };

  $scope.intendedDest = function(destination) {
    $rootScope.intendedDestination = destination;
  }
});