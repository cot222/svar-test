const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require("gulp-clean-css"),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify-es').default,
    webserver = require('browser-sync'),
    fileInclude = require('gulp-file-include'),
    concat = require('gulp-concat');

var path = {
    build: {
        html: 'public/',
        js: 'public/js/',
        css: 'public/css/',
        img: 'public/img/'
    },
    src: {
        htmlStart: 'dev/src/html/index.html',
        html: 'dev/src/html/*.html',
        js: 'dev/src/js/*.js',
        style: 'dev/src/style/styles.scss',
        img: 'dev/src/img/**/*'
    },
    watch: {
        html: 'dev/src/**/*.html',
        js: 'dev/src/js/**/*.js',
        css: 'dev/src/style/**/*.scss',
        img: 'dev/src/img/**/*'
    },
    clean: 'public/'
};

/* настройки сервера */
var ws_config = {
    startPath: 'index.html',
    server: {
        baseDir: 'public'
    },
    notify: false,
    files: [
        '/css/styles.css',
        '/js/script.js',
    ]
};

// запуск сервера
gulp.task('webserver', function () {
    webserver(ws_config);
});

gulp.task('html:build', function () {
    return gulp.src(path.src.htmlStart) // выбор всех html файлов по указанному пути
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

gulp.task('img:build', function () {
    return gulp.src(path.src.img) // выбор всех html файлов по указанному пути
        .pipe(gulp.dest(path.build.img)) // выкладывание готовых файлов
        .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

gulp.task('css:build', function () {
    return gulp.src(path.src.style) // получим styles.scss
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer()) // добавим префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCss()) // минимизируем CSS
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({ stream: true }))
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js) // получим файл script.js
        .pipe(concat("script.js"))
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify()) // минимизируем js
        .pipe(webserver.reload({ stream: true }))
        .pipe(gulp.dest(path.build.js)); // положим готовый файл
});

gulp.task('clean:build', function () {
    return gulp.src(path.clean, { read: false })
        // .pipe(rimraf());
});

gulp.task('build',
    gulp.parallel(
        'css:build',
        'js:build',
        'img:build'
    )
);

gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('img:build'));
});

gulp.task('watch:webserver', gulp.series(
    'build',
    'html:build',
    'css:build',
    'js:build',
    'img:build',
    gulp.parallel('webserver','watch')
));

gulp.task('default', gulp.series('build'));
