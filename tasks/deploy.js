(function() {
  "use strict";

  var gulp = require("gulp");
  var childProcess = require("child_process");

  var config = require("../gulpconfig");

  gulp.task("deploy", ["default"], function(cb) {
    var toExec = "electron-packager ./ ModwatchUploader --arch=" + config.deploy.arch + " --platform=" + config.deploy.platform + " --version=" + config.deploy.version + " --asar=1 --overwrite=1 ";
    toExec += config.deploy.ignore[0];
    for(var i = 1; i < config.deploy.ignore.length; i++) {
      toExec += "|" + config.deploy.ignore[i]
    }
    childProcess.exec(toExec, function(err, stdout, stderr) {
      if(!err) {
        console.log("Deploy Successful");
      }
    });
  });

})();
