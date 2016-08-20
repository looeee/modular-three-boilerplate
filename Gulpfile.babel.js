const projectname = 'three_template';
const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('rollup-plugin-babel');
const livereload = require('gulp-livereload');
const browserify = require('browserify');
const rollupify = require('rollupify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');

// add custom browserify options here
const customOpts = {
  entries: ['src/entry.js'],
  debug: true,
};
const opts = Object.assign({}, watchify.args, customOpts);
const b = watchify(browserify(opts).transform('rollupify', {
  config: {
    plugins: [
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-loose-rollup'],
        plugins: ['babel-plugin-transform-decorators-legacy'],
      }),
    ],
  },
}));

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', (err) => {
      // print the error
      gutil.log(
        gutil.colors.red('Browserify compile error:'),
        err.message
      );
      // end this stream
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('scripts/'))
    .pipe(livereload());
}

//b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal


//Put all css/scss tasks here
gulp.task('sass', () => {
  return gulp.src('scss/**/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 3 version', 'ie 9'],
      cascade: true,
    }))
    .pipe(gulp.dest('styles/'))
    .pipe(livereload());
});

gulp.task('reload', () => {
  gulp.src(['./**/*.html', './**/*.php', '!node_modules/**/*.*'], {
    read: false,
  })
  .pipe(livereload());
});

gulp.task('babel', bundle);

//default task
gulp.task('default', [], () => {
  livereload.listen();
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['babel']);
  gulp.watch('scripts/vendor/**/*.js', ['reload']);
  gulp.watch('./index.php', ['reload']);
  //gulp.watch('**/*.php', ['reload']);
});
