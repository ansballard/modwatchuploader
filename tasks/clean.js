(() => {
  "use strict";

  const gulp = require("gulp");
  const del = require("del");

  const config = require("../gulpconfig");

  gulp.task("cleanJS", () => {
    return del([config.dist.js, config.dist.js + ".map"]);
  });

  gulp.task("cleanSpecs", () => {
    return del([config.dist.specs]);
  });

  gulp.task("cleanNode", () => {
    return del(config.dist.node + "main.js");
  });

  gulp.task("cleanTemplate", () => {
    return del([config.dist.template + "*.js"]);
  });

  gulp.task("cleanCSS", () => {
    return del([config.dist.css]);
  });

})();
