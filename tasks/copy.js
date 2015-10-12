(() => {
  "use strict";

  const gulp = require("gulp");
  const plumber = require("gulp-plumber");

  const config = require("../gulpconfig");

  gulp.task("copyFonts", () => {
    return gulp.src(config.src.fonts)
      .pipe(plumber())
      .pipe(gulp.dest(config.dist.fonts))
    ;
  });

  gulp.task("copyImages", () => {
    return gulp.src(config.src.images)
      .pipe(plumber())
      .pipe(gulp.dest(config.dist.images))
    ;
  });

  gulp.task("copy", ["copyFonts", "copyImages"]);

})();
