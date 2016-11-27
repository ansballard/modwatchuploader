#!/usr/bin/env node

const packager = require("electron-packager");
const pkg = require("../package.json");

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
    console.log(err);
  }
});
