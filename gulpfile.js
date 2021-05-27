'use strict';
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-dart-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
let terser = require('gulp-terser-js');
const browserSync = require('browser-sync');

let path = {
    src_sass:'./src/scss/*.scss',
    src_js:'./src/js/main.js',
}

gulp.task("sassTask", function() {
    return gulp
        .src(path.src_sass)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

// JS task: uglifies JS files to main.js
gulp.task('jsTask', function() {
    return gulp
      .src(path.src_js)
      .pipe(sourcemaps.init())
      .pipe(terser({
          mangle: {
              toplevel: true
          }
      }))
      .on('error', function (error) {
          if (error.plugin !== "gulp-terser-js") {
              console.log(error.message)
          }
        this.emit('end')
      })
      .pipe(sourcemaps.write()) // Inline source maps.
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.stream());
  });

// Static Server & watching scss/js/html files
gulp.task('serve', gulp.series('sassTask', function() {
    browserSync.init({
        server: "./"   
    });
  
    gulp.watch(path.src_sass,
      gulp.series('sassTask'));

    gulp.watch(path.src_js,
      gulp.series("jsTask"));

    gulp.watch("*.html").on('change', browserSync.reload);
  }));
  
  gulp.task('default',
    gulp.series('sassTask', "jsTask", 'serve'));