"use strict";

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');// or gulp-changed
const remember = require('gulp-remember');
const path = require('path');

const cached = require('gulp-cached');
const cache = require('gulp-cache');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function () {

  // console.log(require('stylus/lib/parser').cache); //stylus cache

  return gulp.src('frontend/styles/main.styl')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylus())
    .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
    .pipe(gulp.dest('public'));

});

gulp.task('clean', function () {
  return del('public');
});

gulp.task('assets', function () {
  return gulp.src('frontend/assets/**'/*, {since: gulp.lastRun('assets')}*/)
    .pipe(cached('styles'))
    .pipe(newer('public'))
    .pipe(remember('styles'))
    .pipe(debug({title: 'assets'}))
    .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'assets')
));

gulp.task('watch', function () {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles')).on('unlink', function (filepath) {
    remember.forget('styles', path.resolve(filepath));
    delete cached.caches.stylus[path.resolve(filepath)];
  });
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('dev', gulp.series('build', 'watch'));
