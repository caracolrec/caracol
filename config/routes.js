module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/users', users.create);

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/me', users.me);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    // //Article Routes
    // var articles = require('../app/controllers/articles');
    // app.get('/articles', articles.all);
    // app.post('/articles', auth.requiresLogin, articles.create);
    // app.get('/articles/:articleId', articles.show);
    // app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    // app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    // //Finish with setting up the articleId param
    // app.param('articleId', articles.article);

    var fs = require('fs');
    app.get('/script', function(req, res){
      fs.readFile('../client/partials/home.html', function(error, data){
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

    var async = require('async');
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
    //CORS preflight path
    app.options('/*', function(req, res){
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.send(200, res.header);
    });


    var dbClient = require('../database/dbclient.js');
    var token = process.env.APPSETTING_readability_key || require(__dirname + '/config.js').token;
    var parser = require('../controllers/parser.js');
    app.post('/uri', function(req, res){
      console.log(req.body.uri);
      params = {
        url: decodeURIComponent(req.body.uri),
        token: token
      };

      res.header("Access-Control-Allow-Origin", "*");
      async.waterfall([
        function(callback){
          parser(params, callback);
          console.log('here');
        },
        function(response, callback){
          console.log('about to send clipping id to client:', response);
          dbClient.dbInsert(response, callback);
        },
        function(clipping_id, callback){
          clipping_id = clipping_id.toString();
          res.end(clipping_id);
          callback(null);
        }
      ]);
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
    app.post('/vote/:clipping_id', function(req, res) {
      console.log(req.body);
      var params = {
        clipping_id: clipping_id,
        vote: req.body.vote,
        user_id: req.body.user_id
      };
      res.end(dbClient.dbVote(params));
    });

    //Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

};