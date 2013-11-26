var express = require('express');
var Bookshelf  = require('bookshelf');
var Knex = require('knex');
var pg = require('pg');

module.exports.caracolPG = Bookshelf.initialize({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',    //need PORT here?
    //ALSO: note - need diff version for deployment (virtual machine?)
    user     : 'me',
    password : 'password',
    database : 'caracolDB',
    charset  : 'utf8'
  }
});

module.exports.caracolKnex = Knex.initialize({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'me',
    password : 'password',
    database : 'caracolDB',
    charset  : 'utf8'
  }
});