#!/usr/bin/env node

const packager = require("electron-packager");
const installer = require("electron-installer-windows");
const pkg = require("../package.json");

const opts = {
  packagedDirectory: "./packaged",
  fullPackagedDirectory: `${packagedDirectory}/Modwatch-win32-x86`,
  installerDirectory: "./installer"
};

new Promise((resolve, reject) => {
  packager({
    arch: "ia32",
    dir: "./",
    ignore: "node_modules|src|packaged|scripts",
    platform: "win32",
    asar: true,
    name: "Modwatch",
    out: "./packaged",
    overwrite: true,
    prune: true,
    version: pkg.devDependencies["electron-prebuilt"],
    "version-string": {
      CompanyName: "Modwatch",
      FileDescription: "A simple uploader for modwat.ch",
      OriginalFilename: "Modwatch.exe",
      ProductName: "Modwatch",
      InternalName: "Modwatch"
    }
  }, (err, paths) => {
    if(err) {
      reject(err);
    } else {
      resolve(paths);
    }
  });
})
.then(paths => new Promise((resolve, reject) => {
  installer({
    src: opts.fullPackagedDirectory,
    dest: opts.installerDirectory
  }, err => {
    if(err) {
      reject(err);
    } else {
      resolve();
    }
  })
}))
.then(() => {
  console.log("Installer Built!");
  process.exit(1);
})
.catch(e => {
  console.err("Package Generation Failed");
  console.err(e);
});
