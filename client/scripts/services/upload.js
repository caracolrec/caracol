services.factory('UploadService', function($q, $http){
  var service = {
    uri: null,
    sendURI: function(uri){
      service.uri = uri;
      var d = $q.defer();
      $http.post('/uri', {
        uri: uri
      }, {
        withCredentials: true
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
