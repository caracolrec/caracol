var request = require('superagent');

exports.parser = function(params, cb){
  request
    .get('https://www.readability.com/api/content/v1/parser?url=' + params.url + '&token=' + params.token)
    .end(function(error, response){
      if(error){
        console.log('parser request error ', error);
      } else {
        cb(response);
      }
    });
};