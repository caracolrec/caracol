
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var parser = require('./routes/parser');
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

//app.get('/users', user.list);
app.get('/app/:u/:t/*', function(req, res){
  params = {
    url: decodeURI(req.params.u),
    token: token
  };

  console.log('requesting app');
  //Post MVP check to see if url data exists in db
    async.eachSeries(
    // Pass items to iterate over
    ['./public/bower_components/jquery/jquery.min.js', './client/script.js'],
    // Pass iterator function that is called for each item
    function(filename, cb) {
      fs.readFile(filename, function(error, data) {
        if (!error) {
          res.write(data);
        }
        // Calling cb makes it go to the next item.
        cb(error);
      });
    },
    // Final callback after each item has been iterated over.
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
  console.log('post received', req.body);
  params = {
    url: req.body.uri,
    token: token
  };
  res.header("Access-Control-Allow-Origin", "*");

  res.end(parser.parser(params, function(response){
    dbClient.dbInsert(response.body);
  }));
});
//datestamp from visited bookmarklet
//weighting upvote/downvote


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
      dbClient.fetchClippings(oldestClippingId, callback);
    },
    function(clippings, callback) {
      console.log('about to send clippings back to client');
      res.send(clippings);
      callback(null);
    }
  ]);
});

// route for loading recommendations for a user
app.get('/fetchRecommendations', function(req, res) {
  async.waterfall([
    function(callback) {
      dbClient.fetchRecommendations(callback);
    },
    function(recs, callback) {
      console.log('about to send recs back to client:', recs);
      res.send(recs);
      callback(null);
    }
  ]);
});

// route for storing a vote from the user's clippings view



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



