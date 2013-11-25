module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    //   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    //   '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    //   '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    //   ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    stylus: {
      compile: {
        options: {},
        files: {
          'public/stylesheets/caracol.css': 'public/stylesheets/stylus/caracol.styl'
        }
      }

    },
    concat: {
      options: {
        // banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['*.js', 'views/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        // banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
          'dist/bookmarklet.js': ['client/bookmarklet.js']
        }
      }
    },
    jshint: {
      files: ['*.js', 'routes/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        globals: {
          jQuery: true,
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      // lib_test: {
      //   src: ['lib/**/*.js', 'test/**/*.js']
      // }
    },
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      stylus: {
        files: 'public/stylesheets/stylus/*.styl',
        tasks: ['stylus']
      }
      //tests not integrated with watch
      // lib_test: {
      //   files: '<%= jshint.lib_test.src %>',
      //   tasks: ['jshint:lib_test', 'qunit']
      // }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  //TODO add qunit to run tests
  grunt.registerTask('default', ['stylus', 'jshint', 'concat', 'uglify']);

};

var config = {
  token: '3a94d79c91f97112e52dbf3ca5759f53dc3d1ea4'
};
module.exports = config;

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var parser = require('./routes/parser');
var http = require('http');
var path = require('path');
// var request = require('superagent');
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

app.get('/app/:uri', function(req, res){
  params = {
    //todo uri --> url
    url: req.params.uri,
    token: token
  };
  console.log(params.url);
  //Post MVP check to see if url data exists in db
  res.end(
    //query db to see if favorited
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
    console.log(response);
  }));
});
//new get request
//datestamp from visited bookmarket
//weighting upvote/downvote

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
