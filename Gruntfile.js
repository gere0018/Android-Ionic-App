/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // This will minify all JS files
    concat: {
//      options: {
//        banner: '<%= banner %>',
//        stripBanners: true
//      },
      dist: {
        src: ['www/js/*.js' ],
        dest: 'www/dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
//      options: {
//        banner: '<%= banner %>'
//      },
      dist: {
        src: '<%= concat.dist.src %>',
        dest: 'www/dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: false,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        //these objects are safe to igonnore during the linting process
        globals: {
          "angular" : false,
          "console" : true,
          "cordova" : true,
          "window" : true,
          "StatusBar" : true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src_js: {
        src: ['www/dist/*.js']
      },
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src_js: {
        files: '<%= jshint.src_js.src %>',
        tasks: ['jshint:gruntfile', 'concat', 'uglify']
      },
    },
    //bower
    bower: {
      install: {
        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },
    //this will copy out only the min files to the www folder
    copy: {
      js: {
        src: 'lib/**/*.min.js',
        dest: 'www/',
      },
      css: {
        src: 'lib/**/css/*',
        dest: 'www/',
      },
      fonts: {
        src: 'lib/**/fonts/*',
        dest: 'www/',
      }
    },
    cordovacli: {
      options: {
        cli: 'cordova'  // cca or cordova
      },
      cordova: {
        options: {
          command: ['platform','build'],
          platforms: ['android'],
          path: 'plugins'
        }
      },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-cordovacli');
  // Default task.
  grunt.registerTask('default', [ 'bower', 'copy', 'concat','jshint', 'uglify','cordovacli']);

};
