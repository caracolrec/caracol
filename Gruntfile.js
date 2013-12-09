/*global module:false*/
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
    mochacov: {
      coverage: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      test: {
        options: {
          reporter: 'spec'
        }
      },
      options: {
        files: 'test/*.js'
      }
    },
    stylus: {
      compile: {
        options: {},
        files: {
          'public/stylesheets/caracol.css': 'public/stylesheets/stylus/caracol.styl',
          'public/stylesheets/bookmarklet.css': 'public/stylesheets/stylus/bookmarklet/bookmarklet.styl'
        }
      }

    },
    concat: {
      options: {
        // banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['*.js', 'views/*.js'],
          'dist/bookmarklet/script.js': ['client/*.js'],
          'dist/bookmarklet/bookmarkletApp.js': ['client/scripts/*.js', 'client/scripts/services/*.js', 'client/scripts/controllers/*.js','client/scripts/directives/*.js'],
          'dist/bookmarklet/templates/home.html': ['client/partials/home.html'],
          'dist/bookmarklet/caracol.css': ['public/stylesheets/lib/topcoat-desktop-dark.css', 'public/stylesheets/lib/style.css','public/stylesheets/bookmarklet.css']
        }
      }
    },
    uglify: {
      options: {
        // banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
          'dist/bookmarklet.js': ['client/bookmarklet.js'],

        }
      }
    },
    jshint: {
      files: ['*.js',
      'routes/*.js',
      'client/**/**/*.js',
      'public/scripts/**/*.js',
      'config/*.js',
      'controllers/*.js',
      'database/*.js'],
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
          angular: true,
          $: true,
          services: true,
          controllers: true,
          directives: true,
          passport: true
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
        files: ['public/stylesheets/stylus/bookmarklet/*.styl'], 
        tasks: ['stylus']
      },
      concat: {
        files: ['client/**/**/*.js', 'dist/bookmarklet/caracol.css', 'public/stylesheets/bookmarklet.css', 'client/partials/home.html'],
        tasks: ['concat']
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
  grunt.loadNpmTasks('grunt-mocha-cov');


  // Default task.
  //TODO add qunit to run tests
  grunt.registerTask('default', ['stylus', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('travis', ['mochacov:coverage']);
  grunt.registerTask('test', ['mochacov:test']);
};
