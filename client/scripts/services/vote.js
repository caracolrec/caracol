services.factory('VoteService', function($q, $http) {
  var service = {
    vote: function(user_id, vote, clipping_id){
      var d = $q.defer();
      $http.post('/vote/'+clipping_id, {
        vote: vote,
        user_id: user_id,
        clipping_id: clipping_id
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
