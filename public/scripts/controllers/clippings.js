'use strict';

angular.module('caracolApp.controllers')
.controller('ClippingsCtrl', function($rootScope, $scope, storage, ClippingsService, VoteService) {
  $rootScope.active = [true, false];
  $scope.loadClippings = function(page) {
    console.log('loadClippings firing');
    $scope.page = page || 1;
    if (ClippingsService.timeOfLastFetch && $scope.page <= ClippingsService.maxPage) {
      console.log('using already loaded clippings');
      $scope.clippings = ClippingsService.currentClippings.slice(($scope.page - 1) * 10, $scope.page * 10);
      window.scrollTo(0);
    } else {
      console.log('need to fetch clippings from db');
      ClippingsService.getClippings(ClippingsService.oldestClippingId)
      .then(function(clippings) {
        $scope.clippings = clippings.slice(($scope.page - 1) * 10, $scope.page * 10);
        window.scrollTo(0);
      });
    }
  };
  $scope.loadClippings();
});
