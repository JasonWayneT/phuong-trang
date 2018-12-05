'use strict';
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss    = require('gulp-postcss'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    precss = require('precss'),
    babel = require("gulp-babel");

    

    
    
gulp.task('babel', function () {
    return gulp.src('js/scripts.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename('main.js'))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./js'))
    });

sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
    return gulp.src('stylesheets/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('main.css'))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('./stylesheets'))
        .pipe(browserSync.stream());
    }); 

gulp.task('serve', [/*'minifyScripts',*/ 'sass'], function(){
    browserSync.init({
        proxy: {
            target: "./",
            ws: true
        },
  
        browser:'chrome.exe'
 
    });
    // gulp.watch('js/*.js',['minifyScripts']);
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch("./css/*.css", ['css']);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./*.php").on('change', browserSync.reload);
})

gulp.task('css', () => {
return gulp.src('./css/*.css')
.pipe( sourcemaps.init() )
.pipe( postcss([ require('precss'), require('autoprefixer') ]) )
.pipe( sourcemaps.write('.') )
.pipe( gulp.dest('.') )
})

gulp.task('autoprefixer',function(){
  return  gulp.src('./css/style.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./style.css'))
    });
gulp.task("concatScripts",["babel"], function(){
  return  gulp.src(['js/scripts.js','js/modules/SlideShow.js'],)
    // add additional script files to array above seperated by ',' ie, ,"scripts/jquery.min"
    // add in order of dependencies
    //don't use wildcards becasue dependencies matter
    .pipe(sourcemaps.init())
    .pipe(concat("scripts-bundled.js"))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("js"))
});

gulp.task("minifyScripts", ["babel","concatScripts"],function(){
    return gulp.src('js/scripts-bundled.js')
    .pipe(uglify())
    .pipe(rename('scripts-bundled.min.js'))
    .pipe(gulp.dest('js'))
});

 
gulp.task('imagemin', function(){
    gulp.src('assets/**')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
        .pipe(gulp.dest('dist/assets'))
    });


gulp.task('build',['minifyScripts','sass','css', 'imagemin'], function(){
    return gulp.src(['js/scripts-bundled.min.js','index.php',
                      'assets/**', 'fonts/**'], { base:'./' })
           .pipe(gulp.dest('dist'))         
                    });


gulp.task('del', function(){
    del(['dist','assets/*','css/main.css*','stylesheets/**/*.scss','js/*.js','stylesheets/**/*.sass' ]);
});

gulp.task("default", ['build'] )