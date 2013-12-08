'use strict';

angular.module('caracolApp.controllers')
.controller('NavCtrl', function($rootScope, $scope, AuthService) {
  $rootScope.active = [false, false];

  $scope.$on('logged_in', function(username) {
    $scope.loggedIn = !!username;
  });

  $scope.$on('logged_out', function() {
    $scope.loggedIn = false;
  });

  $scope.logout = function() {
    AuthService.logout()
    .then(function(data){
      console.log('successfully logged out:', data);
      AuthService.currentUser = null;
      console.log('is authenticated still:', AuthService.isAuthenticated());
      console.log('current user:', AuthService.currentUser);
      $scope.$emit('logged_out');
    }, function(err){
      console.log('failed to logout:', err);
    });
  };
});