
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var parser = require('./routes/parser');
var http = require('http');
var path = require('path');
var request = require('superagent');
var token = require(__dirname + '/config.js').token;
var params;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
//route the serves up app.js script
//query db with uri to see if favorited
app.get('/app/:uri', function(req, res){
  params = {
    //todo uri --> url
    url: req.params.uri,
    token: token
  };
  //send script, attach promise after parser
  console.log(params.url);
  //Post MVP check to see if url data exists in db
  res.end(
    //send back script injection
    );
});

app.get('/uri/:uri', function(req, res){
  params = {
    url: req.params.uri,
    token: token
  };
  console.log(params.url);
  res.end(parser.parser(params, function(response){
    //write data to db if it isn't already there
  }))
});
//new get request
//datestamp from visited bookmarket
//weighting upvote/downvote

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
