'use strict';

angular.module('caracolApp.controllers')
.controller('ClippingsCtrl', function($rootScope, $scope, storage, ClippingsService, VoteService) {
  $rootScope.active = [true, false];
  $scope.loadClippings = function() {
    console.log('loadClippings firing');
    if (ClippingsService.timeOfLastFetch) {
      console.log('using already loaded clippings');
      $scope.clippings = ClippingsService.currentClippings;
    } else {
      console.log('need to fetch clippings from db');
      // ClippingsService.getClippings(storage.get('clippings'+storage.get('caracolID'))[0])
      ClippingsService.getClippings()
      .then(function(clippings) {
        $scope.clippings = clippings;
      });
    }
  };
  $scope.loadClippings();
});
