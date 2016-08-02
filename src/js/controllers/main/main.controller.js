import { ipcRenderer as ipc } from "electron";

main.$inject = ["$scope", "$timeout", "$q", "Toast", "API", "State"];

export default main;

function main($scope, $timeout, $q, Toast, API, State) {
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
    plugins: [],
    modlist: [],
    ini: [],
    prefsini: []
  };
  vm.uploadMods = uploadMods;
  vm.saveUser = saveUser;

  $q.all([
    State.getCreds()
    .then(creds => {
      vm.userInfo.username = creds.username;
      vm.userInfo.password = creds.password;
      return creds.username;
    })
    .then(API.getUserInfo)
    .then(info => {
      vm.userInfo.enb = info.enb || undefined;
      vm.userInfo.tag = info.tag || undefined;
      vm.userInfo.game = info.game || undefined;
      return info;
    }),
    $q(resolve => {
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
  })
  .catch(e => {
    console.log("Initialization Error:", e);
    document.getElementById("loader-wrapper").innerHTML = `
      <h3>Hmmmmmm</h3><p>Something went wrong</p>
    `;
  });

  State.getProgram()
  .then(program => {
    vm.currentTab = program === "MO" ? 0 : 1;
    return vm.currentTab;
  })
  .then(() => $q.all([
    State.getMOPath() // MO Path
    .then(mo => {
      if(mo) {
        vm.mo.filepath = mo;
      }
      return mo;
    }),
    State.getNMMPaths() // NMM Paths
    .then(nmm => {
      if(nmm.ini) {
        vm.nmm.iniPath = nmm.ini;
      }
      if(nmm.plugins) {
        vm.nmm.pluginsPath = nmm.plugins;
      }
      return nmm;
    })
  ]))
  .then(paths => {
    if(vm.currentTab === 0 && paths[0]) {
      vm.mo.getFiles(paths[0]);
    } else if(vm.currentTab === 1 && paths[1].ini && paths[1].plugins) {
      $q.all([
        State.getNMMPluginsFile(paths[1].plugins || undefined),
        State.getNMMIniFiles(paths[1].ini || undefined)
      ])
      .then(nmm => ({
        files: angular.extend({}, nmm[0].files, nmm[1].files)
      }))
      .then(nmm => {
        vm.userInfo = angular.extend({}, vm.userInfo, nmm.files, {modlist: undefined});
        vm.files = filesRead(vm.userInfo);
      })
    }
  })
  vm.mo.getFiles = function(p) {
    return State.getMOFiles(p)
    .then(mo => {
      vm.mo.filepath = mo.path;
      vm.userInfo = angular.extend({}, vm.userInfo, mo.files);
      vm.files = filesRead(vm.userInfo);
    });
  };
  vm.nmm.getPluginsFile = function() {
    return State.getNMMPluginsFile()
    .then(nmm => {
      vm.nmm.pluginsPath = nmm.path;
      vm.userInfo = angular.extend({}, vm.userInfo, nmm.files, {modlist: undefined});
      vm.files = filesRead(vm.userInfo);
    })
  };
  vm.nmm.getIniFiles = function() {
    return State.getNMMIniFiles()
    .then(nmm => {
      vm.nmm.iniPath = nmm.path;
      vm.userInfo = angular.extend({}, vm.userInfo, nmm.files, {modlist: undefined});
      vm.files = filesRead(vm.userInfo);
    })
  };

  function saveUser(program) {
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
  function filesRead(info = {}) {
    const files = [];
    if(info.plugins && info.plugins.length > 0) {
      files.push({display: "plugins.txt", ref: "plugins"});
    }
    if(info.modlist && info.modlist.length > 0) {
      files.push({display: "modlist.txt", ref: "modlist"});
    }
    if(info.ini && info.ini.length > 0) {
      files.push({display: info.game + ".ini", ref: "ini"});
    }
    if(info.prefsini && info.prefsini.length > 0) {
      files.push({display: info.game + "prefs.ini", ref: "prefsini"});
    }
    return files;
  }
}
