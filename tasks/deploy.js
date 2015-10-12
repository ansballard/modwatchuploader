(() => {
  "use strict";

  const gulp = require("gulp");
  const childProcess = require("child_process");

  const config = require("../gulpconfig");

  gulp.task("deploy", ["default"], (cb) => {
    let toExec = "electron-packager ./ ModwatchUploader --out=deploy --arch=" + config.deploy.arch + " --platform=" + config.deploy.platform + " --version=" + config.deploy.version + " --asar=1 --overwrite=1 ";
    toExec += "--ignore=\"" + config.deploy.ignore[0];
    for(let i = 1; i < config.deploy.ignore.length; i++) {
      toExec += "|" + config.deploy.ignore[i];
    }
    toExec += "\"";
    childProcess.exec(toExec, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if(!err) {
        console.log("Deploy Successful");
      } else {
        console.log(err);
      }
    });
  });

})();
