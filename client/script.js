/* bookmarklet will inject a script that loads this page
** need a route in the server for the script tag url
*/

(function() {

  $('body').prepend('<div class="caracolContainer" style="position:fixed;height:0px;z-index:99999"><iframe class="frame" src="//localhost:3000/script" style="background:transparent;position:absolute; z-index:999999;left:10px;height:115px;border: 1px #ffeed8;border-radius:5px;"></iframe></div>');

})();
