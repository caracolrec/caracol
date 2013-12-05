'use strict';

angular.module('caracolApp.controllers')
.controller('RecsCtrl', function($rootScope, $scope, RecsService) {
  $rootScope.active = [false, true];

  var afterGottenRecs = function(recs) {
    var batchSize = RecsService.batchSize;
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

  $scope.loadRecs = function(page) {
    page = page || 1;
    $scope.page = page;
    RecsService.getRecs(page)
    .then(function() {
      afterGottenRecs(RecsService.currentRecs);
    });
  };

  $scope.loadRecs();
});