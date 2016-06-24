'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var watchify = require('watchify');
var reload = browserSync.reload;
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
    .transform(babelify, {presets: ["react"]})
    .bundle()
    .pipe(source(p.bundle))
    .pipe(buffer())
    .pipe(gulp.dest(p.distJs));
});

gulp.task('browserSync', function() {
    browserSync({
        notify: false,
        server: {
            baseDir: './'
        }
    })
});

gulp.task('watchify', function() {
    var bundler = watchify(browserify(p.jsx, watchify.args));
    
    function rebundler() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(p.bundle))
            .pipe(gulp.dest(p.distJs))
            .pipe(reload({stream: true}));
    }
    
    bundler.transform(babelify, {presets: ["react"]})
    .on('update', rebundle);
    return rebundler();
});

gulp.task('watch', ['clean'], function() {
    gulp.start(['browserSync']);
});

gulp.task('build', ['clean'], function() {
    process.env.NODE_ENV = 'production';
    gulp.start(['browserify']);
});

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});

