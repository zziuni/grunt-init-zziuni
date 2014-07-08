module.exports = function(grunt){
  'use strict';
  require('load-grunt-tasks')(grunt);

  var groc = grunt.file.readJSON('.groc.json');
  var pointForDev = '<!-- point for dev -->';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    port: 4567,
    srcPath: './src',
    destPath: './dest',
    docPath: './doc',

    keepAliveScript: '<script type="text/javascript" src="http://localhost:35729/livereload.js"></script>',

    uglify: {
      product: {
        options: {
          mangle: false
        },
        files: {'<%=destPath%>/js/main.min.js': ['<%=destPath%>/js/main.js']}
      },
      dev: {}
    },

    browserify: {
      product: {
        src: ['<%=srcPath%>/js/main.js'],
        dest: '<%=destPath%>/js/main.js'
      },
      dev: {
        src: ['<%=srcPath%>/js/main.js'],
        dest: '<%=destPath%>/js/main.js',
        options: {
          bundleOptions: {
            debug: true
          }
        }
      }
    },

    groc: {
      options: {
        out: 'doc/'
      },
      javascript: groc.glob
    },

    jshint: {
      options: {
        jshintrc: true
      },
      files: ['<%=srcPath%>/js/**/*.js']
    },

    connect: {
      dev: {
        options: {
          port: '<%=port%>',
          base: '<%=destPath%>/',
          keepalive: true
        }
      }
    },

    clean: {
      doc: ['<%=docPath%>/**/*'],
      build: ['<%=destPath%>/**/*']
    },

    open: {
      dev: {
        path: 'http://localhost:<%=port%>',
        app: 'Google Chrome'
      },
      doc: {
        path: 'doc/main.html',
        app: 'Google Chrome'
      }
    },

    concurrent: {
      options: {
        limit: 3
      },
      dev: ['connect:dev', 'open:dev']
    },

    watch: {
      options: {
        livereload: true, //default port : 35729
        spawn: false
      },
      js: {
        files: ['<%=srcPath%>/js/**/*.js'],
        tasks: ['jshint', 'browserify:dev']
      },
      css: {
        files: ['<%=srcPath%>/stylesheets/**/*.css'],
        tasks: ['copy:css']
      },
      view: {
        files: ['<%=srcPath%>/views/**/*.html'],
        tasks: ['copy:view']
      },
      index: {
        files: ['<%=srcPath%>/index.html'],
        tasks: ['copy:indexForDev']
      },
      image: {
        files: ['<%=srcPath%>/images/**/*'],
        tasks: ['copy:image']
      }
    },

    copy: {
      css: {
        expand: true,
        cwd: '<%=srcPath%>/',
        src: 'stylesheets/**/*',
        dest: '<%=destPath%>/'
      },
      view: {
        expand: true,
        cwd: '<%=srcPath%>/',
        src: ['views/**/*'],
        dest: '<%=destPath%>/'
      },
      image: {
        expand: true,
        cwd: '<%=srcPath%>/',
        src: 'images/**/*',
        dest: '<%=destPath%>/'
      },
      lib: {
        expand: true,
        cwd: '<%=srcPath%>/',
        src: ['libs/**/*'],
        dest: '<%=destPath%>/'
      },
      indexForDev: {
        expand: true,
        flatten: true,
        src: ['<%=srcPath%>/index.html'],
        dest: '<%=destPath%>/',
        options: {
          process: function(content, srcpath) {
            // watcher keepalive 용
            var script = '<script type="text/javascript" src="http://localhost:35729/livereload.js"></script>';
            script += '<script type="text/javascript" src="js/main.js"></script>';
            return content.replace(pointForDev, script);
          }
        }
      },
      indexForProduct: {
        expand: true,
        flatten: true,
        src: ['<%=srcPath%>/index.html'],
        dest: '<%=destPath%>/',
        options: {
          process: function(content, srcpath) {
            // phonegap 용
            var script = '<script type="text/javascript" src="js/main.min.js"></script>';
            return content.replace(pointForDev, script);
          }
        }
      }
    }
  });

  grunt.registerTask('dev', ['buildForDev', 'watch']);
  grunt.registerTask('buildForDev', ['test', 'clean:build', 'copyForDev', 'browserify:dev']);
  grunt.registerTask('copyForDev', ['copy:css', 'copy:view', 'copy:lib', 'copy:indexForDev', 'copy:image']);

  grunt.registerTask('product', ['build']);
  grunt.registerTask('build', ['test', 'clean:build', 'copyForDev', 'browserify:product', , 'uglify:product']);
  grunt.registerTask('copyForDev', ['copy:css', 'copy:view', 'copy:lib', 'copy:indexForProduct', 'copy:image']);

  grunt.registerTask('test', ['jshint']); //todo: 유닛 테스트
  grunt.registerTask('server', ['concurrent:dev']);
  grunt.registerTask('makeDoc', ['clean:doc', 'groc', 'open:doc']);
};
