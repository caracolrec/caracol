var services = angular.module('app.services', []);
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
}).factory('UploadService', function($q, $http){
  var service = {
    sendToURI: function(uri, user_id){
      console.log(uri);
      var d = $q.defer();
      $http.post('/uri', {
        uri: uri,
        user_id: user_id
      }).success(function(data){
        d.resolve(data);
      }).error(function(data){
        d.reject(data);
        console.log('error parsing article', data);
      });
      return d.promise;
    }
  };
  return service;
});
