(() => {
  "use strict";


  const gulp = require("gulp");
  const babel = require("gulp-babel");
  const uglify = require("gulp-uglify");
  const plumber = require("gulp-plumber");
  const concat = require("gulp-concat");
  const fs = require("fs");
  const minifyCSS = require("gulp-minify-css");
  const inject = require("gulp-inject");
  const sourcemaps = require("gulp-sourcemaps");

  const config = require("./gulpconfig");

  const requireDir = require("require-dir");

  requireDir("./tasks");

  gulp.task("default", ["inject", "buildNode", "copy"]);

  gulp.task("watch", ["default"], () => {

    gulp.watch(config.src.js, ["injectJS"]);
    gulp.watch(config.src.template, ["cacheTemplates"]);
    gulp.watch(config.src.node, ["buildNode"]);
    gulp.watch(config.src.css, ["injectCSS"]);
  });

  module.exports = () => {
    gulp.run("default");
  };

})();
