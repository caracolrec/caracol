angular.module('caracolApp.services')
.factory('RecsService', ['$q', '$http', function($q, $http) {
  var service = {
    // store oauth token in here
    maxPage: 0,
    timeOfLastFetch: null,
    currentRecs: [],
    worstRecRank: 0,
    getRecs: function(worstRecRank) {
      worstRecRank = worstRecRank || 0;
      var d = $q.defer();
      $http.get('/fetchRecommendations', {
        params: {
          user_id: 1, // change this later
          worstRecRank: worstRecRank
        }
      })
      .success(function(data, status) {
        service.timeOfLastFetch = new Date().getTime();
        console.log('success getting recs, they look like:', data);
        for (var i = 0; i < data.length; i++) {
          data[i].clipping.content_sans_html = data[i].clipping.content_sans_html || '';
          data[i].displayedExcerpt = data[i].clipping.content_sans_html.slice(0,250) + ' ...';
        }
        service.currentRecs = service.currentRecs.concat(data);
        service.worstRecRank = service.currentRecs[service.currentRecs.length - 1].id;
        console.log('worstRecRank after getting batch of clippings is:', service.worstRecRank);
        service.maxPage += 1;
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