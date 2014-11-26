'use strict';

var gulp = require('gulp');

gulp.task('watch', ['styles'] ,function () {
  gulp.watch('{app,components}/**/*.scss', ['styles']);
  gulp.watch('{app,components}/**/*.js', ['scripts']);
  gulp.watch('assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
