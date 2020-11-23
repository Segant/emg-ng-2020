// 'gulp' for build
// 'gulp serve' for livereload

const gulp = require('gulp');
// const pug = require('gulp-pug');
const nunjucks = require('gulp-nunjucks');
// var nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const imagemin = require('gulp-imagemin');
const svgo = require('gulp-svgo');

const clean = require('gulp-clean');

const browserSync = require('browser-sync').create();

const folder = {
  src: 'src/',
  dist: 'dist/'
};

const path = {
  nunjucks: 'templates/**/*.html',
  sass: 'sass/**/*.scss',
  fonts: 'fonts/**/.*',
  images: 'img/**/*.*',
  js: 'js/**/*.*',
  libs: 'libs/**/*.*'
};


gulp.task('html', () => {
  return gulp.src([folder.src + path.nunjucks, '!src/templates/includes/**/*.html', '!src/templates/layout/**/*.html'],)
    .pipe(nunjucks.compile())
    // .pipe(nunjucksRender({
    //   path: ['src/templates/'] // String or Array
    // }))
    .pipe(gulp.dest(folder.dist))
    .pipe(browserSync.stream());
});

gulp.task('css', () => {
  return gulp.src(folder.src + path.sass)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(folder.dist + 'css/'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(folder.src + path.js)
    .pipe(gulp.dest(folder.dist + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src(folder.src + path.fonts)
    .pipe(gulp.dest(folder.dist + 'fonts'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src(folder.src + path.images)
    .pipe(imagemin())
    .pipe(svgo())
    .pipe(gulp.dest(folder.dist + 'img'))
    .pipe(browserSync.stream());
});

gulp.task('libs', () => {
  return gulp.src(folder.src + path.libs)
    .pipe(gulp.dest(folder.dist + 'libs'))
    .pipe(browserSync.stream());
});

gulp.task('clean', () => {
  return gulp.src('dist/',{read: false})
  .pipe(clean({force: true}))
});

gulp.task('folders', () => {
  return gulp.src('*.*',{read: false})
  .pipe(gulp.dest(folder.dist + 'img'))
  .pipe(gulp.dest(folder.dist + 'fonts'))
});

gulp.task('copy-img', () => {
  return gulp.src(folder.dist + path.images)
  .pipe(gulp.dest(folder.src + 'img'))
});


gulp.task('serve', function () {
  browserSync.init({
    open: false,
    server: {
      baseDir: "./dist",
      //online: false
      browser: "google chrome",

      reloadDelay: 1000
    },
  });

  gulp.watch([folder.src + path.sass], gulp.series(['css']));
  gulp.watch(folder.src + path.nunjucks, gulp.series(['html']));
  // gulp.watch(folder.src + path.images, ['images']);
  gulp.watch(folder.src + path.js, gulp.series(['js']));

  // dont forget to place body tag in html (localhost:3001/help)
});



gulp.task('setup', gulp.parallel(['folders','html', 'css', 'js', 'images', 'fonts', 'libs']));
gulp.task('default', gulp.parallel(['html', 'css', 'js', 'images', 'fonts', 'libs']));