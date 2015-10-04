(function() {
  "use strict";

  var argv = require("yargs").argv;

  var distFolder = "./dist/";
  var srcFolder = {
    "main": "./src/",
    "js": "./src/js/",
    "css": "./src/css/",
    "node": "./src/node/",
    "fonts": "./src/fonts/",
    "images": "./src/images/"
  };

  var dist = {
    "main": distFolder,
    "js": distFolder + "script.min.js",
    "template": "./tmp/templates/",
    "css": distFolder + "style.min.css",
    "node": "./",
    "fonts": "./public/fonts/",
    "images": "./public/images/",
    "inject": "./index.html",
    "module": "modwatchuploader"
  };

  var src = {
    "js": [
      srcFolder.js + "*.module.js",
      srcFolder.js + "**/*.module.js",
      srcFolder.js + "*.js",
      srcFolder.js + "**/*.js"
    ],
    "browserify": "./src/js/modwatchuploader.module.js",
    "template": [
      srcFolder.js + "*.template.html",
      srcFolder.js + "**/*.template.html"
    ],
    "css": [
      srcFolder.css + "*.css",
      srcFolder.css + "**/*.css"
    ],
    "node": [
      srcFolder.node + "*.js"
    ],
    "fonts": [
      srcFolder.fonts + "*.*"
    ],
    "images": [
      srcFolder.images + "*.*"
    ]
  };

  var deploy = {
    platform: argv.platform || "win32",
    arch: argv.arch || "ia32",
    version: argv.version || "0.32.2",
    ignore: [
      "node_modules",
      "gulpfile.js",
      "tasks",
      "gulpconfig.js",
      "legacy",
      "src"
    ]
  };

  var electronDeps = "var ipc = require(\"ipc\");var clipboard = require(\"clipboard\");"

  module.exports = {
    dist: dist,
    src: src,
    srcFolder: srcFolder,
    deploy: deploy,
    electronDeps: electronDeps
  };

})();
