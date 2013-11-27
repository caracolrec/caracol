//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = caracolPG.knex; // require('./dbsetup.js').knex;
var tables = require('./dbschemas.js');



exports.dbInsert = dbInsert = function(json){

  new tables.Clipping({title: 'this is a test', content: 'whammy wowie zowie'})
  .save()
  .then(function() {
    console.log('finished saving the clipping');
  }, function(){
    console.log('Error saving the clipping')
  });

}

dbInsert();



