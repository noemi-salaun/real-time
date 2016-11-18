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
    
    // Serving configuration
    nodemon: {
      dev: {
        script: 'app/server/server.js',
        options: {
          nodeArgs: ['--debug'],
          watch: ['app/server/**/*', 'app/shared/**/*'],
          cwd: __dirname
        }
      }
    }
  });

  grunt.registerTask('default', ['update_json', 'bower', 'nodemon']);

};
