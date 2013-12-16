var zerorpc = require("zerorpc");
var pyserver =  require("../config/python.json");

var client = new zerorpc.Client();
client.connect("tcp://" + pyserver.host + ":" + pyserver.port);

exports.removeHTMLAndTokenize = removeHTMLAndTokenize = function(clippingId, callback) {
  client.invoke("remove_html_and_tokenize_clipping_content", clippingId, function(error, res, more) {
    console.log(res);
    callback(error, res);
  });
};
