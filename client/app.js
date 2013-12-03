//angular app

var app = angular.module('app', ['app.controllers',
                                 'app.services',
                                 'app.directives',
                                 ]);

app.run(function($q, $http, $rootScope, UploadService){
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  console.log('ok');
  UploadService.sendToURI(uri)
  .then(function(data){
    //would love to find a better way
    $rootScope.clipping_id = data;
    console.log($rootScope.clipping_id);
  });
});
