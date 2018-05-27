'use strict';

const   gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    watch = require('gulp-watch'),
    path = require('path'),
    rs = require('run-sequence'),
    del = require('del'),
    filter = require('gulp-filter'),
    debug = require('gulp-debug');
//styles
const   postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    atImport = require('postcss-import'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano');
//js
const babel = require('gulp-babel');

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const isDev = process.env.NODE_ENV === 'development';

/**
 * Returns environment-dependant path
 */
function getDestPath(p) {
    return path.join(app.destBase, (p || ''));
}

function getLoadFileInfo() {
    return require('./loadfile.json');
}

//path
const app = {
    destBase: __dirname
};

app.srcScss = path.join(app.destBase, 'src/scss');
app.destCss = path.join(app.destBase, 'destr/css');
app.srcJs = path.join(app.destBase, 'src/js');
app.destrJs = path.join(app.destBase, 'destr/js');

gulp.task('clean', ['cleancss']);

gulp.task('cleancss', function () {
    return del(app.destCss + '*css*');
});

//compile scss to css
gulp.task('scss', function () {
    return gulp.src(app.srcScss + '/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'expanded',
            includePaths: ['node_modules/']
        })).on('error', $.sass.logError)
        //adding auto-prefixes, minimization and optimization css
        .pipe(postcss([
            autoprefixer({ browsers: ["last 3 versions", "IE 10"], }),
            atImport(),
            mqpacker(),
            cssnano()
        ]))
        .pipe(debug({title: 'compile:'}))
        .pipe($.sourcemaps.write('.', {
            includeContent: false
        }))
        .pipe(gulp.dest(app.destCss))
        .pipe(filter("**/*.css"))
        .pipe($.livereload());
});

//js task
gulp.task('js', function () {
    return gulp.src(app.srcJs + '/*.js')
        .pipe(babel({
            presets: ['env'],
            minified: true,
            sourceMaps: 'map'
        }))
        .pipe(gulp.dest(app.destrJs))
        .pipe($.livereload());
});

//gulp watch js, scss files changes
gulp.task('watch', function () {
    $.livereload.listen();

    gulp.watch(app.srcScss + '/**/*.scss', function () {
        rs('scss');
    });

    gulp.watch(app.srcJs + '/*.js', function () {
        rs('js');
    });
});

// Dev tools by default
gulp.task('default', function () {
    rs('clean', 'scss', 'js', 'watch');
});

gulp.task('build', function () {
    rs('clean', 'scss');
});