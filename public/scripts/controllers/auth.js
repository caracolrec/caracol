angular.module('caracolApp.controllers')
.controller('LoginCtrl', function($rootScope, $scope, $location, AuthService) {
  $rootScope.active = [false, false];
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    AuthService.login($scope.user.loginUser, $scope.user.loginPassword)
    .then(function(data){
      AuthService.setAuthenticated(data.user_id);
      console.log('loggin in', data);
    }, function(err) {
      console.log('error logging in:', err);
      $scope.user.error = err;
    });
  };

  $scope.logout = function() {
    AuthService.logout()
    .then(function(data){
      console.log('sucessfully logged out');
    }, function(data){
      console.log('failed to logout');
    });
  };

  $scope.signup = function() {
    console.log('$scope.user before signup attempt:', $scope.user);
    AuthService.signup($scope.user.signUpUsername, $scope.user.signUpPassword)
    .then(function(data){
      AuthService.setAuthenticated(data.id);
      console.log('signed up:', data);
      $location.path('#/clippings');
      console.log('current user is:', AuthService.currentUser);
    }, function(err) {
      console.log('error signing up:', err);
      $scope.user.error = err;
    });
  };

  $scope.createNewUser = function(){
    AuthService.signup($scope.user.username, $scope.user.password)
    .then(function(data){
      console.log('created username', data.id);
    }, function(err){
      console.log('error creating user', error);
    });
    $scope.signedIn = true;
  };
});
