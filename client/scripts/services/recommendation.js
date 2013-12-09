services.factory('RecService', function($q, $http, FetchService) {
  var service = {
        // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentRecs: [],
    lastRecId: 0,
    batchSize: 1,

    getRecs: function() {
      var requestSize;
      console.log('need to fetch recs from db for the first time');
      requestSize = service.batchSize + 1;
      return FetchService.fetch('recs', service.lastRecId, requestSize)
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
