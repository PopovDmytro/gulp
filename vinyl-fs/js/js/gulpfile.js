"use strict";

const gulp = require('gulp');

gulp.task('default', function () {
  return gulp.src([ '**/*.*', '!node_modules/**' ]) //module minimatch -> '{source1,source2}/**/*.{js,css}'
  //'**/*.*', '!node_modules/**'  - bed practice
  //'{css,js,source}/**/*.*', 'gulpfile.js', 'package.json'
    .on('data', function (file) {
      console.log({
        contents: file.contents,
        path: file.path,
        cwd: file.cwd,
        base: file.base,
      //  path components helpers
        relative: file.relative,
        dirname: file.dirname,
        basename: file.basename,
        stem: file.stem,
        extname: file.extname,
      });
    })
    .pipe(gulp.dest(function (file) {
      return file.extname == '.js' ? 'js':
        file.extname == '.css' ? 'css' : 'dest';
    }));
});
