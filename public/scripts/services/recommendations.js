angular.module('caracolApp.services')
.factory('RecsService', ['$q', '$http', function($q, $http) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    currentRecs: [],
    getRecs: function() {
      var d = $q.defer();
      $http.get('/fetchRecommendations', {comparator: 'rank'})
      .success(function(data, status) {
        service.timeOfLastFetch = new Date().getTime();
        console.log('success getting recs, they look like:', data);
        service.currentRecs = service.currentRecs.concat(data);
        d.resolve(service.currentRecs);
      })
      .error(function(reason, status) {
        console.log('error getting recs:', reason);
        d.reject(reason);
      });
      return d.promise;
    }
  };

  return service;
}]);