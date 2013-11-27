//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var knex = require('./dbsetup.js').knex;

module.exports.dbInsert = function(json){
  var ids = [];  // return all 
  ids = knex('clippins').insert({json.uri, json.title, json.content});   //where('id', 1).select().then(...
  return ids;
}

