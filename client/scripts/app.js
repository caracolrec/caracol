//angular app

var app = angular.module('app', ['app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);

app.run(function($q, $http, $rootScope, UploadService,storage){
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  var user_id = storage.get('caracolID');
  $rootScope.hide = false;
  UploadService.sendURI(uri)
  .then(function(data){
    console.log('saved clipping to db, id:', data);
  }, function(data){
    console.log('failed to save clipping to db', data);
  });
});
