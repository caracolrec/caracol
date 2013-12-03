angular.module('caracolApp.controllers')
.controller('AuthCtrl', function($scope, AuthService) {
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    AuthService.login($scope.user.signin);
    $scope.signedIn = true;
    console.log('logging in');
  };

  $scope.createNewUser = function(){
    AuthService.signup($scope.user.signUp);
    console.log('creating new');
    $scope.signedIn = true;
  };
});
