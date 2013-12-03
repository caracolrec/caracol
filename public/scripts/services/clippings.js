angular.module('caracolApp.services')
.factory('ClippingsService', ['$q', '$http', function($q, $http) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    currentClippings: [],
    oldestClippingId: 0,
    getClippings: function(oldestClippingId) {
      oldestClippingId = oldestClippingId || null;
      var d = $q.defer();
      $http.get('/fetchMyClippings', {
        params: {oldestClippingId: oldestClippingId}
      })
      .success(function(data, status) {
        service.timeOfLastFetch = new Date().getTime();
        console.log('success getting clippings, they look like:', data);
        for (var i = 0; i < data.length; i++) {
          data[i].content_sans_html = data[i].content_sans_html || '';
          data[i].displayedExcerpt = data[i].content_sans_html.slice(0,250) + ' ...';
        }
        service.currentClippings = service.currentClippings.concat(data);
        service.oldestClippingId = service.currentClippings[service.currentClippings.length - 1].id;
        console.log('oldestClippingId after getting batch of clippings is:', service.oldestClippingId);
        d.resolve(service.currentClippings);
      })
      .error(function(reason, status) {
        console.log('error getting old clippings:', reason);
        d.reject(reason);
      });
      return d.promise;
    }
  };

  return service;
}]);