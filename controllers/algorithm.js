var zerorpc = require("zerorpc");
var pythonServer = require('../config/python.json');

var client = new zerorpc.Client();
client.connect("tcp://" + pythonServer.host + ":4242");
console.log('pythonServer is:', pythonServer.host);

exports.processNewArticle = processNewArticle = function(clippingId, userId) {
//exports.removeHTMLAndTokenize = removeHTMLAndTokenize = function(clippingId) {
  console.log('invoking process_new_article via ZeroRPC');
  client.invoke("process_new_article", clippingId, userId, function(error, res, more) {
      if (error) {
        console.log('error calling Python via zeroRPC:', error);
      }
      console.log(res);
  });  
};



// ASK IAN: why callback passed in as 3rd argument to above?


// exports.removeHTMLAndTokenize = removeHTMLAndTokenize = function(clippingId) {
//   client.invoke("remove_html_and_tokenize_clipping_content", clippingId, function(error, res, more) {
//       console.log(res);
//   });  
// };


// tokenizedClippings = [];
// first_tokenized = 107 ;
// last_tokenized =  165 ;
// for(clippingId = first_tokenized; clippingId <= last_tokenized; clippingId++){
//   tokenizedClippings.push(removeHTMLAndTokenize(clippingId));
// }; 

// console.log(tokenizedClippings);
