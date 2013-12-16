'use strict';

angular.module('caracolApp.services')
.factory('ClippingsService', ['$q', 'FetchService', function($q, FetchService) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentClippings: [],
    lastClippingId: 0,
    batchSize: 10,
    getClippings: function(currentPage) {
      var requestSize;
      if (service.timeOfLastFetch) {
        if (currentPage <= service.maxPageVisited) {
          console.log('using already loaded clippings');
          var d = $q.defer();
          d.resolve(service.currentClippings);
          return d.promise;
        } else {
          console.log('need to fetch clippings from db');
          requestSize = service.batchSize;
        }
      } else {
        console.log('need to fetch clippings from db for the first time');
        requestSize = service.batchSize + 1;
      }
      return FetchService.fetch('clippings', service.lastClippingId, requestSize)
        .then(function(data) {
          service.updateState(data);
        });
    },
    updateState: function(clippings) {
      service.timeOfLastFetch = new Date().getTime();
      service.currentClippings = service.currentClippings.concat(clippings);
      if (service.currentClippings.length) {
        service.lastClippingId = service.currentClippings[service.currentClippings.length - 1].id;
      }
      console.log('lastId after getting latest batch of clippings:', service.lastClippingId);
      service.maxPageVisited += 1;
    }
  };

  return service;
}]);