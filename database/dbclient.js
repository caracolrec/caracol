//dbclient.js

var express = require('express');
var caracolPG = require('./dbsetup.js').caracolPG;
var caracolKnex = require('./dbsetup.js').caracolKnex;


var dbInsert = function(json){


}

caracolKnex('clippins').insert()   //where('id', 1).select().then(...