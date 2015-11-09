UploadCtrl.$inject = ["$scope", "$location", "APIService", "AlertsService", "FilesService", "PersistenceService"];

export default UploadCtrl;

function UploadCtrl($scope, $location, APIService, AlertsService, FilesService, PersistenceService) {
  let vm = this;

  vm.logOut = logOut;
  vm.profiles = PersistenceService.getProfiles();
  vm.profile = {mo: {}, nmm: {}};
  vm.user = PersistenceService.getUser();

  vm.switchProfile = switchProfile;
  vm.setGame = setGame;
  vm.setEnb = setEnb;
  vm.setTag = setTag;
  vm.setDefaultManager = setDefaultManager;
  vm.removeProfile = removeProfile;
  vm.games = [
    {
      "display": "Skyrim",
      "val": "skyrim"
    },
    {
      "display": "Fallout",
      "val": "fallout"
    }
  ];
  vm.view = {};
  vm.currentTab = (vm.profile.program) === "NMM" ? 1 : 0;
  vm.canUpload = () => {
    if(!vm.profile.game) {
      return false;
    }
    if (vm.currentTab === 0) {
      if (typeof vm.profile.mo.path === "undefined") {
        return false;
      }
    } else {
      if (typeof vm.profile.nmm.pluginsPath === "undefined" || (vm.profile.game !== "fallout" && typeof vm.profile.nmm.iniPath === "undefined")) {
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

  function readFiles(profile) {
    vm.files = [];
    if (profile.program === "MO") {
      if (profile.mo.path) {
        if (profile.mo.filepath !== "" && profile.mo.filepath !== null) {
          //FilesService.getFiles.mo(profile.mo.path)
          ipc.send("mo.getFilesNoDialog", profile.mo.path);
        }
      }
    } else {
      if (profile.nmm.pluginsPath) {
        if (profile.nmm.pluginsPath !== "" && profile.nmm.pluginsPath !== null) {
          ipc.send("nmm.getPluginsFileNoDialog", profile.nmm.pluginsPath);
        }
      }
      if (profile.nmm.iniPath) {
        if (profile.nmm.iniPathh !== "" && profile.nmm.iniPath !== null) {
          ipc.send("nmm.getIniFilesNoDialog", profile.nmm.iniPath);
        }
      }
    }
  }
  function logOut() {
    $location.path("login");
  }
  function switchProfile(profileName) {
    console.log("switchProfile");
    vm.profile = PersistenceService.switchProfile(profileName.trim());
    vm.view.game = vm.profile.game;
    vm.view.tag = vm.profile.tag;
    vm.view.enb = vm.profile.enb;
    vm.currentTab = (vm.profile.program) === "NMM" ? 1 : 0;
    readFiles(vm.profile);
  }
  function setGame(game) {
    vm.profile = PersistenceService.setGame(vm.view.currentProfile.trim(), game);
  }
  function setTag(tag) {
    vm.profile = PersistenceService.setTag(vm.view.currentProfile.trim(), tag);
  }
  function setEnb(enb) {
    vm.profile = PersistenceService.setEnb(vm.view.currentProfile.trim(), enb);
  }
  function setDefaultManager(acronym) {
    if(vm.view.currentProfile) {
      vm.profile = PersistenceService.setDefaultManager(vm.view.currentProfile.trim(), acronym);
    }
  }
  function removeProfile(profileName) {
    profileName = profileName.trim();
    return APIService.removeProfile(profileName, vm.user.password).then((res) => {
      console.log(res);
    }, (err) => {
      console.log(err);
    }).catch((e) => {
      console.log(e);
    });
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
  vm.mo = {};
  vm.nmm = {};
  vm.mo.getFiles = () => {
    ipc.send("mo.getFiles");
  };
  vm.nmm.getPluginsFile = () => {
    ipc.send("nmm.getPluginsFile");
  };
  vm.nmm.getIniFiles = () => {
    ipc.send("nmm.getIniFiles");
  };
  ipc.on("mo.filepath", (path) => {
    vm.profile = PersistenceService.setMOPath(vm.view.currentProfile.trim(), path || "");
  });
  ipc.on("nmm.pluginsFile", (path) => {
    vm.profile = PersistenceService.setNMMPluginsPath(vm.view.currentProfile.trim(), path || "");
  });
  ipc.on("nmm.iniFiles", (path) => {
    vm.profile = PersistenceService.setNMMIniPath(vm.view.currentProfile.trim(), path || "");
  });
  ipc.on("filesread", (files) => {
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
