var zerorpc = require("zerorpc");

var client = new zerorpc.Client();

exports.helloWorld = function() {
  client.connect("tcp://127.0.0.1:4242");

  client.invoke("hello", "Michael", function(error, res, more) {
      console.log(res);
  });  
};
