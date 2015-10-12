(() => {
  "use strict";

  const gulp = require("gulp");
  const plumber = require("gulp-plumber");
  const babel = require("gulp-babel");
  const source = require("vinyl-source-stream");
  const buffer = require("vinyl-buffer");
  const browserify = require("browserify");
  const babelify = require("babelify");
  const uglify = require("gulp-uglify");
  const header = require("gulp-header");
  const sourcemaps = require("gulp-sourcemaps");
  const cssmin = require("gulp-minify-css");
  const concat = require("gulp-concat");

  const config = require("../gulpconfig");

  gulp.task("buildJS", ["cleanJS", "cacheTemplates"], () => {
    return browserify(config.src.browserify, {debug: true})
      .transform(babelify)
      .bundle()
      .pipe(source("script.min.js"))
      .pipe(buffer())
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(header(config.electronDeps))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(config.dist.main))
    ;
    /*return gulp.src(config.src.js.concat(config.dist.template))
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(concat("script.min.js"))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(config.dist.main))
    ;*/
  });

  gulp.task("buildNode", ["cleanNode"], () => {
    return gulp.src(config.src.node)
      .pipe(plumber())
      .pipe(gulp.dest(config.dist.node))
    ;
  });

  gulp.task("buildCSS", ["cleanCSS"], () => {
    return gulp.src(config.src.css)
      .pipe(plumber())
      .pipe(cssmin())
      .pipe(concat("style.min.css"))
      .pipe(gulp.dest(config.dist.main))
    ;
  });

  gulp.task("build", ["buildJS", "buildCSS", "buildNode"]);

})();
