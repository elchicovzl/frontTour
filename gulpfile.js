var gulp,
    config,
    gulpRename,
    gulpJade,
    browserify,
    productionTasks,
    install,
    developmentTasks,
    less,
    mocha;

config     = require('./package.json').config;
gulp       = require('gulp');
mocha      = require('gulp-mocha');
browserify = require('gulp-browserify');
gulpJade   = require('gulp-jade');
gulpRename = require("gulp-rename");
less       = require('gulp-less');
install    = require("gulp-install");
uglify     = require('gulp-uglify');

//TODO
gulp.task('less', function(done) {
    gulp.src('./public/less/**/*.less')
        .pipe(less({
        }))
        .pipe(gulp.dest('./public/less'));
});

gulp.task('jade', function(done) {
    gulp
        .src('./views/**/*.jade')
        .pipe(gulpJade({pretty:true}))
        .pipe(gulp.dest('./public/views'))
});

gulp.task('browserify', function(done) {

    gulp
        .src('./public/js/main.js')
        .pipe(browserify())
        .pipe(uglify({mangle: false}))
        .pipe(gulpRename('bundle.js'))
        .pipe(gulp.dest('./public/js'))
});

gulp.task('npm install', function(done) {
    gulp
        .src(['./package.json'])
        .pipe(install());
});

gulp.task('npm install', function(done) {
    gulp
        .src(['./package.json'])
        .pipe(install());
});

productionTasks = ['less', 'jade', 'browserify'];
developmentTasks = [];


gulp.task('default', config.env === 'production' ? productionTasks : developmentTasks);

gulp.task('deploy', productionTasks);
