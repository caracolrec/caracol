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
      req = new XMLHttpRequest();
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
  
  $('body').prepend('<div class="caracolContainer" style="position:fixed;height:0px;z-index:99999"><iframe class="frame" src="//caracol.cloudapp.net/script" style="background:transparent;position:absolute; z-index:999999;left:10px;height:115px;border: 4px solid rgb(153, 30, 35);border-radius:15px;box-shadow: -2px -2px 2px 2px rgb(220,196,28);"></iframe></div>');
  

  req.open('POST', route, true);
  req.setRequestHeader('Content-Type', 'application/JSON');
  req.send(data);
})();
