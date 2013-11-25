//function called if not logged in...
(function() {
  var d = document,
  l = d.location,
  t = window.getSelection,
  k = d.getSelection,
  x = d.selection,
  s = String(t ? t(): (k)? k(): (x ? x.createRange().text : '')),
  e = encodeURIComponent;
  window.location.href = ("http://www.instapaper.com/hello2" 
                         + "?u=" + e(l.href) 
                         + '&t=' + e(d.title) 
                         + '&s=' + e(s)
                         + "&cookie_notice=1");
})();