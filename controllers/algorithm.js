var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

exports.processNewArticle = processNewArticle = function(clippingId, userId) {
//exports.removeHTMLAndTokenize = removeHTMLAndTokenize = function(clippingId) {
  return client.invoke("process_new_article", clippingId, function(error, res, more) {
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