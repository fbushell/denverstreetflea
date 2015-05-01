module.exports = function ( grunt ) {

    "use strict";

    // Default project paths.
    var pubRoot = ".",

        sassRoot = "./sass",
        cssRoot = "./sqs_template/styles",
        // fontsRoot = "./sqs_template/assets/fonts",
        // imgRoot = "./sqs_template/assets/images",

        jsRoot = "./js",
        appRoot = jsRoot + "/app",
        libRoot = jsRoot + "/lib",
        distRoot = "sqs_template/scripts";

    // Project configuration.
    grunt.initConfig({
        // Project meta.
        meta: {
            version: "0.1.0"
        },

        // Nautilus config.
        nautilus: {
            options: {
                jsAppRoot: appRoot,
                jsDistRoot: distRoot,
                jsLibRoot: libRoot,
                jsRoot: jsRoot,
                pubRoot: pubRoot,
                jsGlobals: {
                    // 3rd party, for example
                    $: true,
                    jQuery: true,
                    ScrollMagic: true,
                    ScrollScene: true,
                    TweenMax: true,
                    Random: true,
                    Cubic: true,
                    Hammer: true,

                    // YUI / Squarespace
                    Y: true,
                    YUI: true,
                    Squarespace: true,
                    Modernizr: true
                },
                hintOn: [
                    "watch",
                    "build",
                    "deploy"
                ]
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: sassRoot,
                    cssDir: cssRoot,
                }
            }
        },

        autoprefixer: {
            css: {
                src: cssRoot + '/**.css',
            }
        },

        watch: {
            options: {
                livereload: false,
            },
            css: {
                files: ['sass/**/*.sass', 'sass/screen.scss'],
                tasks: ['compass', 'autoprefixer:css'],
                options: {
                    spawn: false,
                }
            },
            scripts: {
                files: 'js/**/*.js',
                tasks: 'nautilus:build'
            }
        },

        git_subtree_add: {
            subtree: {
                options: {
                    source: "https://denverstreetflea.squarespace.com/template.git",
                    branch: "master",
                    target: "template"
                }
            }
        },
        git_subtree_push: {
            subtree: {
                options: {
                    source: "https://denverstreetflea.squarespace.com/template.git",
                    branch: "master",
                    target: "template"
                }
            }
        },
        git_subtree_pull: {
            subtree: {
                options: {
                    source: "https://denverstreetflea.squarespace.com/template.git",
                    branch: "master",
                    target: "template"
                }
            }
        }
    });

    // Load the nautilus plugin.
    grunt.loadNpmTasks( "grunt-nautilus" );
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-cmv-git-subtree');

    // Register default task.
    grunt.registerTask( "default", ["watch", "compass"] );
};