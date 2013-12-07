angular.module('caracolApp.controllers')
.controller('LoginCtrl', function($rootScope, $scope, $location, AuthService, storage) {
  $rootScope.active = [false, false];
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    AuthService.login($scope.user.loginUser, $scope.user.loginPassword)
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
