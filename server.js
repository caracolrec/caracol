
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
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

//var request = require('superagent');
var token = process.env.APPSETTING_readability_key || require(__dirname + '/config.js').token;
var params;
var caracolPG = require('./database/dbsetup.js').caracolPG;
var dbClient = require('./database/dbclient.js');
var algorithm = require('./controllers/algorithm.js');
var async = require('async');

//elsewhere:
var User = require('./database/dbschemas.js').User;

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
    url: req.body.uri,
    token: token
  };
  res.header("Access-Control-Allow-Origin", "*");

  res.end(parser(params, function(response){
    dbClient.dbInsert(response.body);
  }));
});

// app.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                  failureRedirect: '/login' }));



//REFACTOR OPPORTUNITY!!:  (stars on the floor - pick 'em up!)

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

//RETURN TO THIS - a better serialization.  Maybe hash, include session start time? 
passport.serializeUser(function(user, done) {
  //return?
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    //return?
    done(err, user);
  });
});

// route for loading user's clippings
app.get('/fetchMyClippings', function(req, res) {
  var oldestClippingId;
  console.log('typeof oldestClippingId:', typeof req.query.oldestClippingId);
  if (req.query.oldestClippingId !== 'null') {
    oldestClippingId = req.query.oldestClippingId;
  }
  async.waterfall([
    function(callback) {
      dbClient.dbFetch(oldestClippingId, callback);
    },
    function(clippings, callback) {
      console.log('about to send clippings back to client');
      res.send(clippings);
      callback(null);
    }
  ]);
});

// route for storing a vote from the user's clippings view
app.post('/vote', function(req, res) {
  console.log(req.body);
  params = {
    // clipping_id: req.body.clipping_id,
    vote: req.body.vote
    // bookmarkStatus: req.body.bookmarkStatus,
    // lastBookmarkTime: req.body.lastBookmarkTime,
    // lastVoteTime: req.body.lastVoteTime
  };
  res.end(dbClient.dbVote(params));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



