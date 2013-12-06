angular.module('caracolApp.controllers')
.controller('AuthCtrl', function($scope, AuthService, storage) {
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    AuthService.login($scope.user.loginUser, $scope.user.userPassword)
    .then(function(data){
      console.log('loggin in', data);
      storage.set('caracolID', data.user_id);
    });
    $scope.signedIn = true;
  };

  $scope.createNewUser = function(){
    AuthService.signup($scope.user.username, $scope.user.password)
    .then(function(data){
      storage.set('caracolID', data.id);
      console.log('created username', data.id);
    });
    $scope.signedIn = true;
  };
});
