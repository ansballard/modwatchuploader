var app = require('app');  // Module to control application life.
var fs = require("fs");
var ipc = require("ipc");
var dialog = require('dialog');
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Function to clean file arrays before posting them
var cleanArray = function cleanArray(arr) {
  if(typeof arr !== "undefined") {
    for(var i = 0; i < arr.length; i++) {
      if(arr[i] === "") {
        arr.splice(i, 1);
        i--;
      }
    }
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 500, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  var jsonToSend = {};
  var mo = {};
  var nmm = {};

  mo.getFiles = function mo_getFiles(filepath) {
    var files = {
      plugins: [],
      modlist: [],
      ini: [],
      prefsini: []
    };
    var fileDir = "";
    if(typeof filepath !== "undefined") {
      fileDir = filepath;
    } else {
      fileDir = dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Find your mod profile folder"
      });
    }

    try {
      files.plugins = fs.readFileSync(fileDir + "/plugins.txt", "utf8").split("\r\n");
    }
    catch(e) {
      console.log("plugins read failed:", e);
    }
    try {
      files.modlist = fs.readFileSync(fileDir + "/modlist.txt", "utf8").split("\r\n");
    }
    catch(e) {
      console.log("plugins read failed:", e);
    }
    try {
      files.ini = fs.readFileSync(fileDir + "/skyrim.ini", "utf8").split("\r\n");
    }
    catch(e) {
      console.log("plugins read failed:", e);
    }
    try {
      files.prefsini = fs.readFileSync(fileDir + "/skyrimprefs.ini", "utf8").split("\r\n");
    }
    catch(e) {
      console.log("plugins read failed:", e);
    }

    cleanArray(files.plugins);
    cleanArray(files.modlist);
    cleanArray(files.ini);
    cleanArray(files.prefsini);

    mainWindow.webContents.send("filesread", JSON.stringify(files));
    mainWindow.webContents.send("mo.filepath", fileDir);
  };

  nmm.getPlugins = function nmm_getPlugins(filepath) {
    var files = {
      plugins: [],
      modlist: []
    };
    var fileDir = "";
    if(typeof filepath !== "undefined") {
      fileDir = filepath;
    } else {
      fileDir = dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Find your plugins.txt folder"
      });
    }

    try {
      files.plugins = fs.readFileSync(fileDir + "/plugins.txt", "utf8").split("\n");
    }
    catch(e) {
      console.log("plugins read failed:", e);
    }

    cleanArray(files.plugins);

    mainWindow.webContents.send("filesread", JSON.stringify(files));
    mainWindow.webContents.send("nmm.pluginsFile", fileDir);
  };

  nmm.getIni = function nmm_getIni(filepath) {
    var files = {
      modlist: [],
      ini: [],
      prefsini: []
    };
    var fileDir = "";
    if(typeof filepath !== "undefined") {
      fileDir = filepath;
    } else {
      fileDir = dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Find your .ini files"
      });
    }

    try {
      files.ini = fs.readFileSync(fileDir + "/skyrim.ini", "utf8").split("\n");
    }
    catch(e) {
      console.log("ini read failed:", e);
    }
    try {
      files.prefsini = fs.readFileSync(fileDir + "/skyrimprefs.ini", "utf8").split("\n");
    }
    catch(e) {
      console.log("prefsini read failed:", e);
    }

    cleanArray(files.ini);
    cleanArray(files.prefsini);

    mainWindow.webContents.send("filesread", JSON.stringify(files));
    mainWindow.webContents.send("nmm.iniFiles", fileDir);
  };

  ipc.on("mo.getFiles", function(event) {
    mo.getFiles();
  });
  ipc.on("nmm.getPluginsFile", function(event) {
    nmm.getPlugins();
  });
  ipc.on("nmm.getIniFiles", function(event) {
    nmm.getIni();
  });
  ipc.on("mo.getFilesNoDialog", function(event, filename) {
    mo.getFiles(filename);
  });
  ipc.on("nmm.getPluginsFileNoDialog", function(event, filename) {
    nmm.getPlugins(filename);
  });
  ipc.on("nmm.getIniFilesNoDialog", function(event, filename) {
    nmm.getIni(filename);
  });

});
