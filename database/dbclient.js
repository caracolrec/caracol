//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');



exports.dbInsert = dbInsert = function(json){
  new tables.Clipping({title: json.title, content: json.content, uri: json.url, word_count: json.word_count})
  .save()
  .then(function() {
    console.log('finished saving the clipping');
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
  new tables.User_Clipping({vote: json.vote})
  .save()
  .then(function(){
    console.log('finished saving the vote');
  }, function(){
    console.log('there was an error saving the vote');
  });
};
