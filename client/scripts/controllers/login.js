controllers.controller('LoginCtrl', function($scope, LoginService, $rootScope){
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    LoginService.login($scope.user.loginUser, $scope.user.loginPassword)
    .then(function(user){
      LoginService.setAuthenticated(user);
      $scope.$emit('logged_in', user.username);
      console.log('current user is:', LoginService.currentUser);
      $location.path('/vote');
    }, function(err) {
      console.log('error logging in:', err);
      $scope.user.error = err;
    });
  };
});
