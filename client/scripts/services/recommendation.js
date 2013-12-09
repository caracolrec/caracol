services.factory('RecService', function($q, $http, FetchService) {
  var service = {
        // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentRecs: [],
    lastRecId: 0,
    batchSize: 1,

    getRecs: function() {
      return FetchService.fetch('recs', 0, 3)
        .then(function(data) {
          service.updateState(data);
        });
    },

    updateState: function(recs) {
      service.timeOfLastFetch = new Date().getTime();
      service.currentRecs = service.currentRecs.concat(recs);
      service.lastRecId = service.currentRecs[service.currentRecs.length - 1].id;
      console.log('lastId after getting latest batch of recs:', service.lastRecId);
      service.maxPageVisited += 1;
    }
  };
  return service;
});
