import { app, ipcMain as ipc, dialog, BrowserWindow } from "electron";
import debug from "electron-debug";
import { join, dirname } from "path";
import { cleanFile, cleanArray, readFiles, nmmPluginsDefault, nmmIniDefault } from "./utils";

debug({enabled: true});
let mainWindow = null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  mainWindow = new BrowserWindow({width: 500, height: 600});

  mainWindow.loadURL(`file:///${join(dirname(process.mainModule.filename), "index.html")}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  function getFilesMO(filepath) {
    const fileDir = filepath || dirname(dialog.showOpenDialog({
      properties: ["openFile"],
      title: "Select your plugins.txt file in your MO profile directory"
    })[0]);

    return readFiles(fileDir, [
      "plugins.txt",
      "modlist.txt",
      "skyrim.ini",
      "skyrimprefs.ini"
    ])
    .then(rawFiles => ({
      plugins: rawFiles[0],
      modlist: rawFiles[1],
      ini: rawFiles[2],
      prefsini: rawFiles[3]
    }))
    .then(files => {
      mainWindow.webContents.send("mo.files", JSON.stringify({
        files,
        path: fileDir
      }));
      return files;
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
  }

  function getPluginsNMM(filepath, game = "skyrim") {
    const fileDir = filepath || dirname(dialog.showOpenDialog({
      defaultPath: nmmPluginsDefault(game),
      properties: ["openFile"],
      title: "Select your plugins.txt file"
    })[0]);
    return readFiles(fileDir, [
      "plugins.txt"
    ])
    .then(rawFiles => ({
      plugins: rawFiles[0]
    }))
    .then(files => {
      mainWindow.webContents.send("nmm.pluginsFile", JSON.stringify({
        files,
        path: fileDir
      }));
      return files;
    });
  }

  function getIniNMM(filepath, game = "skyrim") {
    let fileDir = filepath || dirname(dialog.showOpenDialog({
      defaultPath: nmmIniDefault(game),
      properties: ["openFile"],
      title: "Select one of your ini files"
    })[0]);
    return readFiles(fileDir, [
      "skyrim.ini",
      "skyrimprefs.ini"
    ])
    .then(rawFiles => ({
      ini: rawFiles[0],
      prefsini: rawFiles[1]
    }))
    .then(files => {
      mainWindow.webContents.send("nmm.iniFiles", JSON.stringify({
        files,
        path: fileDir
      }));
      return files;
    });
  }

  ipc.on("mo.getFiles", (event, filename) => {
    getFilesMO(filename || undefined);
  });
  ipc.on("nmm.getPluginsFile", (event, {filepath, game}) => {
    getPluginsNMM(filepath || undefined, game);
  });
  ipc.on("nmm.getIniFiles", (event, {filepath, game}) => {
    getIniNMM(filepath || undefined, game);
  });
});
