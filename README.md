# Kernix boilerplate

Basic kernix boilerplate, based on gulp, less, webpack.
Compile all stuff from /src into /dist



## Installation
Clone/download from github
cd src/
npm i

Install livereload plugin
http://livereload.com/extensions/
Note : if you want to use it with local files, be sure to enable “Allow access to file URLs” checkbox in Tools > Extensions > LiveReload after installation.



## Main commands/tasks
gulp // Generate /dist with bower dependencies, html, compiled less, compiled js
gulp watch // Generate /dist on the fly on modifications on /src files
  // Use with livereload plugin
gulp archive // Cleans /dist, then regenerate it & create dist.zip archive



## Ressources location

### Html
src/hmtl

### Less
src/less

### Js
src/js

### assets
src/assets

## Dependencies
- autoprefixer // Css prefixes
- chalk // Colored console
- gulp // Task manager
- gulp-clean // Remove /dist content via gulp cean
- gulp-clean-css // Minify css
- gulp-html5-lint // Display html warnigns & errors
- gulp-imagemin // Minify images
- gulp-jshint // Js linter
- gulp-less // Compiles less
- gulp-lesshint // Less linter (beautify code by displaying warnings)
- gulp-livereload // Reload browser on modifications, trough watch task
- gulp-plumber // Allow better plugins error management (don't ko on watch)
- gulp-postcss // Parse css only once
- gulp-sourcemaps // Css sourcemaps (better debug despite minify)
- gulp-uglify // Minify js
- gulp-util // Logs, colors, etc.
- gulp-watch // Stream src modifications
- gulp-zip // Make a zip file out of a folder
- jshint-stylish // Better display of js warnings & errors
- lodash // Js utility functions
- main-bower-files // Bower imports
- normalize.less // Less
- run-sequence // Allow to wait for tasks to end before lunching others
// - webpack // Compiles Js



## Todo
Doc
- Installation
- Main commands/tasks
- Ressources location

Add basic js
- eEasy imports
- on resize throttle

Add mixins collections

Remove FOUC















//
