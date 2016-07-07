import "angular";
import "angular-animate";
import "angular-aria";
import "angular-material";
import { ipcRenderer as ipc } from "electron";

(function() {
    angular.module("uploader", ["ngMaterial"])
    .controller("MainCtrl", ["$scope", "$mdToast", "AjaxService", function($scope, $mdToast, AjaxService) {
      $scope.scriptVersion = {
        local: "1.0",
        global: "0.26b"
      };
      $scope.mo = {
        filepath: undefined
      };
      $scope.nmm = {
        pluginsPath: undefined,
        iniPath: undefined
      };
      $scope.currentTab = 0;

      AjaxService.getCurrentVersion(
        function(res) {
          $scope.scriptVersion.global = res;
          if($scope.scriptVersion.local !== res) { // dev
            /*$mdToast.show({
              templateUrl: "versiontoast.html",
              hideDelay: 6000,
              position: "bottom right"
            });*/
          }
        },
        function(err) {
          $mdToast.show({
            templateUrl: "serverdowntoast.html",
            hideDelay: 6000,
            position: "bottom right"
          });
        }
      );
      $scope.userInfo = {
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
        $scope.currentTab = 1;
      }
      if($scope.currentTab === 0) {
        if(window.localStorage.getItem("modwatch.mo_filepath")) {
          $scope.mo.filepath = window.localStorage.getItem("modwatch.mo_filepath") || "";
          $scope.files = [];
          if($scope.mo.filepath !== "" && $scope.mo.filepath !== null) {
            ipc.send("mo.getFilesNoDialog", $scope.mo.filepath);
          }
        }
      } else {
        if(window.localStorage.getItem("modwatch.nmm_pluginsPath")) {
          $scope.nmm.pluginsPath = window.localStorage.getItem("modwatch.nmm_pluginsPath") || "";
          $scope.files = [];
          if($scope.mo.filepath !== "" && $scope.mo.filepath !== null) {
            ipc.send("nmm.getPluginsFileNoDialog", $scope.nmm.pluginsPath);
          }
        }
        if(window.localStorage.getItem("modwatch.nmm_iniPath")) {
          $scope.nmm.iniPath = window.localStorage.getItem("modwatch.nmm_iniPath") || "";
          $scope.files = [];
          if($scope.nmm.iniPath !== "" && $scope.mo.filepath !== null) {
            ipc.send("nmm.getIniFilesNoDialog", $scope.nmm.iniPath);
          }
        }
      }


      var getUserInfo = function getUserInfo(username) {
        if(username !== "") {
          AjaxService.getUserInfo(username,
            function(info) {
              $scope.userInfo.enb = info.enb;
              $scope.userInfo.tag = info.tag;
              $scope.userInfo.game = info.game || "skyrim";
            },
            function(err) {
              console.log(err);
            }
          );
        }
      };
      getUserInfo($scope.userInfo.username);
      $scope.mo.getFiles = function mo_getFiles() {
        ipc.send("mo.getFiles");
      };
      $scope.nmm.getPluginsFile = function nmm_getPluginsFile() {
        ipc.send("nmm.getPluginsFile");
      };
      $scope.nmm.getIniFiles = function nmm_getIniFiles() {
        ipc.send("nmm.getIniFiles");
      };
      ipc.on("mo.filepath", function(event, filepath) {
        $scope.mo.filepath = filepath || "";
      });
      ipc.on("nmm.pluginsFile", function(event, filepath) {
        $scope.nmm.pluginsPath = filepath || "";
      });
      ipc.on("nmm.iniFiles", function(event, filepath) {
        $scope.nmm.iniPath = filepath || "";
      });
      ipc.on("filesread", function(event, files) {
        files = JSON.parse(files);
        $scope.userInfo.plugins = typeof files.plugins !== "undefined" ? files.plugins : $scope.userInfo.plugins;
        $scope.userInfo.modlist = typeof files.modlist !== "undefined" ? files.modlist : $scope.userInfo.modlist;
        $scope.userInfo.ini = typeof files.ini !== "undefined" ? files.ini : $scope.userInfo.ini;
        $scope.userInfo.prefsini = typeof files.prefsini !== "undefined" ? files.prefsini : $scope.userInfo.prefsini;

        $scope.files = [];
        console.log($scope.userInfo);
        if($scope.userInfo.plugins.length > 0) {
          $scope.files.push({display: "plugins.txt", ref: "plugins"});
        }
        if($scope.userInfo.modlist.length > 0) {
          $scope.files.push({display: "modlist.txt", ref: "modlist"});
        }
        if($scope.userInfo.ini.length > 0) {
          $scope.files.push({display: $scope.userInfo.game + ".ini", ref: "ini"});
        }
        if($scope.userInfo.prefsini.length > 0) {
          $scope.files.push({display: $scope.userInfo.game + "prefs.ini", ref: "prefsini"});
        }
        $scope.$digest();
      });

      $scope.saveUser = function saveUser(program) {
        if($scope.userInfo.username !== "" && $scope.userInfo.password !== "") {
          window.localStorage.setItem("modwatch.username", $scope.userInfo.username);
          window.localStorage.setItem("modwatch.password", $scope.userInfo.password);
          window.localStorage.setItem("modwatch.mo_filepath", $scope.mo.filepath || "");
          window.localStorage.setItem("modwatch.nmm_pluginsPath", $scope.nmm.pluginsPath || "");
          window.localStorage.setItem("modwatch.nmm_iniPath", $scope.nmm.iniPath || "");
          window.localStorage.setItem("modwatch.program", program || "MO");
          $mdToast.show({
            templateUrl: "savedinfotoast.html",
            hideDelay: 3000,
            position: "bottom right"
          });
        }
      };

      $scope.uploadMods = function() {
        AjaxService.uploadMods($scope.userInfo)
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
    }])
    .factory("AjaxService", ["$http", function($http) {
      // const url = "http://localhost:3001/";
      const url = "https://modwatchapi-ansballard.rhcloud.com/";
      return {
        getCurrentVersion(success, error) {
          $http.get(`${url}api/script/version`)
            .success(success)
            .error(error)
          ;
        },
        getUserInfo(username, success, error) {
          $http.get(`${url}api/user/${username}/profile`)
            .success(success)
            .error(error)
          ;
        },
        uploadMods(json) {
          return $http.post(`${url}loadorder`, json);
        }
      }
    }]);
}());