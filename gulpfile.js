const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const path = require('path');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const svgMin = require('gulp-svgmin');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

let API_HOST = 'http://localhost:8080';
let ENV = 'development';

if (process.env.ENV === 'production') {
  API_HOST = '';
  ENV = 'production';
}

gulp.task('fonts', () => {
  return gulp.src([
    'assets/fonts/**/*',
  ])
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('scripts', () => {
  return gulp.src('assets/scripts/common.js')
    .pipe(webpackStream({
      devtool: process.env.ENV === 'production' ? false : 'source-map',
      entry: './assets/scripts/common.js',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            loader: 'babel-loader',
            options: {
              presets: [
                'es2015',
              ],
              plugins: [
                'transform-runtime',
              ],
            },
          },
        ],
      },
      output: {
        filename: 'common.js',
      },
      resolve: {
        modules: [
          path.resolve('./node_modules/'),
          path.resolve('./assets/scripts/'),
        ]
      }
    }, webpack))
    .pipe(replace('{{API_HOST}}', API_HOST))
    .pipe(replace('{{ENV}}', ENV))
    .pipe(gulpif(process.env.ENV === 'production', uglify()))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', () => {
  const fontAssets = gulp.src([
    './assets/styles/fonts.scss',
  ]);

  const staticAssets = gulp.src([
    './node_modules/sanitize.css/sanitize.css',
    './node_modules/leaflet/dist/leaflet.css',
    './node_modules/c3/c3.css',
  ]);

  const sassAssets = gulp.src([
    './assets/styles/common.scss',
  ])
    .pipe(sass().on('error', sass.logError));

  fontAssets
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano({
      zindex: false,
      discardUnused: {
        fontFace: false,
      },
    }))
    .pipe(gulp.dest('./dist/styles/'));

  merge(staticAssets, sassAssets)
    .pipe(autoprefixer({
      browsers: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'Explorer >= 10',
        'last 1 Edge versions',
        'last 3 iOS versions',
        'last 2 Safari versions',
        'last 2 ChromeAndroid versions',
        'Android >= 4.1',
      ],
    }))
    .pipe(cssnano({
      zindex: false,
    }))
    .pipe(concat('common.css'))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('svg', () => {
  return gulp.src('assets/images/**/*.svg')
    .pipe(svgMin())
    .pipe(svgSprite({
      mode: {
        css: false,
        defs: {
          dest: '',
          sprite: './symbols.svg',
        },
        stack: false,
        symbol: false,
        view: false,
      }
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('images', () => {
  return gulp.src('assets/images/**/*')
    .pipe(imagemin({
      plugins: [
        imagemin.jpegtran(),
        imagemin.optipng(),
      ],
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('html', () => {
  const version = require('./package.json').version;

  return gulp.src('dev/**/*.html')
    .pipe(replace('{{VERSION}}', `?v=${version}`))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
  gulp.watch('./dev/**/*', ['html']);
  gulp.watch('./assets/scripts/**/*', ['scripts']);
  gulp.watch('./assets/styles/**/*', ['styles']);
  gulp.watch('./assets/images/**/*.svg', ['svg']);
  gulp.watch('./assets/images/**/*', ['images']);
});

gulp.task('default', [
  'html',
  'fonts',
  'scripts',
  'styles',
  'svg',
  'images',
]);
