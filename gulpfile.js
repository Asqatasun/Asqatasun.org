// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');

// JS hint task
gulp.task('jshint', function () {
    gulp.src('./src/JS/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function () {
    var imgSrc = './src/Images/**/*',
            imgDst = './build/Images';

    gulp.src(imgSrc)
            .pipe(changed(imgDst))
            .pipe(imagemin())
            .pipe(gulp.dest(imgDst));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function () {
    var htmlSrc = './src/*.html',
            htmlDst = './build';

    gulp.src(htmlSrc)
            .pipe(changed(htmlDst))
            .pipe(htmlmin({collapseWhitespace: true, removeComments:true}))
            .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    gulp.src(['./src/JS/lib.js', './src/JS/*.js'])
            .pipe(concat('Script.js'))
            .pipe(stripDebug())
            .pipe(uglify())
            .pipe(gulp.dest('./build/JS/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
    var mySrc = './src/CSS/*.less',
            myDst = './build/CSS/';
    gulp.src(mySrc)
            .pipe(less())
            .pipe(changed(myDst))
            .pipe(concat('Styles.css'))
            .pipe(autoprefix('last 2 versions'))
            .pipe(minifyCSS())
            .pipe(gulp.dest(myDst));
});

// Copy .htaccess
gulp.task('copyfiles', function () {
    var mySrc = './src/.htaccess',
            myDst = './build/';
    gulp.src(mySrc)
            .pipe(changed(myDst))
            .pipe(gulp.dest(myDst));
});

// Copy fonts
gulp.task('copyfonts', function () {
    var mySrc = './src/Fonts/*',
            myDst = './build/Fonts/';
    gulp.src(mySrc)
            .pipe(changed(myDst))
            .pipe(gulp.dest(myDst));
});

// default gulp task
gulp.task('default', ['copyfiles', 'copyfonts', 'imagemin', 'jshint', 'htmlpage', 'scripts', 'styles'], function () {
    // watch for .htaccess changes
    gulp.watch('./src/.htaccess', function () {
        gulp.run('copyfiles');
    });
    // watch for fonts changes
    gulp.watch('./src/Fonts/*', function () {
        gulp.run('copyfonts');
    });

    // watch for HTML changes
    gulp.watch('./src/*.html', function () {
        gulp.run('htmlpage');
    });

    // watch for JS changes
    gulp.watch('./src/JS/*.js', function () {
        gulp.run('jshint', 'scripts');
    });

    // watch for CSS changes
    gulp.watch('./src/CSS/*.css', function () {
        gulp.run('styles');
    });
});

// gulp task: RUN
gulp.task('0run', ['copyfiles', 'copyfonts', 'imagemin', 'jshint', 'htmlpage', 'scripts', 'styles'], function () {
    gulp.run('copyfiles');
    gulp.run('copyfonts');
    gulp.run('htmlpage');
    gulp.run('jshint', 'scripts');
    gulp.run('styles');
});
