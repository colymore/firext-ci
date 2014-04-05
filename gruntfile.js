/*global module: true */
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: '*.js',
            grunt: ['gruntfile.js'],
            options: {
                jshintrc: '.jshintrc',
                globals: {}
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};