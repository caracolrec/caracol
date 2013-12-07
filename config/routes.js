module.exports = function(app, passport, auth) {

  /* -------------start of prefab MEAN routes-------------*/
    //User Routes
    // var users = require('../controllers/users');
    // app.get('/signin', users.signin);
    // app.get('/signup', users.signup);
    // app.get('/signout', users.signout);
  /* -------------end of prefab MEAN routes-------------*/

    //home rolled User routes
    //TODO: refactor to utilize MEAN routing & functions
    var async = require('async');
    var params;

    app.post('/signup', function(req, res){
      console.log('signup request looks like:', req.body);
      async.waterfall([
        function(callback) {
          dbClient.createUser(req.body.params, callback);
        },
        function(userInfo, callback) {
          console.log('sending up new user_id', userInfo);
          req.session.auth = true;
          req.session.id = userInfo.id;
          res.send(userInfo);
          callback(null);
        }
      ], function(error) {
        if (error) {
          res.send(409, error);
        }
      });
    });

    app.post('/login', function(req, res){
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

    app.post('/logout', function(req, res) {
      req.session = null;
      res.send('logged out');
    });

    //loads all dependencies and app for bookmarklet
    app.get('/bookmarklet/dependencies', function(req, res){
      async.eachSeries(
        ['./public/bower_components/angular-cookies/angular-cookies.min.js',
         './public/bower_components/angularLocalStorage/src/angularLocalStorage.js',
         './public/bower_components/underscore/underscore-min.js',
         './dist/bookmarklet/bookmarkletApp.js'],
        function(filename, cb) {
          console.log('well these are good');
          fs.readFile(filename, function(error, data) {
            if (!error) {
              res.write(data);
            }
            cb(error);
          });
        },
        function(error) {
          console.log('error loading bookmarklet dependencies', error);
          res.end();
        }
      );
    });

    //loads css for bookmarklet
    app.get('/dist/bookmarklet/caracol.css', function(req, res){
      fs.readFile('./dist/bookmarklet/caracol.css', function(error, data){
        if (error){
          console.log(error);
        } else {
          res.end(data);
        }
      });
    });

  /* -------------start of prefab MEAN routes-------------*/
    //Setting up the users api
    // app.post('/users', users.create);

    // app.post('/users/session', passport.authenticate('local', {
    //     failureRedirect: '/signin',
    //     failureFlash: 'Invalid email or password.'
    // }), users.session);

    // app.get('/users/me', users.me);

    // //Finish with setting up the userId param
    // app.param('userId', users.user);

    // //Article Routes
    // var articles = require('../app/controllers/articles');
    // app.get('/articles', articles.all);
    // app.post('/articles', auth.requiresLogin, articles.create);
    // app.get('/articles/:articleId', articles.show);
    // app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    // app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    // //Finish with setting up the articleId param
    // app.param('articleId', articles.article);
  /* -------------end of prefab MEAN routes-------------*/

    //Inject script onto current page
    var fs = require('fs');
    app.get('/script', function(req, res){
      fs.readFile('./dist/bookmarklet/templates/home.html', function(error, data){
        if (error) {
        console.log(error);
        } else {
          res.end(data);
        }
      });
    });

    //
    app.get('/app/:url/:t/*', function(req, res){
      console.log('requesting app');
        async.eachSeries(
        ['./public/bower_components/jquery/jquery.min.js', './dist/bookmarklet/script.js'],
        function(filename, cb) {
          fs.readFile(filename, function(error, data) {
            if (!error) {
              res.write(data);
            }
            cb(error);
          });
        },
        function(error) {
          console.log('error loading injection scripts', error);
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
    var parser = require('../controllers/parser.js').parser;
    

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
          console.log('clipping id before reply to client is:', clipping_id);
          res.send(200, clipping_id);
          callback(null);
        }
      ]);
    });

    var handleFetching = function(clippings_or_recs, req, res) {
      // improve this checking
      if (!req.query.user_id || parseInt(req.query.lastId) < 0 || !req.query.batchSize) {
        res.send(400, 'Poorly formed request')
      // should also add handling for when user is not authorized --> respond with 401
      } else {
        async.waterfall([
          function(callback) {
            dbClient.fetch(clippings_or_recs, req.query.user_id, parseInt(req.query.lastId), req.query.batchSize, callback);
          },
          function(clippings, callback) {
            console.log('about to send clippings back to client');
            res.send(clippings);
            callback(null);
          }
        ]);
      }
    };

    // route for loading user's clippings
    app.get('/fetchmyclippings', function(req, res) {
      handleFetching('clippings', req, res);
    });

    // route for loading recommendations for a user
    app.get('/fetchmyrecommendations', function(req, res) {
      handleFetching('recs', req, res);
    });

    // route for storing a vote from the user's clippings view
    app.post('/vote/:clipping_id', function(req, res) {
      console.log(req.body);
      var params = {
        clipping_id: req.params.clipping_id,
        vote: req.body.vote,
        user_id: req.body.user_id
      };
      res.end(dbClient.dbVote(params));
    });

    //Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

};
