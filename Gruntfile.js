module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Convert LESS into CSS:
    less: {
      options: {
        concat: false
      },
      // Process iOS LESS file into CSS:
      ios: {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n<%= pkg.title %>\nChUI.iOS.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files: { 'chui/chui.ios-<%= pkg.version %>.css': 'src/themes/chui.ios.less'}
      },
      // Process Android LESS file into CSS:
      android : {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n<%= pkg.title %>\nChUI.Android.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files : { 'chui/chui.android-<%= pkg.version %>.css': 'src/themes/chui.android.less'}
      },
      // Process Windows LESS file into CSS:
      win : {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n<%= pkg.title %>\nChUI.Win.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files : { 'chui/chui.win-<%= pkg.version %>.css': 'src/themes/chui.win.less'}
      }
    },
    // Concat JavaScript files and Examples:
    concat: {
      // Concat the ChocolateChipJS files together:
      chocolatechip: {      
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n\n<%= pkg.title %>\nChocolateChip.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        src: ["src/chocolatechip/start.js","src/chocolatechip/returnResult.js","src/chocolatechip/selectors.js","src/chocolatechip/extend.js","src/chocolatechip/core.js","src/chocolatechip/plugin.js","src/chocolatechip/cache.js","src/chocolatechip/collection.js","src/chocolatechip/domready.js","src/chocolatechip/string.js","src/chocolatechip/ajax.js","src/chocolatechip/feature-detection.js","src/chocolatechip/templates.js","src/chocolatechip/pubsub.js","src/chocolatechip/expose-chocolatechip.js","src/chocolatechip/end.js"],
        dest: 'chui/chocolatechip-<%= pkg.version %>.js'
      },
      // Concat the ChUIJS files together:
      chui: {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n\n<%= pkg.title %>\nChUI.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        src: ['src/chui/start.js', 'src/chui/event-init.js','src/chui/jquery-helpers.js','src/chui/$-extensions.js','src/chui/collection-extensions.js','src/chui/widget-factory.js','src/chui/load-init.js','src/chui/end.js','src/chui/gestures.js'],
        dest: 'chui/chui-<%= pkg.version %>.js'
      },
      // The following concats are just to attach a banner to the LESS output:
      ios: {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n\n<%= pkg.title %>\nChUI.iOS.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        src: ['chui/chui.ios-<%= pkg.version %>.css'],
        dest : 'chui/chui.ios-<%= pkg.version %>.css'
      },
      android: {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n\n<%= pkg.title %>\nChUI.Android.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        src: ['chui/chui.android-<%= pkg.version %>.css'],
        dest: 'chui/chui.android-<%= pkg.version %>.css'
      },
      win: {
        options: {
          banner: '/*\n    pO\\\n   6  /\\\n     /OO\\\n    /OOOO\\\n  /OOOOOOOO\\\n ((OOOOOOOO))\n  \\:~=++=~:/\n\n<%= pkg.title %>\nChUI.Win.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        src: ['chui/chui.win-<%= pkg.version %>.css'],
        dest: 'chui/chui.win-<%= pkg.version %>.css'
      },
      // Concat iOS examples:
      example_ios: {
        options: {
          banner: '<!DOCTYPE html>\n<html lang="en">\n<head>\n   <meta charset="utf-8">\n   <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n   <meta name="apple-mobile-web-app-capable" content="yes">\n   <meta name="mobile-web-app-capable" content="yes">\n   <meta name="msapplication-tap-highlight" content="no">\n   <title>ChocolateChip-UI iOS</title>\n   <link rel="stylesheet" href="../chui/chui.ios-<%= pkg.version %>.css">\n   <script src="../chui/chocolatechip-<%= pkg.version %>.js"></script>\n   <!--<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>-->\n   <script src="../chui/chui-<%= pkg.version %>.js"></script>\n'
        },
        files: [
          {
            expand: true,
            cwd: 'src/examples/',
            src: ['**/*'],
            dest: 'examples-ios/'
          }
        ]
      },
      // Concat Android examples:
      example_android: {
        options: {
          banner: '<!DOCTYPE html>\n<html lang="en">\n<head>\n   <meta charset="utf-8">\n   <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n   <meta name="apple-mobile-web-app-capable" content="yes">\n   <meta name="mobile-web-app-capable" content="yes">\n   <meta name="msapplication-tap-highlight" content="no">\n   <title>ChocolateChip-UI Android</title>\n   <link rel="stylesheet" href="../chui/chui.android-<%= pkg.version %>.css">\n   <script src="../chui/chocolatechip-<%= pkg.version %>.js"></script>\n   <script src="../chui/chui-<%= pkg.version %>.js"></script>\n'
        },
        files: [
          {
            expand: true,
            cwd: 'src/examples/',
            src: ['**/*'],
            dest: 'examples-android/'
          }
        ]
      },
      // Concat Windows Phone 8 examples:
      example_win: {
        options: {
          banner: '<!DOCTYPE html>\n<html lang="en">\n<head>\n   <meta charset="utf-8">\n   <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n   <meta name="apple-mobile-web-app-capable" content="yes">\n   <meta name="mobile-web-app-capable" content="yes">\n   <meta name="msapplication-tap-highlight" content="no">\n   <title>ChocolateChip-UI Win</title>\n   <link rel="stylesheet" href="../chui/chui.win-<%= pkg.version %>.css">\n   <script src="../chui/chocolatechip-<%= pkg.version %>.js"></script>\n   <script src="../chui/chui-<%= pkg.version %>.js"></script>\n'
        },
        files: [
          {
            expand: true,
            cwd: 'src/examples/',
            src: ['**/*'],
            dest: 'examples-win/'
          }
        ]
      },
      // Concat iOS version of demo:
      demo_ios: {
        options: {
          banner: '<!DOCTYPE html>\n<html lang="en">\n<head>\n   <meta charset="utf-8">\n   <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n   <meta name="apple-mobile-web-app-capable" content="yes">\n   <meta name="mobile-web-app-capable" content="yes">\n   <meta name="msapplication-tap-highlight" content="no">\n   <title>ChocolateChip-UI Demo iOS</title>\n   <link rel="stylesheet" href="../chui/chui.ios-<%= pkg.version %>.css">\n   <script src="../chui/chocolatechip-<%= pkg.version %>.js"></script>\n   <script src="../chui/chui-<%= pkg.version %>.js"></script>\n'
        },
        files: {
          'demo/index-ios.html': ['src/demo/index.html']
        }
      },
      // Concat Android version of demo:
      demo_android: {
        options: {
          banner: '<!DOCTYPE html>\n<html lang="en">\n<head>\n   <meta charset="utf-8">\n   <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n   <meta name="apple-mobile-web-app-capable" content="yes">\n   <meta name="mobile-web-app-capable" content="yes">\n   <meta name="msapplication-tap-highlight" content="no">\n   <title>ChocolateChip-UI Demo Android</title>\n   <link rel="stylesheet" href="../chui/chui.android-<%= pkg.version %>.css">\n   <script src="../chui/chocolatechip-<%= pkg.version %>.js"></script>\n   <script src="../chui/chui-<%= pkg.version %>.js"></script>\n'
        },
        files: {
          'demo/index-android.html': ['src/demo/index.html']
        }
      },
      // Concat Windows Phone 8 version of demo:
      demo_win: {
        options: {
          banner: '<!DOCTYPE html>\n<html lang="en">\n<head>\n   <meta charset="utf-8">\n   <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n   <meta name="apple-mobile-web-app-capable" content="yes">\n   <meta name="mobile-web-app-capable" content="yes">\n   <meta name="msapplication-tap-highlight" content="no">\n   <title>ChocolateChip-UI Demo Android</title>\n   <link rel="stylesheet" href="../chui/chui.win-<%= pkg.version %>.css">\n   <script src="../chui/chocolatechip-<%= pkg.version %>.js"></script>\n   <script src="../chui/chui-<%= pkg.version %>.js"></script>\n'
        },
        files: {
          'demo/index-win.html': ['src/demo/index.html']
        }
      },
      tests : {
        options: {
          banner: "<!doctype html>\n<html>\n   <head>\n      <meta charset='UTF-8' />\n      <meta http-equiv='content-type' content='text/html; charset=utf-8' />\n      <title>QUnit ChocolateChipJS</title>\n      <link rel='stylesheet' href='../qunit/qunit.css'>\n      <script src='../../chui/chocolatechip-<%= pkg.version %>.js'></script>\n      <script src='../qunit/qunit.js'></script>\n  </head>\n"
        },
        files: [
          {
            expand: true,
            cwd: 'src/tests/',
            src: ['**/*.html'],
            dest: 'tests/'
          }
        ]
      }
    },
    // Minify JavaScript files:
    uglify: {
      chui: {
        options: {
          banner: '/*\nChocolateChip-UI\nChUI.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files: {
          'chui/chui-<%= pkg.version %>.min.js': ['chui/chui-<%= pkg.version %>.js']
        }
      },
      chocolatechip: {
        options: {
          banner: '/*\nChocolateChip-UI\nChocolateChip.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files: {'chui/chocolatechip-<%= pkg.version %>.min.js': ['chui/chocolatechip-<%= pkg.version %>.js']
        }
      },
      chui: {
        options: {
          banner: '/*\nChocolateChip-UI\nChUI.js\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/\n'
        },
        files: {
          'chui/chui-<%= pkg.version %>.min.js': ['chui/chui-<%= pkg.version %>.js']
        }
      }
    },
    // Minnify CSS files:
    cssmin: {
      android: {
        options: {
          banner: '/*\nChocolateChip-UI\nChUI-Android.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/'
        },
        files: {'chui/chui.android-<%= pkg.version %>.min.css': 'chui/chui.android-<%= pkg.version %>.css'}
      },
      ios: {
        options: {
          banner: '/*\nChocolateChip-UI\nChUI-iOS.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/'
        },
        files: {'chui/chui.ios-<%= pkg.version %>.min.css': 'chui/chui.ios-<%= pkg.version %>.css'}
      },
      win: {
        options: {
          banner: '/*\nChocolateChip-UI\nChUI-Win.css\nCopyright <%= grunt.template.today("yyyy") %> Sourcebits www.sourcebits.com\nLicense: <%= pkg.licences[0].type %>\nVersion: <%= pkg.version %>\n*/'
        },
        files: {'chui/chui.win-<%= pkg.version %>.min.css': 'chui/chui.win-<%= pkg.version %>.css'}
      }
    },
    // Copy files out of src directory:
    copy: {
      // Copy out images:
      images: {
        files: [
          { 
            expand: true,
            cwd: 'src/images/', 
            src: ['**/*.{png,jpg,svg}'], 
            dest:'images/' 
          }
        ]
      },
      // Copy out data files:
      data: {
        files: [
          {
            expand: true,
            cwd: 'src/data/',
            src: ['**/*'],
            dest: 'data/'
          }
        ]
      },
      // Copy out index for iOS examples:
      index_ios : {
        files: [
          {
            expand: true, 
            cwd: 'src/', 
            src: ['index.html'], 
            dest: 'examples-ios/'
          }
        ],
      },
      // Copy out index for Android examples:
      index_android: {
        files: [
          {
            expand: true, 
            cwd: 'src/', 
            src: ['index.html'], 
            dest: 'examples-android/'
          }
        ]
      },
      // Copy out index for Windows Phone 8 examples:
      index_win:  {
        files: [
          {
            expand: true, 
            cwd: 'src/', 
            src: ['index.html'], 
            dest: 'examples-win/'
          }
        ]
      },
      tests: {
        files: [
          {
            expand: true,
            cwd: 'src/tests/',
            src: ['**/*.js'],
            dest: 'tests/'
          }
        ]
      },
      qunit : {
        files : [
          {
            expand: true,
            cwd: 'src/tests/qunit/',
            src: ['*.css'],
            dest: 'tests/qunit/'
          }
        ]
      }
    },
    // Run JsHint on JavaScript files:
    // Rules to follow for linting:
    jshint: {
      options: {
          curly: false,
          browser: true,
          eqeqeq: true,
          forin: false,
          immed: false,
          expr: false,
          indent: false,
          noempty: true,
          plusplus: false,
          unused: false,
          boss: true,
          evil: true,
          laxbreak: true,
          multistr: true,
          scripturl: true,
          '-W030': true
      },
      chocolatechip: ['chui/chocolatechip-<%= pkg.version %>.js'],
      chui: ['chui/chui-<%= pkg.version %>.js']
    }
  });

  // Tasks:
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  // Default build:
  grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin', 'copy', 'jshint']);
  // Only ChocolateChipJS:
  grunt.registerTask('chocolatechipjs', ['concat:chocolatechip', 'uglify:chocolatechip']);
  // Only ChUIJS (for use with jQuery):
  grunt.registerTask('chuijs', ['concat:chui', 'uglify:chui']);
  // Build ChUIJS with Android theme (for use with jQuery):
  grunt.registerTask('chui_android', ['less:android', 'cssmin:android', 'concat:chui', 'uglify:chui']);
  // Build ChUIJS with iOS theme (for use with jQuery):
  grunt.registerTask('chui_ios', ['less:ios', 'cssmin:ios', 'concat:chui', 'uglify:chui']);
  // Build ChUIJS with Windows Phone 8 theme (for use with jQuery):
  grunt.registerTask('chui_win', ['less:win', 'cssmin:win', 'concat:chui', 'uglify:chui']);
  // Build ChUIJS with all three themes (Anrdoid, iOS, Windows):
  grunt.registerTask('chui', ['less', 'cssmin', 'concat:chui', 'uglify:chui']);

  // Android theme with ChocolateChipJS:
  grunt.registerTask('android', ['less:android', 'cssmin:android', 'concat:chocolatechip', 'concat:chui', 'uglify:chocolatechip', 'uglify:chui']);
  // iOS theme with ChocolateChipJS:
  grunt.registerTask('ios', ['less:ios', 'cssmin:ios', 'concat:chocolatechip', 'concat:chui', 'uglify:chocolatechip', 'uglify:chui']);
  // Windows Phone 8 theme with ChocolateChipJS:
  grunt.registerTask('windows', ['less:win', 'cssmin:win', 'concat:chocolatechip', 'concat:chui', 'uglify:chocolatechip', 'uglify:chui']);

  // Android examples with ChocolateChipJS:
  grunt.registerTask('android_examples', ['less:android', 'concat:android', 'cssmin:android', 'concat:chocolatechip', 'concat:chui', 'concat:example_android', 'concat:demo_android', 'uglify:chocolatechip', 'uglify:chui', 'copy:images', 'copy:data', 'copy:index_android']);
  // iOS examples with ChocolateChipJS:
  grunt.registerTask('ios_examples', ['less:ios', 'concat:ios', 'cssmin:ios', 'concat:chocolatechip', 'concat:chui', 'concat:example_ios', 'concat:demo_ios', 'uglify:chocolatechip', 'uglify:chui', 'copy:images', 'copy:data', 'copy:index_ios']);
  // Windows Phone 8 examples with ChocolateChipJS:
  grunt.registerTask('win_examples', ['less:win', 'concat:win', 'cssmin:win', 'concat:chocolatechip', 'concat:chui', 'concat:example_win', 'concat:demo_win', 'uglify:chocolatechip', 'uglify:chui', 'copy:images', 'copy:data', 'copy:index_win']);

  // Android examples for use with jQuery:
  grunt.registerTask('android_examples_chui', ['less:android', 'concat:android', 'cssmin:android', 'concat:chui', 'concat:example_android', 'concat:demo_android', 'uglify:chui', 'copy:images', 'copy:data', 'copy:index_android']);
  // iOS examples for use with jQuery:
  grunt.registerTask('ios_examples_chui', ['less:ios', 'concat:ios', 'cssmin:ios', 'concat:chui', 'concat:example_ios', 'concat:demo_ios', 'uglify:chui', 'copy:images', 'copy:data', 'copy:index_ios']);
  // Windows Phone 8 examples for use with jQuery:
  grunt.registerTask('win_examples_chui', ['less:win', 'concat:win', 'cssmin:win', 'concat:chui', 'concat:example_win', 'concat:demo_win', 'uglify:chui', 'copy:images', 'copy:data', 'copy:index_win']);

  grunt.registerTask('tests', ['concat:tests', 'copy:tests', 'copy:qunit']);
};