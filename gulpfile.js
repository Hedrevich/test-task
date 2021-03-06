var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify-es').default;
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
gulp.task(
    'ui5preload',
    function() {
        return gulp.src(
            [
                '**/**.+(js|xml)',
                '!Component-preload.js',
                '!gulpfile.js',
                '!WEB-INF/web.xml',
                '!model/metadata.xml',
                '!node_modules/**',
                '!resources/**'
            ]
        )
            .pipe(gulpif('**/*.js', uglify())) //only pass .js files to uglify
            .pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: './',
                namespace: 'sap.ui.user.management.system',
                fileName: 'Component-preload.js'
            }))
            .pipe(gulp.dest('.'));
    }
);
