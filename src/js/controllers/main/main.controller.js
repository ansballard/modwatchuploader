import { ipcRenderer as ipc } from "electron";

main.$inject = ["$scope", "$mdToast", "API"];

export default main;

function main($scope, $mdToast, API) {

  const vm = this;

  vm.scriptVersion = {
    local: "1.0",
    global: "0.26b"
  };
  vm.mo = {
    filepath: undefined
  };
  vm.nmm = {
    pluginsPath: undefined,
    iniPath: undefined
  };
  vm.currentTab = 0;

  API.getCurrentVersion()
  .then(res => {
    vm.scriptVersion.global = res;
    if(vm.scriptVersion.local !== res) { // dev
      /*$mdToast.show({
        templateUrl: "versiontoast.html",
        hideDelay: 6000,
        position: "bottom right"
      });*/
    }
  })
  .catch(err => {
    $mdToast.show({
      templateUrl: "serverdowntoast.html",
      hideDelay: 6000,
      position: "bottom right"
    });
  });
  vm.userInfo = {
    username: window.localStorage.getItem("modwatch.username") || "",
    password: window.localStorage.getItem("modwatch.password") || "",
    enb: "",
    tag: "",
    game: "skyrim",
    plugins: [],
    modlist: [],
    ini: [],
    prefsini: []
  };
  if(window.localStorage.getItem("modwatch.program") === "NMM") {
    vm.currentTab = 1;
  }
  if(vm.currentTab === 0) {
    if(window.localStorage.getItem("modwatch.mo_filepath")) {
      vm.mo.filepath = window.localStorage.getItem("modwatch.mo_filepath") || "";
      vm.files = [];
      if(vm.mo.filepath !== "" && vm.mo.filepath !== null) {
        ipc.send("mo.getFilesNoDialog", vm.mo.filepath);
      }
    }
  } else {
    if(window.localStorage.getItem("modwatch.nmm_pluginsPath")) {
      vm.nmm.pluginsPath = window.localStorage.getItem("modwatch.nmm_pluginsPath") || "";
      vm.files = [];
      if(vm.mo.filepath !== "" && vm.mo.filepath !== null) {
        ipc.send("nmm.getPluginsFileNoDialog", vm.nmm.pluginsPath);
      }
    }
    if(window.localStorage.getItem("modwatch.nmm_iniPath")) {
      vm.nmm.iniPath = window.localStorage.getItem("modwatch.nmm_iniPath") || "";
      vm.files = [];
      if(vm.nmm.iniPath !== "" && vm.mo.filepath !== null) {
        ipc.send("nmm.getIniFilesNoDialog", vm.nmm.iniPath);
      }
    }
  }


  var getUserInfo = function getUserInfo(username) {
    if(username !== "") {
      API.getUserInfo(username)
      .then(info => {
        vm.userInfo.enb = info.enb;
        vm.userInfo.tag = info.tag;
        vm.userInfo.game = info.game || "skyrim";
      })
      .catch(err => {
        console.log(err);
      });
    }
  };
  getUserInfo(vm.userInfo.username);
  vm.mo.getFiles = function mo_getFiles() {
    ipc.send("mo.getFiles");
  };
  vm.nmm.getPluginsFile = function nmm_getPluginsFile() {
    ipc.send("nmm.getPluginsFile");
  };
  vm.nmm.getIniFiles = function nmm_getIniFiles() {
    ipc.send("nmm.getIniFiles");
  };
  ipc.on("mo.filepath", function(event, filepath) {
    vm.mo.filepath = filepath || "";
  });
  ipc.on("nmm.pluginsFile", function(event, filepath) {
    vm.nmm.pluginsPath = filepath || "";
  });
  ipc.on("nmm.iniFiles", function(event, filepath) {
    vm.nmm.iniPath = filepath || "";
  });
  ipc.on("filesread", function(event, files) {
    files = JSON.parse(files);
    vm.userInfo.plugins = typeof files.plugins !== "undefined" ? files.plugins : vm.userInfo.plugins;
    vm.userInfo.modlist = typeof files.modlist !== "undefined" ? files.modlist : vm.userInfo.modlist;
    vm.userInfo.ini = typeof files.ini !== "undefined" ? files.ini : vm.userInfo.ini;
    vm.userInfo.prefsini = typeof files.prefsini !== "undefined" ? files.prefsini : vm.userInfo.prefsini;

    vm.files = [];
    console.log(vm.userInfo);
    if(vm.userInfo.plugins.length > 0) {
      vm.files.push({display: "plugins.txt", ref: "plugins"});
    }
    if(vm.userInfo.modlist.length > 0) {
      vm.files.push({display: "modlist.txt", ref: "modlist"});
    }
    if(vm.userInfo.ini.length > 0) {
      vm.files.push({display: vm.userInfo.game + ".ini", ref: "ini"});
    }
    if(vm.userInfo.prefsini.length > 0) {
      vm.files.push({display: vm.userInfo.game + "prefs.ini", ref: "prefsini"});
    }
    $scope.$digest();
  });

  vm.saveUser = function saveUser(program) {
    if(vm.userInfo.username !== "" && vm.userInfo.password !== "") {
      window.localStorage.setItem("modwatch.username", vm.userInfo.username);
      window.localStorage.setItem("modwatch.password", vm.userInfo.password);
      window.localStorage.setItem("modwatch.mo_filepath", vm.mo.filepath || "");
      window.localStorage.setItem("modwatch.nmm_pluginsPath", vm.nmm.pluginsPath || "");
      window.localStorage.setItem("modwatch.nmm_iniPath", vm.nmm.iniPath || "");
      window.localStorage.setItem("modwatch.program", program || "MO");
      $mdToast.show({
        templateUrl: "savedinfotoast.html",
        hideDelay: 3000,
        position: "bottom right"
      });
    }
  };

  vm.uploadMods = function() {
    API.uploadMods(vm.userInfo)
    .then(res => {
      $mdToast.show({
        templateUrl: "uploaddonetoast.html",
        hideDelay: 6000,
        position: "bottom right"
      });
    })
    .catch(err => {
      $mdToast.show({
        templateUrl: err.status === 403 ? "badpasswordtoast.html" : "serverdowntoast.html",
        hideDelay: 6000,
        position: "bottom right"
      });
    });
  };
}
