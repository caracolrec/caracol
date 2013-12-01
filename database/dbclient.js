//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');
var algorithm = require('../controllers/algorithm.js');

exports.dbInsert = dbInsert = function(json){
  new tables.Clipping({title: json.title, content: json.content, uri: json.url, word_count: json.word_count})
  .save()
  .then(function(model) {
    console.log('finished saving the clipping');
    algorithm.removeHTMLAndTokenize(model.id);
  }, function(){
    console.log('Error saving the clipping');
  });

};

exports.dbFetch = dbFetch = function(fetchClippingsOlderThanThisClippingId, callback) {
  // not actually making use of fetchClippingsOlderThanThisClippingId yet
  new tables.Clippings()
  .fetch()
  .then(function(results) {
    console.log('successfully grabbed clippings from the db:', results);
    callback(null, results);
  }, function(error) {
    console.log('there was an error fetching clippings from the db:', error);
    callback(error);
  });
};


exports.dbVote = dbVote = function(json){
  console.log('called', json);
  new tables.User_Clipping({})
  .save()
  .then(function(){
    console.log('finished saving the vote');
  }, function(){
    console.log('there was an error saving the vote');
  });
};
