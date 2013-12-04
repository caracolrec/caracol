angular.module('caracolApp.services')
.factory('ClippingsService', ['$q', '$http', function($q, $http) {
  var service = {
    // store oauth token in here
    timeOfLastFetch: null,
    maxPageVisited: 0,
    currentClippings: [],
    oldestClippingId: 0,
    batchSize: 10,
    getClippings: function(oldestClippingId, batchSize) {
      oldestClippingId = oldestClippingId || 0;
      var d = $q.defer();
      $http.get('/fetchMyClippings', {
        params: {
          user_id: 1, // change this later
          oldestClippingId: oldestClippingId,
          batchSize: batchSize
        }
      })
      .success(function(data, status) {
        service.timeOfLastFetch = new Date().getTime();
        console.log('success getting clippings, they look like:', data);
        for (var i = 0; i < data.length; i++) {
          data[i].content_sans_html = data[i].content_sans_html || '';
          data[i].displayedExcerpt = data[i].content_sans_html.slice(0,250) + ' ...';
        }
        for (var i = 0; i < data.length; i++) {
          data[i].elegantDate = service.elegantizeTimestamp(data[i]);
        }
        service.currentClippings = service.currentClippings.concat(data);
        service.oldestClippingId = service.currentClippings[service.currentClippings.length - 1].id;
        console.log('oldestClippingId after getting batch of clippings is:', service.oldestClippingId);
        service.maxPageVisited += 1;
        d.resolve(service.currentClippings);
      })
      .error(function(reason, status) {
        console.log('error getting old clippings:', reason);
        d.reject(reason);
      });
      return d.promise;
    },
    elegantizeTimestamp: function(clipping) {
      var numMilliseconds = new Date().getTime() - Date.parse(clipping.first_insert); 
      var numSeconds = numMilliseconds/1000;
      var numMinutes = numSeconds/60;
      var numHours = numMinutes/60;
      var approx = '';
      if (numHours >= 24) {
        var month = postgresTimestamp.slice(5,7);
        var day = postgresTimestamp.slice(8,10);
        if (day[0] === '0') {
          day = day[1];
        }
        switch (month) {
          case '01':
            month = 'Jan';
            break;
          case '02':
            month = 'Feb';
            break;
          case '03':
            month = 'Mar';
            break;
          case '04':
            month = 'Apr';
            break;
          case '05':
            month = 'May';
            break;
          case '06':
            month = 'Jun';
            break;
          case '07':
            month = 'Jul';
            break;
          case '08':
            month = 'Aug';
            break;
          case '09':
            month = 'Sep';
            break;
          case '10':
            month = 'Oct';
            break;
          case '11':
            month = 'Nov';
            break;
          case '12':
            month = 'Dec';
            break;
        }
        return month + ' ' + day;
      } else {
        return 'today';
      }
    }
  };

  return service;
}]);