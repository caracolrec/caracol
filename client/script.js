/* bookmarklet will inject a script that loads this page
** need a route in the server for the script tag url
*/

(function() {
  
  $('body').prepend('<div class="caracolContainer" style="position:fixed;height:0px;z-index:99999"><iframe class="frame" src="//caracol.cloudapp.net/script" style="background:transparent;position:absolute; z-index:999999;left:10px;height:115px;border: 4px solid rgb(153, 30, 35);border-radius:15px;box-shadow: -2px -2px 2px 2px rgb(220,196,28);"></iframe></div>');
  
})();
