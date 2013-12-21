controllers.controller('LoginCtrl', function($scope, $location, $rootScope, UploadService, LoginService){
  $scope.user = {};
  $scope.signedIn = false;

  $scope.login = function(){
    LoginService.login($scope.user.loginUser, $scope.user.loginPassword)
    .then(function(user){
      LoginService.setAuthenticated(user);
      UploadService.sendURI(UploadService.uri).then(function(data){
        console.log('Sent uri after login', data);
        $location.path('/vote');
      }, function(err){
        console.log('Failed to send uri after login', err);
      });
      $scope.$emit('logged_in', user.username);
      console.log('current user is:', LoginService.currentUser);
    }, function(err) {
      console.log('error logging in:', err);
      //TODO add error message on bookmarklet
      $scope.user.error = err;
    });
  };
});
