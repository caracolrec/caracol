'use strict';

angular.module('caracolApp.controllers')
.controller('ClippingsCtrl', function($rootScope, $scope, storage, ClippingsService, VoteService) {
  $rootScope.active = [true, false];
  $scope.loadClippings = function(page) {
    console.log('loadClippings firing');
    $scope.page = page || 1;
    if (ClippingsService.timeOfLastFetch) {
      if ($scope.page <= ClippingsService.maxPageVisited) {
        console.log('using already loaded clippings');
        $scope.clippings = ClippingsService.currentClippings.slice(($scope.page - 1) * ClippingsService.batchSize, $scope.page * ClippingsService.batchSize);
        window.scrollTo(0);
      } else {
        console.log('need to fetch clippings from db');
        ClippingsService.getClippings(ClippingsService.oldestClippingId, ClippingsService.batchSize)
        .then(function(clippings) {
          $scope.clippings = clippings.slice(($scope.page - 1) * ClippingsService.batchSize, $scope.page * ClippingsService.batchSize);
          window.scrollTo(0);
        });
      }
    } else {
      console.log('need to fetch clippings from db');
      ClippingsService.getClippings(ClippingsService.oldestClippingId, ClippingsService.batchSize + 1)
      .then(function(clippings) {
        $scope.clippings = clippings.slice(($scope.page - 1) * ClippingsService.batchSize, $scope.page * ClippingsService.batchSize);
        window.scrollTo(0);
      });
    }
    if ($scope.page === 1) {
      $scope.prevDisabled = true;
    } else {
      $scope.prevDisabled = false;
    }
    if ($scope.page * ClippingsService.batchSize >= ClippingsService.currentClippings.length) {
      $scope.nextDisabled = true;
    } else {
      $scope.nextDisabled = false;
    }
  };
  $scope.loadClippings();
});
