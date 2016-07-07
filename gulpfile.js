var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')
plugins.nodemon = require('gulp-nodemon')
plugins.sourcemaps = require('gulp-sourcemaps')
plugins.livereload = require('gulp-livereload')

var manifest = require('./package.json')
process.env.VERSION = manifest.version

gulp.task('default', ['serve', 'watchify'], function () {
  plugins.livereload.listen()
})

gulp.task('serve', function () {
  plugins.nodemon({
    script: './server.js',
    watch: ['./server.js', '.']
  })
})

gulp.task('build', ['browserify'])

gulp.task('watchify', function () {
  // set up the browserify instance on a task basis
  var bundler = watchify(
    browserify({
      entries: './components/main.js',
      debug: true
    })
  ).transform('babelify', { presets: ['es2015', 'react'] })
  .transform('envify')

  bundler.on('update', function () { compile(bundler) })
  return compile(bundler)
})

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var bundler = watchify(
    browserify({
      entries: './components/main.js',
      debug: true
    })
  ).transform('babelify', { presets: ['es2015', 'react'] })
  .transform('envify')

  return compile(bundler)
})

function compile (bundler) {
  return bundler.bundle()
  .on('error', function (err) {
    console.error(err.message)
    this.emit('end')
  })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(plugins.sourcemaps.init({ loadMaps: true }))
  .pipe(plugins.sourcemaps.write('./'))
  .pipe(gulp.dest('./public/js/'))
  .pipe(plugins.livereload())
}
