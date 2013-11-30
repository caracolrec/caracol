var services = angular.module('app.services', []);
services.factory('VoteService', function($q, $http) {
  var service = {
    vote: function(user, url, status){
      var d = $q.defer();
      $http.post('/vote', {
        user_id: user,
        url: url,
        status: status
      }).success(function(data){
        d.resolve(data);
      }).error(function(data){
        d.reject(data);
      });
      return d.promise;
    }
  };
  return service;
});
