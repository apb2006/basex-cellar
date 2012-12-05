module.exports = function(grunt) {
   // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['js/**/*.js']
    },
    jshint: {
      options: {
        browser: true,
		smarttabs:true
      }
    }
  });

};