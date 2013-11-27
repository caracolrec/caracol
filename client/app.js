/* bookmarklet will inject a script that loads this page
** need a route in the server for the script tag url
*/

(function() {
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
    clipping: s
   });
  console.log("party");
  setTimeout(function(){
    console.log("time");
  }, 1500);
  req.open('POST', '//caracol.azurewebsites.net', true);
  req.setRequestHeader('Content-Type', 'application/JSON');
  req.send(data);
})();
