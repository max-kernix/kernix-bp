var
  autoprefixer      = require('autoprefixer'),
  cleancss          = require('gulp-clean-css'),
  clean             = require('gulp-clean'),
  gulp              = require('gulp'),
  gutil             = require('gulp-util'),
  imagemin          = require('gulp-imagemin'),
  livereload        = require('gulp-livereload'),
  less              = require('gulp-less'),
  lesshint          = require('gulp-lesshint'),
  mainBowerFiles    = require('main-bower-files'),
  plumber           = require('gulp-plumber'),
  postcss           = require('gulp-postcss'),
  runSequence       = require('run-sequence'),
  sourcemaps        = require('gulp-sourcemaps'),
  watch             = require('gulp-watch'),
  webpack           = require('webpack'),
  zip               = require('gulp-zip');



//// gulp
// Default, call dist
gulp.task('default', ['dist']);



//// gulp archive
// Clean, then dist, then zip
gulp.task('archive', function() {
  return runSequence('clean', 'dist', 'zip');
});



//// gulp assets
// Manage assets (fonts, images, svg, etc.)
gulp.task('assets', ['images'], function () {
  return gulp.src(['assets/**/*', '!assets/visuals/images/**/*'])
    .pipe(gulp.dest('../dist/assets/'));
});



//// gulp bower
// Copy bower dependencies
gulp.task('bower', function () {
  return gulp.src(mainBowerFiles(), {
    base: 'bower_components'
  }).pipe(gulp.dest('../dist/assets/vendor'));
});



//// gulp clean
// Delete /dist folder content, and dist.zip
gulp.task('clean', function () {
  gulp.src('../dist.zip', {read: false})
    .pipe(clean({force: true}));
  // return on longest task // Far from ideal (return used for runSequence in gulp archive)
  return gulp.src('../dist', {read: false})
    .pipe(clean({force: true}));
});



//// gulp dist
// Default task, create prod files in app
gulp.task('dist', ['bower', 'html', 'less', 'webpack', 'assets']);



//// gulp html
// Move html files
gulp.task('html', function () {
  return gulp.src('html/*')
    .pipe(gulp.dest('../dist'))
    .pipe(livereload());
});



//// gulp images
// Optimize images
gulp.task('images', function () {
  return gulp.src('assets/visuals/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('../dist/assets/visuals/images/'))
});



//// gulp less
// Compile less
gulp.task('less', function () {
  return gulp.src('./less/bundle.less')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(less())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 3 version']
      })
    ]))
    .pipe(cleancss())
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('../dist/assets/css/'))
    .pipe(livereload());
});



gulp.task('lintLess', function() {
  return gulp.src('./less/**/*.less') // omit less/bundle.less // lesshint doesn't manage well imports
    .pipe(lesshint({
      'configPath': 'less/.lesshintrc' // Path to .lesshintrc config file
    }))
    .pipe(lesshint.reporter('')); // Leave empty to use the default, "stylish"
});



//// gulp watch
// Recompile on change
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./html/**/*.html', ['html']);
  gulp.watch('./less/**/*.less', ['lintLess', 'less']);
  // gulp.watch('./js/**/*.js', ['webpack']); // ko, miss .pipe(livereload()); in gulp webpack task
});



//// gulp webpack
// Compile js
gulp.task('webpack', function (callback) {
  webpack({
    entry: {
      main: './js/bundle.js'
    },
    output: {
      filename: '../dist/assets/js/bundle.js',
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      extensions: ['', '.js']
    },
    externals: {
      'jquery': 'jQuery'
    }
  }, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString());
    callback();
  });
});



//// gulp zip
/// Need to be called from gulp task 'archive'
gulp.task('zip', ['dist'], function() {
  return gulp.src('../dist/**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('..'));
});



















//
