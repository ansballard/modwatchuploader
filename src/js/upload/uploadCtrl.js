UploadCtrl.$inject = ["$scope", "APIService", "AlertsService", "FilesService", "PersistenceService"];

export default UploadCtrl;

function UploadCtrl($scope, APIService, AlertsService, FilesService, PersistenceService) {
  let vm = this;

  vm.mo = {
    filepath: undefined
  };
  vm.nmm = {
    pluginsPath: undefined,
    iniPath: undefined
  };
  vm.currentTab = 0;
  vm.canUpload = () => {
    if (vm.userInfo.username === "" || vm.userInfo.password === "") {
      return false;
    }
    if (vm.currentTab === 0) {
      if (typeof vm.mo.filepath === "undefined") {
        return false;
      }
    } else {
      if (typeof vm.nmm.pluginsPath === "undefined" || typeof vm.nmm.iniPath === "undefined") {
        return false;
      }
    }
    return true;
  };

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
  if (window.localStorage.getItem("modwatch.program") === "NMM") {
    vm.currentTab = 1;
  }
  if (vm.currentTab === 0) {
    if (window.localStorage.getItem("modwatch.mo_filepath")) {
      vm.mo.filepath = window.localStorage.getItem("modwatch.mo_filepath") || "";
      vm.files = [];
      if (vm.mo.filepath !== "" && vm.mo.filepath !== null) {
        FilesService.getFiles.mo(vm.mo.filepath)
        ipc.send("mo.getFilesNoDialog", vm.mo.filepath); // FilesService
      }
    }
  } else {
    if (window.localStorage.getItem("modwatch.nmm_pluginsPath")) {
      vm.nmm.pluginsPath = window.localStorage.getItem("modwatch.nmm_pluginsPath") || "";
      vm.files = [];
      if (vm.mo.filepath !== "" && vm.mo.filepath !== null) {
        ipc.send("nmm.getPluginsFileNoDialog", vm.nmm.pluginsPath); // FilesService
      }
    }
    if (window.localStorage.getItem("modwatch.nmm_iniPath")) {
      vm.nmm.iniPath = window.localStorage.getItem("modwatch.nmm_iniPath") || "";
      vm.files = [];
      if (vm.nmm.iniPath !== "" && vm.mo.filepath !== null) {
        ipc.send("nmm.getIniFilesNoDialog", vm.nmm.iniPath); // FilesService
      }
    }
  }

  function getUserInfo(username) {
    if (username !== "") {
      APIService.getUserInfo(username).then(
        (info) => {
          vm.userInfo.enb = info.data.enb;
          vm.userInfo.tag = info.data.tag;
          vm.userInfo.game = info.data.game;
        }, (err) => {
          console.log(err);
        }
      );
    }
  }

  getUserInfo(vm.userInfo.username);
  vm.mo.getFiles = () => { // FilesService
    ipc.send("mo.getFiles");
  };
  vm.nmm.getPluginsFile = () => { // FilesService
    ipc.send("nmm.getPluginsFile");
  };
  vm.nmm.getIniFiles = () => { // FilesService
    ipc.send("nmm.getIniFiles");
  };
  ipc.on("mo.filepath", (filepath) => { // FilesService
    vm.mo.filepath = filepath || "";
  });
  ipc.on("nmm.pluginsFile", (filepath) => { // FilesService
    vm.nmm.pluginsPath = filepath || "";
  });
  ipc.on("nmm.iniFiles", (filepath) => { // FilesService
    vm.nmm.iniPath = filepath || "";
  });
  ipc.on("filesread", (files) => { // FilesService
    files = JSON.parse(files);
    vm.userInfo.plugins = typeof files.plugins !== "undefined" ? files.plugins : vm.userInfo.plugins;
    vm.userInfo.modlist = typeof files.modlist !== "undefined" ? files.modlist : vm.userInfo.modlist;
    vm.userInfo.ini = typeof files.ini !== "undefined" ? files.ini : vm.userInfo.ini;
    vm.userInfo.prefsini = typeof files.prefsini !== "undefined" ? files.prefsini : vm.userInfo.prefsini;

    let tmp = [];
    if (vm.userInfo.plugins.length > 0) {
      tmp.push({
        display: "plugins.txt",
        ref: "plugins"
      });
    }
    if (vm.userInfo.modlist.length > 0) {
      tmp.push({
        display: "modlist.txt",
        ref: "modlist"
      });
    }
    if (vm.userInfo.ini.length > 0) {
      tmp.push({
        display: vm.userInfo.game + ".ini",
        ref: "ini"
      });
    }
    if (vm.userInfo.prefsini.length > 0) {
      tmp.push({
        display: vm.userInfo.game + "prefs.ini",
        ref: "prefsini"
      });
    }
    $scope.$digest(() => {
      vm.files = tmp;
    });
  });

  vm.saveUser = () => {
    if (vm.canUpload()) {
      window.localStorage.setItem("modwatch.username", vm.userInfo.username);
      window.localStorage.setItem("modwatch.password", vm.userInfo.password);
      window.localStorage.setItem("modwatch.mo_filepath", vm.mo.filepath || "");
      window.localStorage.setItem("modwatch.nmm_pluginsPath", vm.nmm.pluginsPath || "");
      window.localStorage.setItem("modwatch.nmm_iniPath", vm.nmm.iniPath || "");
      window.localStorage.setItem("modwatch.program", vm.currentTab === 0 ? "MO" : "NMM");
      AlertsService.loginSuccess();
    } else {
      AlertsService.loginError();
    }
  };

  vm.uploadMods = () => {
    APIService.uploadMods(vm.userInfo).then(
      AlertsService.uploadSuccess,
      AlertsService.uploadError
    );
  };

}
