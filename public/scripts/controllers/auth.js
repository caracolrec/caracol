angular.module('caracolApp.controllers')
.controller('AuthCtrl', function($scope, AuthService) {
  $scope.user = {};
  $scope.signedIn = false;
  $scope.createNewUser = function(){
    AuthService.signup($scope.user.signin);
    console.log('creating new');
    $scope.signedIn = true;
  };

  $scope.login = function(){
    AuthService.login($scope.user.signUp);
    $scope.signedIn = true;
    console.log('logging in');
  };
});
