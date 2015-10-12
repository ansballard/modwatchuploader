(() => {
  "use strict";

  const argv = require("yargs").argv;

  const distFolder = "./dist/";
  const srcFolder = {
    "main": "./src/",
    "js": "./src/js/",
    "css": "./src/css/",
    "node": "./src/node/",
    "fonts": "./src/fonts/",
    "images": "./src/images/"
  };

  let dist = {
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

  let src = {
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

  let deploy = {
    platform: argv.platform || "win32",
    arch: argv.arch || "ia32",
    version: argv.version || "0.33.7",
    ignore: [
      "node_modules",
      "gulpfile.js",
      "tasks",
      "gulpconfig.js",
      "legacy",
      "src",
      "bower_components",
      "deploy",
      "ModwatchUploader-win32-ia32",
      "dist/script.min.js.map"
    ]
  };

  const electronModules = "var ipc = require(\"ipc\");var clipboard = require(\"clipboard\");";

  module.exports = {
    dist: dist,
    src: src,
    srcFolder: srcFolder,
    deploy: deploy,
    electronModules: electronModules
  };

})();
