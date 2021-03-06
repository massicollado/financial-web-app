const gulp = require('gulp');
const babel = require('gulp-babel');
var uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
const { parallel } = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('transpilajs', () =>
    gulp.src('src/js/*.js') //directorio origen
        .pipe(babel({
            presets: ['@babel/env'] //proceso de transpilacion
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js')) //destino
);

gulp.task('minificahtml', () => {
    return gulp.src('src/html/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('minificascss', function () {
    var plugins = [
        autoprefixer({overrideBrowserslist: ['last 1 version'],
        cascade: false}),
        cssnano()
    ];
    return gulp.src('src/scss/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(plugins))
      .pipe(gulp.dest('dist/scss'));
  });

  //Ejecuta paralelamente las tareas anteriores
  gulp.task('build', gulp.parallel("transpilajs", "minificascss", "minificahtml"));
  
  gulp.task('serveinit', (done) =>{
    browserSync.init({server: "dist", port: 9000});
    done();
    });

    gulp.task('watcher', ()=>{
    
        gulp.watch('src/scss/**/*.scss', gulp.series('minificascss')).on('change',  browserSync.reload);
        gulp.watch('src/js/*.js', gulp.series('transpilajs')).on('change',  browserSync.reload);
        gulp.watch('src/html/*.html', gulp.series('minificahtml')).on('change', browserSync.reload);
      
    });

    gulp.task('serve', gulp.series('build', 'serveinit', 'watcher'));