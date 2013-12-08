'use strict';

angular.module('caracolApp.controllers')
.controller('NavCtrl', function($rootScope, $scope, AuthService) {
  $rootScope.active = [false, false];
  $scope.loggedIn = AuthService.isAuthenticated() || false;

  $scope.logout = function(){
    AuthService.logout()
    .then(function(data){
      console.log('successful logout', data);
    }, function(err){
      console.log('failed logout', err);
    });
  };
});