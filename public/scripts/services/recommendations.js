angular.module('caracolApp.services')
.factory('RecsService', ['$q', 'FetchService', function($q, FetchService) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentRecs: [],
    lastRecId: 0,
    batchSize: 10,
    getRecs: function(currentPage) {
      var requestSize;
      if (service.timeOfLastFetch) {
        if (currentPage <= service.maxPageVisited) {
          console.log('using already loaded recs');
          var d = $q.defer();
          d.resolve(service.currentRecs);
          return d.promise;
        } else {
          console.log('need to fetch recs from db');
          requestSize = service.batchSize;
        }
      } else {
        console.log('need to fetch recs from db for the first time');
        requestSize = service.batchSize + 1;
      }
      return FetchService.fetch('recs', service.lastRecId, requestSize)
        .then(function(data) {
          service.updateState(data);
        });
    },
    updateState: function(recs) {
      service.timeOfLastFetch = new Date().getTime();
      service.currentRecs = service.currentRecs.concat(recs);
      if (service.currentRecs.length) {
        service.lastRecId = service.currentRecs[service.currentRecs.length - 1].id;
      }
      console.log('lastId after getting latest batch of recs:', service.lastRecId);
      service.maxPageVisited += 1;
    }
  };

  return service;
}]);