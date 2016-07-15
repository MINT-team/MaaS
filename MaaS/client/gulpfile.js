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
var factor = require('factor-bundle');
var reload = browserSync.reload;
var p = {
    jsx: './scripts/app.jsx',
    bundleApp: 'app.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distFont: 'dist/fonts'
};
/*var vendors = ['react','react-dom','react-router','flux','keymirror','object-assign','superagent'];
var packageJson = require('../package.json')
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

var production = (process.env.NODE_ENV === 'production');*/

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

gulp.task('watch', ['clean'], function() {
    gulp.start(['browserSync','watchify']);
});

/*gulp.task('buildApp', function() {
    gulp.start(['browserifyApp']);
});

gulp.task('buildVendor', function() {
    gulp.start(['browserifyVendor']);
});
*/
gulp.task('build', ['clean'], function() {
    process.env.NODE_ENV = 'production';
    gulp.start(['browserify']);
});

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});

