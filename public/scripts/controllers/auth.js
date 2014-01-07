'use strict';

angular.module('caracolApp.controllers')
.controller('LoginCtrl', function($rootScope, $scope, $location, AuthService) {
  $rootScope.active = [false, false];
  $scope.user = {};

  $scope.login = function(){
    AuthService.login($scope.user.loginUser, $scope.user.loginPassword)
    .then(function(user){
      AuthService.setAuthenticated(user);
      $scope.$emit('logged_in');
      console.log('current user is:', AuthService.currentUser);
      $rootScope.intendedDestination = $rootScope.intendedDestination || '/clippings';
      console.log('$rootScope.intendedDestination, just before redirect:', $rootScope.intendedDestination);
      $location.path($rootScope.intendedDestination);
    }, function(err) {
      console.log('error logging in:', err);
      $scope.user.error = err;
    });
  };

  $scope.signup = function() {
    if ($scope.user.signUpPassword === $scope.user.signUpPassword2) {
      console.log('$scope.user before signup attempt:', $scope.user);
      AuthService.signup($scope.user.signUpUsername, $scope.user.signUpPassword)
      .then(function(user){
        AuthService.setAuthenticated(user);
        console.log('signed up:', user);
        $scope.$emit('logged_in')
        console.log('current user is:', AuthService.currentUser);
        $rootScope.intendedDestination = $rootScope.intendedDestination || '/clippings';
        console.log('$rootScope.intendedDestination, just before redirect:', $rootScope.intendedDestination);
        $location.path($rootScope.intendedDestination);
      }, function(err) {
        console.log('error signing up:', err);
        $scope.user.error = err;
      });
    } else {
      alert("The provided passwords don't match.");
    }
  };
});
