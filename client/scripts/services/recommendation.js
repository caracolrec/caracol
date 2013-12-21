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
    }
  };
  return service;
});
