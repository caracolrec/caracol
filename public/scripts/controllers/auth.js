angular.module('caracolApp.controllers')
.controller('LoginCtrl', function($scope, $location, AuthService, storage) {
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    AuthService.login($scope.user.loginUser, $scope.user.userPassword)
    .then(function(data){
      AuthService.setAuthenticated(data.user_id);
      console.log('loggin in', data);
      storage.set('caracolID', data.user_id);
    }, function(err) {
      console.log('error logging in:', err);
      $scope.user.error = err;
    });
  };

  $scope.logout = function() {
    
  }

  $scope.signup = function() {
    AuthService.signup($scope.user.loginUser, $scope.user.userPassword)
    .then(function(data){
      AuthService.setAuthenticated(data.user_id);
      console.log('signed up:', data);
    }, function(err) {
      console.log('error signing up:', err);
      $scope.user.error = err;
    })
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
