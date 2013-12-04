'use strict';

angular.module('caracolApp.controllers')
.controller('RecsCtrl', function($rootScope, $scope, RecsService) {
  $rootScope.active = [false, true];
  $scope.loadRecs = function(page) {
    console.log('loadRecs firing');
    $scope.page = page || 1;
    if (RecsService.timeOfLastFetch && $scope.page <= RecsService.maxPage) {
      console.log('using already loaded recs');
      $scope.recs = RecsService.currentRecs.slice(($scope.page - 1) * 40, $scope.page * 40);
    } else {
      console.log('need to fetch recs from db');
      RecsService.getRecs(RecsService.worstRecRank)
      .then(function(recs) {
        $scope.recs = recs.slice(($scope.page - 1) * 40, $scope.page * 40);
      });
    }
  };

  $scope.loadRecs();
});