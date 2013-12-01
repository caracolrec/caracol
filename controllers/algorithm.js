var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

exports.removeHTMLAndTokenize = function(clippingId) {
  client.invoke("remove_html_and_tokenize_clipping_content", clippingId, function(error, res, more) {
      console.log(res);
  });  
};
