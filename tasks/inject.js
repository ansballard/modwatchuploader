(() => {
  "use strict";

  const gulp = require("gulp");
  const fs = require("fs");
  const path = require("path");
  const crypto = require("crypto");
  const plumber = require("gulp-plumber");
  const inject = require("gulp-inject");
  const sequence = require("run-sequence");

  const config = require("../gulpconfig");

  gulp.task("injectJS", ["buildJS"], () => {

    return gulp.src(config.dist.inject)
      .pipe(plumber())
      .pipe(inject(gulp.src(config.dist.js, {read: false}), {
        transform: (filepath) => {
          let hash = crypto.createHash("md5").update(fs.readFileSync(path.join(__dirname, "..", filepath))).digest("hex");
          let fp = filepath.split("/");
          return "<script type=\"text/javascript\">" + config.electronModules + "</script>\n<script type=\"text/javascript\" src=\"dist/" + fp[fp.length - 1] + "?hash=" + hash + "\"></script>";
        }
      }))
      .pipe(gulp.dest("./"))
    ;
  });

  gulp.task("injectCSS", ["buildCSS"], () => {

    return gulp.src(config.dist.inject)
      .pipe(plumber())
      .pipe(inject(gulp.src(config.dist.css, {read: false}), {
        transform: (filepath) => {
          let hash = crypto.createHash("md5").update(fs.readFileSync(path.join(__dirname, "..", filepath))).digest("hex");
          let fp = filepath.split("/");
          return "<link rel=\"stylesheet\" type=\"text/css\" href=\"dist/" + fp[fp.length - 1] + "?hash=" + hash + "\"/>";
        }
      }))
      .pipe(gulp.dest("./"))
    ;
  });

  gulp.task("inject", (cb) => {
    sequence("injectJS", "injectCSS", cb);
  });

})();
