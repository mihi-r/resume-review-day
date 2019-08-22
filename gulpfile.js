const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rollup = require('rollup-stream');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const purge = require('gulp-css-purge');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const styles = function () {
  return gulp
    .src('./styles/*.css')
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(purge({
      trim: true,
      shorten: true,
      verbose: true,
    }))
    .pipe(rename(function(path){
      path.basename += ".min"
      path.extname = ".css"
    }))
    .pipe(gulp.dest('./build/'));
}

const rollupFile = function(inputPath, outputFilename) {
  return rollup({
      input: inputPath,
      format: 'cjs'
    })
    .pipe(source(outputFilename))
    .pipe(buffer())
    .pipe(babel({
      presets: [
        ['@babel/preset-env', {
          useBuiltIns: 'entry',
          corejs: 3,
        }],
      ],
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build'));
}

const rollupDevFile = function(inputPath, outputFilename) {
  return rollup({
      input: inputPath,
      format: 'cjs'
    })
    .pipe(source(outputFilename))
    .pipe(buffer())
    .pipe(gulp.dest('./build'));
}

const employers = function () {
  return rollupFile('./scripts/employers.js', 'employers.min.js');
}

const students = function () {
  return rollupFile('./scripts/students.js', 'students.min.js');
}

const employersDev = function () {
  return rollupDevFile('./scripts/employers.js', 'employers.min.js');
}

const studentsDev = function () {
  return rollupDevFile('./scripts/students.js', 'students.min.js');
}

const watchFiles = function () {
  gulp.watch('./scripts/*.js', gulp.series(employers, students));
  gulp.watch('./styles/*.css', gulp.series(styles));
}

const watchDevFiles = function () {
  gulp.watch('./scripts/*.js', gulp.series(employersDev, studentsDev));
  gulp.watch('./styles/*.css', gulp.series(styles));
}

const watch = gulp.parallel(employers, students, styles, watchFiles);
const dev = gulp.parallel(employersDev, studentsDev, styles, watchDevFiles);

exports.watch = watch;
exports.dev = dev;
