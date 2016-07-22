import { app, ipcMain as ipc, dialog, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import debug from "electron-debug";
import { join } from "path";
import { cleanFile, cleanArray, readFiles } from "./utils";

debug();
let mainWindow = null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", () => {
  mainWindow = new BrowserWindow({width: 500, height: 600});

  try {
    mainWindow.loadURL(`file://${join(process.cwd(), "index.html")}`);
  } catch(e) {
    mainWindow.loadURL(`file://${__dirname}/../../index.html`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  function getFilesMO(filepath) {
    const fileDir = filepath || dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Find your mod profile folder"
    })[0];

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
    const fileDir = filepath || dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Find your plugins.txt folder"
    })[0];
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
    let fileDir = filepath || dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Find your .ini files"
    })[0];
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
