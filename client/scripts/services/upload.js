services.factory('UploadService', function($q, $http){
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
