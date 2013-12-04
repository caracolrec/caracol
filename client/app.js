//angular app

var app = angular.module('app', ['angularLocalStorage',
                                 'app.controllers',
                                 'app.services',
                                 'app.directives'
                                 ]);

app.run(function($q, $http, $rootScope, UploadService,storage){
  var url = (window.location !== window.parent.location) ? document.referrer: document.location;
  var uri = encodeURIComponent(url);
  var user_id = storage.get('caracolID');

  UploadService.sendToURI(uri, user_id)
  .then(function(data){

    //sets up local storage id
    if (!storage.get('clippings'+user_id)){
      storage.set('clippings'+user_id, [data]);
    } else {
      var clippingsArr = storage.get('clippings'+user_id);
      var url = (window.location !== window.parent.location) ? document.referrer: document.location;
      clippingsArr.push({url: url, clipping_id: Number(data)});
      storage.set('clippings'+user_id, clippingsArr);
    }
    console.log('clipping ids from storage', storage.get('clippings'+user_id));
  });
});
