'use strict';

angular.module('caracolApp.controllers')
.controller('ClippingsCtrl', function($rootScope, $scope, storage, ClippingsService, VoteService, FetchService) {
  $rootScope.active = [true, false];

  var afterGottenClippings = function(clippings) {
    var batchSize = ClippingsService.batchSize;
    $scope.clippings = clippings.slice(($scope.page - 1) * batchSize, $scope.page * batchSize);
    window.scrollTo(0);
    if ($scope.page === 1) {
      $scope.prevDisabled = true;
    } else {
      $scope.prevDisabled = false;
    }
    if ($scope.page * batchSize >= clippings.length) {
      $scope.nextDisabled = true;
    } else {
      $scope.nextDisabled = false;
    }
  };

  $scope.loadClippings = function(page) {
    page = page || 1;
    $scope.page = page;
    ClippingsService.getClippings(page)
    .then(function() {
      afterGottenClippings(ClippingsService.currentClippings);
    });
  };

  $scope.loadClippings();
});
