//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');
var algorithm = require('../controllers/algorithm.js');
var _ = require('underscore');

exports.dbInsert = dbInsert = function(json, callback){
  new tables.Clipping({title: json.title, content: json.content, uri: json.url, word_count: json.word_count})
  .save()
  .then(function(model) {
    console.log('finished saving the clipping');
    callback(null, model.id);
    algorithm.removeHTMLAndTokenize(model.id);
  }, function(){
    console.log('Error saving the clipping');
    callback(error);
  });
};

exports.fetchClippings = fetchClippings = function(fetchClippingsOlderThanThisClippingId, callback) {
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

exports.fetchRecommendations = fetchRecommendations = function(callback) {
  new tables.Recommendations()
  .fetch({ withRelated: ['clipping'] })
  .then(function(results) {
    console.log('results of db query look like:',results);
    callback(null, results);
  }, function(error) {
    console.log('error fetching recs from the db:', error);
    callback(error);
  });
};
