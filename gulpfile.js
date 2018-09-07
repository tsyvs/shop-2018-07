'use strict';

var gulp = require('gulp'),

  browserSync = require('browser-sync'),
  reload = browserSync.reload,

  rigger = require('gulp-rigger'),

  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  prefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-clean-css'),

  watch = require('gulp-watch'),
  uglify = require('gulp-uglify-es').default,

  tinypng = require('gulp-tinify'),
  del = require('del'),
  runSequence = require('run-sequence');

var path = {
  server_dir: './build',

  html_src: './src/*.html',
  html_watch: './src/**/*.html',
  html_dest: './build/',

  sass_src: './src/sass/**/*.scss',
  sass_watch: './src/sass/**/*.scss',
  sass_dest: './build/css',

  js_src: './src/js/script.js',
  js_watch: './src/js/**/*.js',
  js_dest: './build/js/',

  img_optimizing: [
    './src/img_to_minify/**/*.jpg',
    './src/img_to_minify/**/*.png'
  ],
  img_src: './src/img/**/*.*',
  img_watch: './src/img/**/*.*',
  img_optimized: './src/img/',
  img_dest: './build/img/',

  fonts_src: './src/fonts/**/*.*',
  fonts_watch: './src/fonts/**/*.*',
  fonts_dest: './build/fonts/'
};

var config = {
  server: {
    baseDir: path.server_dir
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: 'EasyCode_Shop'
};

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('build:html', function () {
  gulp.src(path.html_src)
  .pipe(rigger())
  .pipe(gulp.dest(path.html_dest))
  .pipe(reload({ stream: true }));
});

gulp.task('build:sass', function () {
  gulp.src(path.sass_src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourceMap: true,
      errLogToConsole: true
    }))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.sass_dest))
    .pipe(reload({ stream: true }));
});

gulp.task('build:js', function () {
  gulp.src(path.js_src)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.js_dest))
    .pipe(reload({ stream: true }));
});

gulp.task('tinypng', function () {
  return gulp.src(path.img_optimizing)
    .pipe(tinypng('7DjDuuwkwESUXiHtxULH61Xskr8HVF3U'))
    .pipe(gulp.dest(path.img_optimized));
});

gulp.task('del', function () {
  return del(path.img_optimizing, { force: true })
    .then(paths => {
      console.log('Deleted: ', paths.join('\n'));
    });
});

gulp.task('minify', function () {
  runSequence('tinypng', 'del');
});

gulp.task('build:img', function () {
  gulp.src(path.img_src)
    .pipe(gulp.dest(path.img_dest))
    .pipe(reload({ stream: true }));
});

gulp.task('build:fonts', function () {
  gulp.src(path.fonts_src)
    .pipe(gulp.dest(path.fonts_dest));
});

gulp.task('build', [
  'build:html',
  'build:sass',
  'build:js',
  'build:img',
  'build:fonts'
]);

gulp.task('watch', function () {
  gulp.watch(path.html_watch, ['build:html']);
  gulp.watch(path.sass_watch, ['build:sass']);
  gulp.watch(path.js_watch, ['build:js']);
  gulp.watch(path.img_watch, ['build:img']);
  gulp.watch(path.fonts_watch, ['build:fonts']);
});

gulp.task('default', ['build', 'webserver', 'watch']);
