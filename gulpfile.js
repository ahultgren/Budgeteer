'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var uglify = require('gulp-uglify');

var publicJsDir = 'source/js';
var publicJsRoot = './' + publicJsDir + '/main.js';
var jsDest = './public/dist';
var jsMin = 'main.min.js';

var jsGlob = ['package.json', 'gulpfile.js', 'app/**/*.js', 'source/**/*.js'];

var lessSrc = 'source/less/main.less';
var lessSrcGlob = ['source/less/**/*.less'];
var lessDest = 'public/dist';

gulp.task('lint', function() {
  gulp.src(jsGlob)
    .pipe(jshint({
      esnext: true,
      curly: true,
      eqeqeq: true,
      eqnull: true,
      globalstrict: true,
      camelcase: true,
      indent: 2,
      immed: true,
      latedef: 'nofunc',
      newcap: true,
      quotmark: true,
      undef: true,
      unused: true,
      trailing: true,
      node: true,
      browser: true,
      globals: {
        Range: true
      }
    }))
    .on('error', handleError)
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: [publicJsRoot],
    debug: true
  });

  var bundle = function() {
    return bundler
      .transform(babelify)
      .bundle()
      .on('error', util.log.bind(util, 'Browserify Error'))
      .pipe(source(jsMin))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(jsDest));
  };

  return bundle();
});


gulp.task('less', function () {
  gulp.src(lessSrc)
    .pipe(less({
      paths: [],
      compress: true
    }))
    .on('error', handleError)
    .pipe(gulp.dest(lessDest));
});

gulp.task('watch', function () {
  gulp.watch(jsGlob, ['lint', 'build_js']);
  gulp.watch(lessSrcGlob, ['build_css']);
});

gulp.task('build', ['build_js', 'build_css']);
gulp.task('build_js', ['lint', 'browserify']);
gulp.task('build_css', ['less']);

gulp.task('default', ['build', 'watch']);


/* Helpers
============================================================================= */

function handleError (error) {
  util.log(error.message);
}
