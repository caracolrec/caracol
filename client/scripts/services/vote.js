services.factory('VoteService', function($q, $http) {
  var service = {
    vote: function(vote, uri){
      var d = $q.defer();
      $http.post('/vote/'+uri, {
        vote: vote
      }, {
        withCredentials: true
      }).success(function(data){
        d.resolve(data);
      }).error(function(data){
        console.log('vote posting error', data);
        d.reject(data);
      });
      return d.promise;
    }
  };
  return service;
});
