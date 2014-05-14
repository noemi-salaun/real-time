'use strict';

/*global module:false*/
module.exports = function(grunt) {
  
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* <%= pkg.homepage %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n',
    update_json: {
      bower: {
        src: 'package.json',
        dest: 'bower.json',
        fields: [
          'name',
          'version'
        ]
      }
    },
      
    // Task configuration.
    bower: {
      install: {
        options: {
          copy: false,
          verbose: true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',        
      },
      node: {
        src: ['Gruntfile.js', 'app/server/**/*.js', 'test/**/*.js']
      },
      browser: {
        options: {
          globals: {
            angular: false
          }
        },
        src: ['app/public/**/*.js']
      }
    },
    
    // Serving configuration
    concurrent: {
      tasks: ['nodemon','watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    nodemon: {
      dev: {
        script: 'app/server/server.js',
        options: {
          nodeArgs: ['--debug'],
          watch: ['./app/server/**', './app/shared/**'],
          cwd: __dirname
        }
      }
    },    
    watch: {
      js: {
        files: ['<%= jshint.node.src %>','<%= jshint.browser.src %>'],
        tasks: ['jshint']
      }
    }
  });

  grunt.registerTask('default', ['update_json', 'jshint', 'bower', 'concurrent']);
  grunt.registerTask('zip', ['concat', 'uglify']);
  grunt.registerTask('test', ['jshint']);

};
