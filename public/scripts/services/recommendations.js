angular.module('caracolApp.services')
.factory('RecsService', ['$q', '$http', 'FetchService', function($q, $http, FetchService) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentRecs: [],
    oldestRecId: 0,
    batchSize: 10,
    getRecs: function(currentPage) {
      if (service.timeOfLastFetch) {
        if (currentPage <= service.maxPageVisited) {
          console.log('using already loaded recs');
          var d = $q.defer();
          d.resolve(service.currentRecs);
          return d.promise;
        } else {
          console.log('need to fetch recs from db');
          var requestSize = service.batchSize;
        }
      } else {
        console.log('need to fetch recs from db for the first time');
        var requestSize = service.batchSize + 1;
      }
      return FetchService.fetch('recs', service.oldestRecId, requestSize)
        .then(function(data) {
          service.updateState(data);
        });
    },
    updateState: function(recs) {
      service.timeOfLastFetch = new Date().getTime();
      service.currentRecs = service.currentRecs.concat(recs);
      service.oldestRecId = service.currentRecs[service.currentRecs.length - 1].id;
      console.log('lastId after getting latest batch of recs:', service.oldestRecId);
      service.maxPageVisited += 1;
    }
  };

  return service;
}]);