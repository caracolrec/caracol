controllers.controller('RecCtrl', function($scope, LoginService, RecService, $rootScope){

  var afterGottenRecs = function(recs) {
    $scope.recs = recs;
  };

  $scope.loadRecs = function() {
    RecService.getRecs()
    .then(function(data) {
      $scope.recs = data;
      console.log('grabbed recs', data);
    });
  };

  $scope.loadRecs();

});
