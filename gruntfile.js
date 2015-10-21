"use strict";

var _ = require( "lodash" );
var webpack = require( "webpack" );


var mergeWebpackConfig = function( config ) {

  // Load webpackConfig only when using `grunt:webpack`
  // load of grunt tasks is faster
  var webpackConfig = require( "./webpack.config" );
  return _.merge( {}, webpackConfig, config, function( a, b ) {
    if ( _.isArray( a ) ) {
      return a.concat( b );
    }
  } );
};

module.exports = function( grunt ) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig( {
    pkg: grunt.file.readJSON( "package.json" ),
    sass: {
      min: {
        files: {
          "dist/react-calendar.css": "src/stylesheets/datepicker.scss"
        },
        options: {
          sourcemap: "none",
          style: "expanded"
        }
      },
      unmin: {
        files: {
          "dist/react-calendar.min.css": "src/stylesheets/datepicker.scss"
        }
      }
    },

    watch: {
      jscs: {
        files: [
          "{src,test}/**/*.{js,jsx}",
          "gruntfile.js",
          "karma.conf.js"
        ],
        tasks: [ "jscs" ]
      },

      css: {
        files: "**/*.scss",
        tasks: [ "sass" ]
      },

      karma: {
        files: [
          "src/**/*.jsx",
          "src/**/*.js",
          "test/**/*.jsx",
          "test/**/*.js"
        ],
        tasks: [ "karma" ]
      },

      webpack: {
        files: [ "src/**/*.js", "src/**/*.jsx" ],
        tasks: [ "webpack" ]
      }
    },

    scsslint: {
      files: "src/stylesheets/*.scss",
      options: {
        config: ".scss-lint.yml",
        colorizeOutput: true
      }
    },

    karma: {
      unit: {
        configFile: "karma.conf.js",
        singleRun: true
      }
    },

    jscs: {
      files: [
        "{src,test}/**/*.{js,jsx}",
        "gruntfile.js",
        "karma.conf.js"
      ],
      options: {
        config: ".jscsrc",
        verbose: true,
        fix: grunt.option( "fix" ) || false
      }
    },

    webpack: {
      unmin: mergeWebpackConfig( {
        output: {
          filename: "react-calendar.js"
        }
      } ),
      min: mergeWebpackConfig( {
        output: {
          filename: "react-calendar.min.js"
        },
        plugins: [
          new webpack.optimize.UglifyJsPlugin( {
            compressor: {
              warnings: false
            }
          } )
        ]
      } )
    }
  } );

  grunt.loadNpmTasks( "grunt-scss-lint" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-webpack" );
  grunt.loadNpmTasks( "grunt-karma" );
  grunt.loadNpmTasks( "grunt-jscs" );

  grunt.registerTask( "default", [ "watch", "scsslint" ] );
  grunt.registerTask( "travis", [ "jscs", "karma", "scsslint" ] );
  grunt.registerTask( "build", [ "webpack", "sass" ] );
};
