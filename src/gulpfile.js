var
  autoprefixer      = require('autoprefixer'),
  babel             = require('gulp-babel'),
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
gulp.task('dist', ['bower', 'html', 'less', 'js-es6', 'assets']);



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
// Compile js / classical
gulp.task('js', function (callback) {
  // Jshint our files only
  // gulp.src('./js/**/*.js')
  return gulp.src([
    // './node_modules/jquery/dist/jquery.min.js', // jquery // jshint ko, added directly in index.html
    './js/**/*.js'
  ])
    .pipe(jshint('./js/.jshintrc')) // 0fcks given about .jshintignore
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    // .pipe(jshint.reporter('fail'))

    .pipe(uglify({
      output: {
        'ascii_only': true
      }
    }))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('../dist/assets/js/'))
    .pipe(livereload());
});

// Compile js / es6
gulp.task('js-es6', function() {
  return gulp.src('js/**/*.js')
    // Js syntax verification
    .pipe(jshint('./js/.jshintrc')) // 0fcks given about .jshintignore
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    // sourcemaps
    .pipe(sourcemaps.init())
    // es2015
    .pipe(babel({
      presets: ['es2015']
    }))
    // minify & concat
    .pipe(uglify({
      output: {
        'ascii_only': true
      }
    }))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('.'))
    // move
    .pipe(gulp.dest('../dist/assets/js/'))
    .pipe(livereload());
});

// Compile js / webpack
// no livereload w webpack ? :/
gulp.task('js-webpack', function() {
  webpack({
    entry: {
      main: [
        './node_modules/jquery/dist/jquery.min.js', // jquery
        './js/bundle.js'
      ]
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
    livereload(); // ko ?

    callback();
  })
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
  gulp.watch('./html/**/*.html', ['lintHtml', 'html']);
  gulp.watch('./less/**/*.less', ['lintLess', 'less']);
  // gulp.watch('./js/**/*.js', ['js']);
  gulp.watch('./js/**/*.js', ['js-es6']);
  // gulp.watch('./js/**/*.js', ['js-webpack']);
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
