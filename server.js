
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var parser = require('./routes/parser').parser;
var http = require('http');
var path = require('path');
var fs = require('fs');
var passport = require('passport');

// create logFile for storing server log
var logFile = fs.createWriteStream('./serverLogFile.log', {flags: 'a'}); //use {flags: 'w'} to open in write mode
var _ = require('underscore');
//var request = require('superagent');
var token = process.env.APPSETTING_readability_key || require(__dirname + '/config/config.js').token;
var params;
var caracolPG = require('./database/dbsetup.js').caracolPG;
var dbClient = require('./database/dbclient.js');
var algorithm = require('./controllers/algorithm.js');
var async = require('async');

//elsewhere:
var User = require('./database/dbschemas.js').User;

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
//TODO refactor into 
app.get('/', routes.index);

app.post('/signup', function(req, res){
  console.log(req.body);
  async.waterfall([
    function(callback) {
      dbClient.createUser(req.body, callback);
    },
    function(userInfo, callback) {
      console.log('sending up new user_id', userInfo);
      res.send(userInfo);
      callback(null);
    }
  ]);
});

app.get('/login', function(req, res){
  console.log(req.query.username);
  async.waterfall([
    function(callback) {
      dbClient.findUser({username: req.query.username}, callback);
    },
    function(user_id, callback) {
      res.send({user_id: user_id.id});
      callback(null);
    }
  ]);
});

app.get('/script', function(req, res){
  fs.readFile('./client/partials/home.html', function(error, data){
    if (error) {
      console.log(error);
    } else {
      res.end(data);
    }
  });
});

app.get('/client/:module', function(req, res){
  var module = req.params.module;
  fs.readFile('./client/' + module, function(error, data){
    if (error){
      console.log(error);
    } else {
      res.end(data);
    }
  });
});

//following three are temp for demo

app.get('/public/bower_components/angular-cookies/angular-cookies.min.js', function(req, res){
  fs.readFile('./public/bower_components/angular-cookies/angular-cookies.min.js', function(error, data){
    if (error){
      console.log(error);
    } else {
      res.end(data);
    }
  });
});

app.get('/public/bower_components/angularLocalStorage/src/angularLocalStorage.js', function(req, res){
  fs.readFile('./public/bower_components/angularLocalStorage/src/angularLocalStorage.js', function(error, data){
    if (error){
      console.log(error);
    } else {
      res.end(data);
    }
  });
});

app.get('/public/bower_components/underscore/underscore-min.js', function(req, res){
  fs.readFile('./public/bower_components/underscore/underscore-min.js', function(error, data){
    if (error){
      console.log(error);
    } else {
      res.end(data);
    }
  });
});

//end demo temp routes

app.get('/app/:url/:t/*', function(req, res){
  console.log('requesting app');
    async.eachSeries(
    ['./public/bower_components/jquery/jquery.min.js', './client/script.js'],
    function(filename, cb) {
      fs.readFile(filename, function(error, data) {
        if (!error) {
          res.write(data);
        }
        cb(error);
      });
    },
    function(error) {
      res.end();
    }
  );
});

app.options('/*', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.send(200, res.header);
});

app.post('/uri', function(req, res){
  params = {
    url: decodeURIComponent(req.body.uri),
    token: token
  };
  var user_id = req.body.user_id;
  res.header("Access-Control-Allow-Origin", "*");
  async.waterfall([
    function(callback){
      parser(params, callback);
    },
    function(response, callback){
      response.url = params.url;
      dbClient.dbInsert(response, user_id, callback);
    },
    function(clipping_id, callback){
      clipping_id = clipping_id.toString();
      console.log('clipping id', clipping_id);
      res.end(clipping_id);
      callback(null);
    }
  ]);
});

// route for loading user's clippings
app.get('/fetchMyClippings', function(req, res) {
  console.log('oldestClippingId:', req.query.oldestClippingId);
  console.log('typeof oldestClippingId:', typeof req.query.oldestClippingId);
  console.log('typeof oldestClippingId parsed:', typeof parseInt(req.query.oldestClippingId));
  // improve this checking
  if (!req.query.user_id || parseInt(req.query.oldestClippingId) < 0 || !req.query.batchSize) {
    res.send(400, 'Poorly formed request')
  // should also add handling for when user is not authorized --> respond with 401
  } else {
    async.waterfall([
      function(callback) {
        dbClient.fetchClippings(req.query.user_id, parseInt(req.query.oldestClippingId), req.query.batchSize, callback);
      },
      function(clippings, callback) {
        console.log('about to send clippings back to client');
        res.send(clippings);
        callback(null);
      }
    ]);
  }
});

// route for loading recommendations for a user
app.get('/fetchRecommendations', function(req, res) {
  var oldestRecId;
  if (req.query.oldestRecId !== 'null') {
    oldestRecId = req.query.oldestRecId;
  }
  if (!req.query.user_id) {
    res.send(400, 'Poorly formed request; needs a user id')
  // should also add handling for when user is not authorized --> respond with 401
  } else {
    async.waterfall([
      function(callback) {
        dbClient.fetchRecommendations(req.query.user_id, oldestRecId, callback);
      },
      function(recs, callback) {
        console.log('about to send recs back to client:', recs);
        res.send(recs);
        callback(null);
      }
    ]);
  }
});

//TODO failing server side
// route for storing a vote from the user's clippings view
app.post('/vote/:clipping_id', function(req, res) {
  params = {
    clipping_id: req.params.clipping_id,
    vote: req.body.vote,
    user_id: req.body.user_id
  };
  res.end(dbClient.dbVote(params));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
