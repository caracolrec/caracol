//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');
var algorithm = require('../controllers/algorithm.js');
var _ = require('underscore');

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
