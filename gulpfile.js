'use strict';

var watchify = require('watchify');
var spwatch = require('gulp-watch');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var gulp = require('gulp');
var minify = require('gulp-minify');
var pkg =  require('./package.json');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
var spsync = require('gulp-spsync-creds').sync;
var secrets = require('./secrets.json')

gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(minify({
        ext:{
            src: '-' + pkg.version + '.js',
            min: '-' + pkg.version + '.min.js'
        },
        exclude: [],
        ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('bin'))
});

gulp.task('sp-save-bable', ()=>{
  return gulp.src('src/**/*.*')
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest('bin/sp/SiteAssets'));
})

gulp.task('spsave',['js'],  () => {
  return gulp.src('bin/sp/**/*.*')
  .pipe(spwatch('bin/sp/**/*.*'))
  .pipe(spsync({
      "username": secrets.username,
      "password": secrets.password,
      "site": secrets.site
  }))
})

var customOpts = {
  entries: ['./src/SiteAssets/jello-rxjs.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));
b.transform("babelify", {presets: ["es2015"]})

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal
function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./bin/sp/SiteAssets'))
}

gulp.task('js', bundle);
gulp.task('sharepoint', ['spsave'])

gulp.task('default', ['compress'])
