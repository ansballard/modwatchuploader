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
      mainWindow.webContents.send("filesread", JSON.stringify(files));
      mainWindow.webContents.send("mo.filepath", fileDir);
      return files;
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
  }

  function getPluginsNMM(filepath) {
    const fileDir = filepath || dirname(dialog.showOpenDialog({
      defaultPath: nmmPluginsDefault,
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
      mainWindow.webContents.send("filesread", JSON.stringify(files));
      mainWindow.webContents.send("nmm.pluginsFile", fileDir);
      return files;
    });
  }

  function getIniNMM(filepath) {
    let fileDir = filepath || dirname(dialog.showOpenDialog({
      defaultPath: nmmIniDefault,
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
      mainWindow.webContents.send("filesread", JSON.stringify(files));
      mainWindow.webContents.send("nmm.iniFiles", fileDir);
      return files;
    });
  }

  ipc.on("mo.getFiles", event => {
    getFilesMO();
  });
  ipc.on("nmm.getPluginsFile", event => {
    getPluginsNMM();
  });
  ipc.on("nmm.getIniFiles", event => {
    getIniNMM();
  });
  ipc.on("mo.getFilesNoDialog", (event, filename) => {
    getFilesMO(filename);
  });
  ipc.on("nmm.getPluginsFileNoDialog", (event, filename) => {
    getPluginsNMM(filename);
  });
  ipc.on("nmm.getIniFilesNoDialog", (event, filename) => {
    getIniNMM(filename);
  });
});
