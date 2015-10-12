(() => {
  "use strict";

  const gulp = require("gulp");
  const plumber = require("gulp-plumber");
  const templateCache = require("gulp-angular-templatecache");

  const config = require("../gulpconfig");

  gulp.task("cacheTemplates", () => {
    return gulp.src(config.src.template)
      .pipe(plumber())
      .pipe(templateCache({
        module: config.dist.module + ".template",
        standalone: true,
        transformUrl: (url) => {
          if(url.indexOf("/") !== -1) {
            return url.split("/")[url.split("/").length - 1];
          } else if(url.indexOf("\\") !== -1) {
            return url.split("\\")[url.split("\\").length - 1];
          } else {
            return url;
          }
        }
      }))
      .pipe(gulp.dest(config.dist.template))
    ;
  });

})();
