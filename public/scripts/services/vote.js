angular.module('caracolApp.services')
.factory('VoteService', ['$q', '$http', function($q, $http) {
  var service = {
    vote: function(clipping, vote) {
      var d = $q.defer();
      $http({method: 'POST', url: '/vote', data: {id: clipping.id, vote: vote}})
      .success(function(data) {
        console.log('success sending vote', vote, 'on clipping', clipping.id);
        d.resolve(data);
      })
      .error(function(reason) {
        console.log('error sending vote', vote, 'on clipping', clipping.id);
        d.reject(reason);
      });
      return d.promise;
    }
  };

  return service;
}]);