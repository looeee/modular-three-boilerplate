const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');
const uglify = require('rollup-plugin-uglify');

//Compile glsl code
const glsl = () => {
  return {
    transform(code, id) {
      if (!/\.glsl$/.test(id)) return;

      return 'export default ' + JSON.stringify(
        code
        .replace(/[ \t]*\/\/.*\n/g, '')
        .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '')
        .replace(/\n{2,}/g, '\n')
      ) + ';';
    },
  };
};

gulp.task('bundle', () => {
  return rollup({
    entry: './src/entry.js',
    plugins: [
      nodeResolve({
        jsnext: true,
        module: false,
      }),
      glsl(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-loose-rollup'],
      }),
      gutil.log('Pre and post-uglify filesizes:'),
      filesize(),
      uglify(),
      filesize(),
    ],
  })
    .then((bundle) => {
      return bundle.write({
        format: 'iife',
        dest: 'scripts/main.js',
      });
    });
});

//Compile SCSS to CSS
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

// //default task
gulp.task('default', ['bundle'], () => {
  livereload.listen();
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['bundle']);
  gulp.watch('scripts/vendor/**/*.js', ['reload']);
  gulp.watch('./index.html', ['reload']);
});
