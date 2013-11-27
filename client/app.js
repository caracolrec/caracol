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
  //must manually toggle for deployment
  //TODO there's gotta be a beter way
  //add a listener
  route = '//localhost:3000/uri';
  //route = '//caracol.azurewebsites.net/uri';
  console.log("party");
  setTimeout(function(){
    console.log("time");
  }, 1500);
  document.body.appendChild('<div>whats up</div>');
  //do the original db query here;
  req.open('POST', route, true);
  req.setRequestHeader('Content-Type', 'application/JSON');
  req.send(data);
})();
