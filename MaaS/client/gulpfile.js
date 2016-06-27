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
    bundleVendor: 'vendor.js',
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
/*

gulp.task('browserifyVendor', function() {
    return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source(p.bundleVendor))
    .pipe(buffer())
    .pipe(gulp.dest(p.distJs));
});

gulp.task('browserifyApp', function() {
    return browserify(p.jsx)
    .external(dependencies)
    .transform(babelify, {presets: ["react"]})
    .bundle()
    .pipe(source(p.bundleApp))
    .pipe(buffer())
    .pipe(gulp.dest(p.distJs));
});


function getNPMPackageIds() {
  // read package.json and get dependencies' package ids
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || [];

}


gulp.task('browserifyVendor', function() {
    var b = browserify({
        // generate source maps in non-production environment
        debug: !production
    });
    
    getNPMPackageIds().forEach(function (id) {
        b.require(nodeResolve.sync(id), { expose: id });
    });

    var stream = b
    .bundle()
    .on('error', function(err){
      // print the error (can replace with gulp-util)
      console.log(err.message);
      // end this stream
      this.emit('end');
    })
    .pipe(source(p.bundleVendor))
    stream.pipe(gulp.dest(p.distJs));
    return stream;
});




gulp.task('browserifyApp', function() {
    var b = browserify(p.jsx, {
        debug: !production
    })
    
   
    getNPMPackageIds().forEach(function (id) {
        b.external(id);
    });

    var stream = b
    .transform(babelify, {presets: ["react"]})
    .bundle()
    .pipe(source(p.bundleApp))
    stream.pipe(gulp.dest(p.distJs));
    return stream;
});
*/


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
    gulp.start(['browserSync', 'watchify']);
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

