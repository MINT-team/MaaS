'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var del = require('del');
var p = {
    jsx: './scripts/app.jsx',
    bundle: 'app.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distFont: 'dist/fonts'
};

gulp.task('clean',function(cb) {
    return del(['dist'], cb);
});

gulp.task('browserify', function() {
    browserify(p.jsx)
    .transform(babelify)
    .pipe(source(p.bundle))
    .bundle()
    .pipe(gulp.dest(p.distJs));
});

gulp.task('build', ['clean'], function() {
    process.env.NODE_ENV = 'production';
    gulp.start(['browserify']);
});

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});