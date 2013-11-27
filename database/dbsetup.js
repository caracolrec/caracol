var express = require('express');
var Bookshelf  = require('bookshelf');
var Knex = require('knex');
var pg = require('pg');
var credentials = require('./dbconfig.json');

module.exports.caracolPG = Bookshelf.initialize({
  client: 'pg',
  connection: {
    host     : credentials.host,    // when deploying on Azure, say 'credentials.localhost' here

    //need PORT here?
    //ALSO: note - need diff version for deployment (virtual machine?)
    user     : credentials.user,
    password : credentials.password,
    database : credentials.database,
    charset  : 'utf8'
  }
});

// module.exports.knex = Knex.initialize({
//   client: 'pg',
//   connection: {
//     host     : '127.0.0.1',
//     user     : 'me',
//     password : 'password',
//     database : 'caracolDB',
//     charset  : 'utf8'
//   }
// });