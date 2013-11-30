/* bookmarklet will inject a script that loads this page
** need a route in the server for the script tag url
*/

(function() {
  var route;
  var d = document,
      l = d.location,
      t = window.getSelection,
      k = d.getSelection,
      x = d.selection,
      s = String(t ? t(): (k)? k(): (x ? x.createRange().text : '')),
      e = encodeURIComponent,
    req = new XMLHttpRequest(),
   data = JSON.stringify({
    uri: l.href,
    title: d.title,
    clipping: s,
   });
   var encodedURI = encodeURIComponent(data.uri);
  //must manually toggle for deployment
  //TODO there's gotta be a beter way
  //add a listener

  // route = '//localhost:3000/uri';
  route = '//caracol.cloudapp.net/uri';

  $('body').prepend('<div style="position:fixed;height:0px;width: 100%;top: 0px;z-index: 9999"><iframe class="frame" src="//caracol.cloudapp.net/script" style="left:10%;position:absolute;height:115px;width:235px"></iframe></div>');
  // $('body').prepend('<div style="position:fixed;height:0px;width: 100%;top: 0px;z-index: 9999"><iframe class="frame" src="//localhost:3000/script" style="left:10%;position:absolute;height:115px;width:235px"></iframe></div>');
  
  $.post(route, data).done(function(){
    console.log('finished');
  });
})();
