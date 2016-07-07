import { readFile } from "fs";
import { join } from "path";
import denodeify from "denodeify";

const readFileAsync = denodeify(readFile);

export function cleanFile(file) {
  return file ? file.split("\r\n")
  .join("\n")
  .split("\n")
  .filter(line => line.trim() !== "")
  .filter(line => line.indexOf("#") !== 0)
  .map(line => line
    .replace(/\\/g, "\\")
    .replace(/"/g, "\"")
  ) : [];
}

export function cleanArray(arr) {
  if(typeof arr !== "undefined") {
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] === "") {
        arr.splice(i, 1);
        i--;
      }
    }
  }
}

export function readFiles(fileDir, filenames) {
  return Promise.all(
    filenames.map(filename =>
      readFileAsync(join(fileDir, filename), "utf8")
      .catch(e => {
        console.log(`${filename} read failed`);
        return undefined;
      })
    )
  )
  .then(rawFiles => rawFiles.map(cleanFile));
}
