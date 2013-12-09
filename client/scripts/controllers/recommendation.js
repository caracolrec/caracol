controllers.controller('RecCtrl', function($scope, LoginService, RecService, $rootScope){
  $rootScope.active = [false, true];

  var afterGottenRecs = function(recs) {
    var batchSize = RecService.batchSize;
    $scope.recs = recs.slice(($scope.page - 1) * batchSize, $scope.page * batchSize);
    window.scrollTo(0);
    if ($scope.page === 1) {
      $scope.prevDisabled = true;
    } else {
      $scope.prevDisabled = false;
    }
    if ($scope.page * batchSize >= recs.length) {
      $scope.nextDisabled = true;
    } else {
      $scope.nextDisabled = false;
    }
  };

  $scope.loadRecs = function() {
    RecService.getRecs()
    .then(function() {});
  };

  $scope.loadRecs();

});
