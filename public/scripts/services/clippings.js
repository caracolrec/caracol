angular.module('caracolApp.services')
.factory('ClippingsService', ['$q', '$http', 'FetchService', function($q, $http, FetchService) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentClippings: [],
    oldestClippingId: 0,
    batchSize: 10,
    getClippings: function(currentPage) {
      if (service.timeOfLastFetch) {
        if (currentPage <= service.maxPageVisited) {
          console.log('using already loaded clippings');
          var d = $q.defer();
          d.resolve(service.currentClippings);
          return d.promise;
        } else {
          console.log('need to fetch clippings from db');
          var requestSize = service.batchSize;
        }
      } else {
        console.log('need to fetch clippings from db for the first time');
        var requestSize = service.batchSize + 1;
      }
      return FetchService.fetch('clippings', service.oldestClippingId, requestSize)
        .then(function(data) {
          service.updateState(data);
        });
    },
    updateState: function(clippings) {
      service.timeOfLastFetch = new Date().getTime();
      service.currentClippings = service.currentClippings.concat(clippings);
      service.oldestClippingId = service.currentClippings[service.currentClippings.length - 1].id;
      console.log('lastId after getting latest batch of clippings:', service.oldestClippingId);
      service.maxPageVisited += 1;
    }
  };

  return service;
}]);