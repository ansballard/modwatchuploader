(() => {
  "use strict";

  const app = require("app");  // Module to control application life.
  const fs = require("fs");
  const ipc = require("ipc");
  const dialog = require("dialog");
  const BrowserWindow = require("browser-window");  // Module to create native browser window.

  // Report crashes to our server.
  //require("crash-reporter").start();

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is GCed.
  let mainWindow = null;

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != "darwin") {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on("ready", () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 500, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl("file://" + __dirname + "/index.html");

    // Open the devtools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    let jsonToSend = {};
    let mo = {};
    let nmm = {};

    mo.getFiles = (filepath) => {
      let files = {
        plugins: [],
        modlist: [],
        ini: [],
        prefsini: [],
        fileDir: ""
      };
      if(typeof filepath !== "undefined") {
        files.fileDir = filepath;
      } else {
        files.fileDir = dialog.showOpenDialog({
          properties: ["openDirectory"],
          title: "Find your mod profile folder"
        });
      }

      try {
        files.plugins = fs.readFileSync(files.fileDir + "/plugins.txt", "utf8").split("\r\n");
      }
      catch(e) {
        console.log("plugins read failed:", e);
      }
      try {
        files.modlist = fs.readFileSync(files.fileDir + "/modlist.txt", "utf8").split("\r\n");
      }
      catch(e) {
        console.log("plugins read failed:", e);
      }
      try {
        files.ini = fs.readFileSync(files.fileDir + "/skyrim.ini", "utf8").split("\r\n");
      }
      catch(e) {
        console.log("plugins read failed:", e);
      }
      try {
        files.prefsini = fs.readFileSync(files.fileDir + "/skyrimprefs.ini", "utf8").split("\r\n");
      }
      catch(e) {
        console.log("plugins read failed:", e);
      }

      cleanArray(files.plugins);
      cleanArray(files.modlist);
      cleanArray(files.ini);
      cleanArray(files.prefsini);

      mainWindow.webContents.send("filesread", JSON.stringify(files));
      mainWindow.webContents.send("mo.filepath", files.fileDir);
    };

    nmm.getPlugins = (filepath) => {
      let files = {
        plugins: [],
        modlist: [],
        fileDir: ""
      };
      if(typeof filepath !== "undefined") {
        files.fileDir = filepath;
      } else {
        files.fileDir = dialog.showOpenDialog({
          properties: ["openDirectory"],
          title: "Find your plugins.txt folder"
        });
      }

      try {
        files.plugins = fs.readFileSync(files.fileDir + "/plugins.txt", "utf8").split("\n");
      }
      catch(e) {
        console.log("plugins read failed:", e);
      }

      cleanArray(files.plugins);

      mainWindow.webContents.send("filesread", JSON.stringify(files));
      mainWindow.webContents.send("nmm.pluginsFile", files.fileDir);
    };

    nmm.getIni = (filepath) => {
      let files = {
        modlist: [],
        ini: [],
        prefsini: [],
        fileDir: ""
      };
      if(typeof filepath !== "undefined") {
        files.fileDir = filepath;
      } else {
        files.fileDir = dialog.showOpenDialog({
          properties: ["openDirectory"],
          title: "Find your .ini files"
        });
      }

      try {
        files.ini = fs.readFileSync(files.fileDir + "/skyrim.ini", "utf8").split("\n");
      }
      catch(e) {
        console.log("ini read failed:", e);
      }
      try {
        files.prefsini = fs.readFileSync(files.fileDir + "/skyrimprefs.ini", "utf8").split("\n");
      }
      catch(e) {
        console.log("prefsini read failed:", e);
      }

      cleanArray(files.ini);
      cleanArray(files.prefsini);

      mainWindow.webContents.send("filesread", JSON.stringify(files));
      mainWindow.webContents.send("nmm.iniFiles", files.fileDir);
    };

    ipc.on("mo.getFiles", (event) => {
      mo.getFiles();
    });
    ipc.on("nmm.getPluginsFile", (event) => {
      nmm.getPlugins();
    });
    ipc.on("nmm.getIniFiles", (event) => {
      nmm.getIni();
    });
    ipc.on("mo.getFilesNoDialog", (event, filename) => {
      mo.getFiles(filename);
    });
    ipc.on("nmm.getPluginsFileNoDialog", (event, filename) => {
      nmm.getPlugins(filename);
    });
    ipc.on("nmm.getIniFilesNoDialog", (event, filename) => {
      nmm.getIni(filename);
    });

    function cleanArray(arr) {
      if(typeof arr !== "undefined") {
        for(let i = 0; i < arr.length; i++) {
          if(arr[i] === "") {
            arr.splice(i, 1);
            i--;
          }
        }
      }
    }

  });
})();
