var services = angular.module('app.services', []);
services.factory('VoteService', function($q, $http) {
  var service = {
    vote: function(user, vote, clipping_id, bookmarkStatus, lastBookmarkTime, lastVoteTime){
      var d = $q.defer();
      $http.post('/vote', {
        vote: vote
        // clipping_id: clipping_id,
        // bookmarkStatus: bookmarkStatus,
        // lastBookmarkTime: lastBookmarkTime,
        // lastVoteTime: lastVoteTime
      }).success(function(data){
        d.resolve(data);
      }).error(function(data){
        console.log('posting error', data);
        d.reject(data);
      });
      return d.promise;
    }
  };
  return service;
});
