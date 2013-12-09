/* bookmarklet will inject a script that loads this page
** need a route in the server for the script tag url
*/

(function() {
  if ($('.caracolBookmarklet')[0]) {
    //change hide value to false
    $('.caracolBookmarklet').remove();
    $('body').prepend('<div class="caracolBookmarklet"' +
    'style="position:fixed;height:0px;width: 100%;' +
    'z-index:99999;margin:0;padding:0"><iframe class="frame" ' +
    'src="//caracol.cloudapp.net/script" ' +
    'style="background: transparent;position:absolute;' +
    'z-index:999999;width:100%;height:9.8em;' +
    'border:2px #ffeed8;border-radius:5px;margin:0;padding:0">' +
    '</iframe></div>');
  } else if (window.location.hostname !== 'caracol.cloudapp.net'){
    $('body').prepend('<div class="caracolBookmarklet"' +
    'style="position:fixed;height:0px;width: 100%;' +
    'z-index:99999;margin:0;padding:0"><iframe class="frame" ' +
    'src="//caracol.cloudapp.net/script" ' +
    'style="background: transparent;position:absolute;' +
    'z-index:999999;width:100%;height:9.8em;' +
    'border:2px #ffeed8;border-radius:5px;margin:0;padding:0">' +
    '</iframe></div>');
  }

})();
