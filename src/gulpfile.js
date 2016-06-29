var
  autoprefixer      = require('autoprefixer'),
  cleancss          = require('gulp-clean-css'),
  clean             = require('gulp-clean'),
  concat            = require('gulp-concat'),
  gulp              = require('gulp'),
  html5Lint         = require('gulp-html5-lint'),
  imagemin          = require('gulp-imagemin'),
  jshint            = require('gulp-jshint'),
  jshintStylish     = require('jshint-stylish'),
  livereload        = require('gulp-livereload'),
  less              = require('gulp-less'),
  lesshint          = require('gulp-lesshint'),
  mainBowerFiles    = require('main-bower-files'),
  plumber           = require('gulp-plumber'),
  postcss           = require('gulp-postcss'),
  runSequence       = require('run-sequence'),
  sourcemaps        = require('gulp-sourcemaps'),
  uglify            = require('gulp-uglify'),
  util              = require('gulp-util'),
  watch             = require('gulp-watch'),
  // webpack           = require('webpack'),
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
gulp.task('dist', ['bower', 'html', 'less', 'js', 'assets']);



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



//// gulp js
// Compile js through webpack
gulp.task('js', function (callback) {
  return gulp.src('./js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify({
      output: {
        'ascii_only': true
      }
    }))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('../dist/assets/js/'))
    .pipe(livereload());
  /*
  // old / weback
  // livereload ?
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
    if (err)
      throw new util.PluginError('webpack', err);

    util.log('[webpack]', stats.toString());
    livereload();

    callback();
  })

  //.pipe(livereload()
  */
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



// Html hints for clean code //  Used on watch
gulp.task('lintHtml', function() {
  return gulp.src('./html/**/*.html') // omit less/bundle.less // lesshint doesn't manage well imports
    .pipe(html5Lint());
});



// Less hints for clean code //  Used on watch
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
  gulp.watch('./js/**/*.js', ['js']); // ko, miss .pipe(livereload()); in gulp webpack task
});



//// gulp zip
/// Need to be called from gulp task 'archive'
gulp.task('zip', ['dist'], function() {
  return gulp.src('../dist/**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('..'));
});













gulp.task('hello', function() {
  // util.log('Hello world!');
  console.log('Hello world!');
});





//
