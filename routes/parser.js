var request = require('superagent');
var dbClient = require('../database/dbclient.js');

exports.parser = function(params, callback){
  request
    .get('https://www.readability.com/api/content/v1/parser?url=' + params.url + '&token=' + params.token)
    .end(function(error, response){
      if(error){
        console.log('parser request error ', error);
      } else {
        return response;
      }
    });
};

