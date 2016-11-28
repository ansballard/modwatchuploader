import { ipcRenderer as ipc } from "electron";

import changepassController from "./changepass/controller";
import changepassTemplate from "./changepass/template.html";

main.$inject = ["$scope", "$timeout", "$mdDialog", "$q", "Toast", "API", "State"];

export default main;

function main($scope, $timeout, $mdDialog, $q, Toast, API, State) {
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
  vm.games = [{
    display: "Skyrim SE",
    value: "skyrimse"
  }, {
    display: "Skyrim",
    value: "skyrim"
  }, {
    display: "Fallout 4",
    value: "fallout4"
  }];
  vm.currentTab = 0;
  vm.userInfo = {
    plugins: [],
    modlist: [],
    ini: [],
    prefsini: []
  };
  vm.getUserInfo = getUserInfo;
  vm.switchTabs = switchTabs;
  vm.uploadMods = uploadMods;
  vm.saveProfile = saveProfile;
  vm.changePass = changePass;

  $q.all([
    State.getCreds()
    .then(creds => {
      if(!creds.username || !creds.password) {
        throw {
          message: "No Local Profile Found"
        };
      }
      vm.userInfo.username = creds.username;
      vm.userInfo.password = creds.password;
      return creds.username;
    })
    .then(getUserInfo)
    .catch(e => {
      return;
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
    State.getNMMPaths({game: vm.userInfo.game}) // NMM Paths
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
        State.getNMMPluginsFile({
          filepath: paths[1].plugins || undefined,
          game: vm.userInfo.game
        }),
        State.getNMMIniFiles({
          filepath: paths[1].ini || undefined,
          game: vm.userInfo.game
        })
      ])
      .then(nmm => ({
        files: angular.extend({game: "skyrim"}, nmm[0].files, nmm[1].files)
      }))
      .then(nmm => {
        vm.userInfo = angular.extend({game: "skyrim"}, vm.userInfo, nmm.files, {modlist: undefined});
        vm.files = filesRead(vm.userInfo);
      })
    }
  })
  vm.mo.getFiles = function(p) {
    return State.getMOFiles(p)
    .then(mo => {
      vm.mo.filepath = mo.path;
      vm.userInfo = angular.extend({game: "skyrim"}, vm.userInfo, mo.files);
      vm.files = filesRead(vm.userInfo);
      return mo;
    });
  };
  vm.nmm.getPluginsFile = function() {
    return State.getNMMPluginsFile({game: vm.userInfo.game})
    .then(nmm => {
      vm.nmm.pluginsPath = nmm.path;
      vm.userInfo = angular.extend({}, vm.userInfo, nmm.files, {modlist: undefined});
      vm.files = filesRead(vm.userInfo);
    })
  };
  vm.nmm.getIniFiles = function() {
    return State.getNMMIniFiles({
      game: vm.userInfo.game
    })
    .then(nmm => {
      vm.nmm.iniPath = nmm.path;
      vm.userInfo = angular.extend({}, vm.userInfo, nmm.files, {modlist: undefined});
      vm.files = filesRead(vm.userInfo);
    })
  };

  // switchTabs(vm.currentTab);
  $scope.$watch("vm.currentTab", (newVal, oldVal) => {
    $timeout(() => {
      switchTabs(newVal);
    });

  });

  function getUserInfo(username) {
    return API.getUserInfo(username)
    .then(info => {
      vm.userInfo.enb = info.enb || undefined;
      vm.userInfo.tag = info.tag || undefined;
      vm.userInfo.game = info.game || undefined;
      return info;
    });
  }
  function saveProfile(program, skipToast = false) {
    if(vm.userInfo.username !== "" && vm.userInfo.password !== "") {
      State.saveProfile(angular.extend({
        program: program === 1 ? "NMM" : "MO",
        mo: vm.mo,
        nmm: vm.nmm
      }, vm.userInfo));
      if(!skipToast) {
         Toast.savedInfo();
       }
    }
  }
  function switchTabs(tab = 0) {
    if(tab === 0) {
      return State.getMOPath() // MO Path
      .then(p => {
        if(p) {
          return vm.mo.getFiles(p);
        }
      });
    } else {
      return State.getNMMPaths({game: vm.userInfo.game}) // NMM Paths
      .then(nmm => {
        if(nmm.ini) {
          vm.nmm.iniPath = nmm.ini;
        }
        if(nmm.plugins) {
          vm.nmm.pluginsPath = nmm.plugins;
        }
        return nmm;
      })
      .then(nmm => {
        if(nmm.ini && nmm.plugins) {
          return $q.all([
            State.getNMMPluginsFile({
              filepath: nmm.plugins || undefined,
              game: vm.userInfo.game
            }),
            State.getNMMIniFiles({
              filepath: nmm.ini || undefined,
              game: vm.userInfo.game
            })
          ])
          .then(nmm => ({
            files: angular.extend({}, nmm[0].files, nmm[1].files)
          }))
          .then(nmm => {
            vm.userInfo = angular.extend({game: "skyrim"}, vm.userInfo, nmm.files, {modlist: undefined});
            vm.files = filesRead(vm.userInfo);
            return nmm;
          })
        }
      });
    }
  }
  function uploadMods() {
    saveProfile(vm.currentTab, "skipToast");
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
  function changePass() {
    $mdDialog.show({
      controller: changepassController,
      controllerAs: "vm",
      bindToController: true,
      template: changepassTemplate,
      parent: angular.element(document.body),
      // targetEvent: ev,
      clickOutsideToClose:true
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
