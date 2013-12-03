//angular app

var app = angular.module('app', ['angularLocalStorage',
                                 'app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);

app.run(function($q, $http, $rootScope, UploadService,storage){
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  console.log('ok');
  UploadService.sendToURI(uri)
  .then(function(data){

    //sets up local storage id
    var userID = storage.get('caracolID');
    if (!storage.get('clippings'+userID)){
      storage.set('clippings'+userID, [data]);
    } else {
      var clippingsArr = storage.get('clippings'+userID);
      clippingsArr.push(data);
      storage.set('clippings'+userID, clippingsArr);
    }
    console.log('clipping ids from storage', storage.get('clippings'+userID));
    $rootScope.clipping_id = data;
  });
});
