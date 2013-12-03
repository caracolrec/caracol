//angular app

var app = angular.module('app', ['app.controllers',
                                 'app.services',
                                 'app.directives',
                                 ]);

app.run(function($q, $http, UploadService){
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  console.log('ok');
  UploadService.sendToURI(uri);
});
