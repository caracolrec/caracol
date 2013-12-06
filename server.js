
/**
 * Module dependencies.
 */

var express = require('express');
// var routes = require('./routes');
// var parser = require('./routes/parser').parser;
var http = require('http');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
var auth = require('./config/middlewares/authorization');
// create logFile for storing server log
var logFile = fs.createWriteStream('./serverLogFile.log', {flags: 'a'}); //use {flags: 'w'} to open in write mode

var app = express();

//bootstrap passport config
require('./config/passport')(passport);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger({stream: logFile}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//Bootstrap routes
require('./config/routes')(app, passport, auth);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
