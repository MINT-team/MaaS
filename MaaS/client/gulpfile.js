'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var del = require('del');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var watchify = require('watchify');
var reload = browserSync.reload;
var p = {
    jsx: './scripts/app.jsx',
    bundleApp: 'app.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distFont: 'dist/fonts'
};

gulp.task('clean',function(cb) {
    return del(['dist'], cb);
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watchify', function() {
    var bundler = watchify(browserify(p.jsx, watchify.args));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(p.bundleApp))
            .pipe(gulp.dest(p.distJs))
            .pipe(reload({stream: true}));
    }

    bundler.transform(babelify, {presets: ["es2015", "react"]})
    .on('update', rebundle);
    return rebundle();
});

gulp.task('watch', function() {
    gulp.start(['browserSync','watchify']);
});

gulp.task('build', function() {
    process.env.NODE_ENV = 'production';
    gulp.start(['browserify']);
});

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});

