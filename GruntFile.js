module.exports = function(grunt) {

    //Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: [
                     'src/Helpers.js',
                     'src/InstructionLink.js',
                     'src/InstructionsList.js',
                     'src/TargetElement.js',
                     'src/OverlayInstructions.js',
                     'src/PageTour.js'
                     ],
                dest: 'deploy/dev/PageTour.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            js: {
                files: {
                    'deploy/release/PageTour.min.js': ['deploy/dev/PageTour.js']
                }
            }
        },
        copy: {
          css: {
            files: [
			    { src: 'style/**', 
			      dest: 'deploy/dev/'},
				{ src: 'style/Themes/Chalkboard/images/**', 
			      dest: 'deploy/release/'}]
          }
        },
		replace: {
			style: {
					src: ['style/style.css'],
					dest: 'deploy/release/style.css',
					replacements: [ { 
									from: '.css"',
									to: '.min.css"'},
									{
									from: 'url("',
									to: 'url("style/'}]
			}
		},
        cssmin: {
          dist: {
            files: {
              'deploy/release/style/PageTour.min.css' : ['deploy/dev/style/PageTour.css'],
			  'deploy/release/style/OverlayInstructions.min.css' : ['deploy/dev/style/OverlayInstructions.css'],
			  'deploy/release/style/Themes/Chalkboard/ChalkBoard.min.css' : ['deploy/dev/style/Themes/Chalkboard/ChalkBoard.css']
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('default', ['concat', 'uglify', 'copy','replace','cssmin']);
};
