import { ipcRenderer as ipc } from "electron";

main.$inject = ["$scope", "$timeout", "Toast", "API", "State"];

export default main;

function main($scope, $timeout, Toast, API, State) {

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
  vm.uploadMods = uploadMods;
  vm.saveUser = saveUser;

  Promise.all([
    API.getCurrentVersion()
    .catch(err => {
      Toast.serverDown();
    }),
    getUserInfo(vm.userInfo.username),
    new Promise(resolve => {
      $timeout(resolve, 1500);
    })
  ])
  .then(() => {
    document.getElementById("loader-wrapper").remove();
    return State.isFirstTime();
  })
  .then(isFirstTime => {
    if(isFirstTime) {
      Toast.debughelper();
      State.disableFirstTime();
    }
  });

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
  vm.mo.getFiles = function() {
    ipc.send("mo.getFiles");
  };
  vm.nmm.getPluginsFile = function() {
    ipc.send("nmm.getPluginsFile");
  };
  vm.nmm.getIniFiles = function() {
    ipc.send("nmm.getIniFiles");
  };
  ipc.on("mo.filepath", (event, filepath) => {
    vm.mo.filepath = filepath || "";
    $scope.$digest();
  });
  ipc.on("nmm.pluginsFile", (event, filepath) => {
    vm.nmm.pluginsPath = filepath || "";
    $scope.$digest();
  });
  ipc.on("nmm.iniFiles", (event, filepath) => {
    vm.nmm.iniPath = filepath || "";
    $scope.$digest();
  });
  ipc.on("filesread", (event, files) => {
    files = JSON.parse(files);
    vm.userInfo.plugins = typeof files.plugins !== "undefined" ? files.plugins : vm.userInfo.plugins;
    vm.userInfo.modlist = typeof files.modlist !== "undefined" ? files.modlist : vm.userInfo.modlist;
    vm.userInfo.ini = typeof files.ini !== "undefined" ? files.ini : vm.userInfo.ini;
    vm.userInfo.prefsini = typeof files.prefsini !== "undefined" ? files.prefsini : vm.userInfo.prefsini;

    vm.files = [];
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

  function saveUser(program) {
    console.log(program);
    if(vm.userInfo.username !== "" && vm.userInfo.password !== "") {
      window.localStorage.setItem("modwatch.username", vm.userInfo.username);
      window.localStorage.setItem("modwatch.password", vm.userInfo.password);
      window.localStorage.setItem("modwatch.mo_filepath", vm.mo.filepath || "");
      window.localStorage.setItem("modwatch.nmm_pluginsPath", vm.nmm.pluginsPath || "");
      window.localStorage.setItem("modwatch.nmm_iniPath", vm.nmm.iniPath || "");
      window.localStorage.setItem("modwatch.program", program || "MO");
      Toast.savedInfo();
    }
  }
  function uploadMods() {
    if(vm.currentTab === 1) {
      vm.userInfo.modlist = undefined;
    }
    console.log(vm.userInfo);
    API.uploadMods(vm.userInfo)
    .then(res => {
      Toast.uploadDone();
    })
    .catch(err => {
      if(err.status === 403) {
        Toast.badPassword();
      } else {
        Toast.serverDown();
      }
    });
  }
  function getUserInfo(username) {
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
  }
}
