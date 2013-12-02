'use strict';

angular.module('caracolApp.controllers')
.controller('RecsCtrl', function($scope, RecsService) {
  $scope.loadRecs = function() {
    console.log('loadRecs firing');
    if (RecsService.timeOfLastFetch) {
      console.log('using already loaded recs');
      $scope.recs = RecsService.currentRecs;
    } else {
      console.log('need to fetch recs from db');
      RecsService.getRecs()
      .then(function(recs) {
        $scope.recs = recs;
      });
    }
  };

  $scope.loadRecs();
});