angular.module('caracolApp.controllers')
.controller('AuthCtrl', function($scope, AuthService, storage) {
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    AuthService.login($scope.user.signin)
    .then(function(data){
      console.log('loggin in', data);
      storage.set('caracolID', data.user_id);
    });
    $scope.signedIn = true;
  };

  $scope.createNewUser = function(){
    AuthService.signup($scope.user.signUp)
    .then(function(data){
      storage.set('caracolID', data.id);
      console.log('created username', data.id);
    });
    $scope.signedIn = true;
  };
});
