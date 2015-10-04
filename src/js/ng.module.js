(function() {
    var app = angular.module("uploader", ["ngMaterial"]);

    app.controller("MainCtrl", ["$scope", "$mdToast", "AjaxService", function($scope, $mdToast, AjaxService) {
      $scope.scriptVersion = "0.3.1";
      $scope.mo = {
        filepath: undefined
      };
      $scope.nmm = {
        pluginsPath: undefined,
        iniPath: undefined
      };
      $scope.currentTab = 0;
      $scope.canUpload = function canUpload() {
        if($scope.userInfo.username === "" || $scope.userInfo.password === "") {
          return false;
        }
        if($scope.currentTab === 0) {
          if(typeof $scope.mo.filepath === "undefined") {
            return false;
          }
        } else {
          if(typeof $scope.nmm.pluginsPath === "undefined" || typeof $scope.nmm.iniPath === "undefined") {
            return false;
          }
        }
        return true;
      };

      AjaxService.getCurrentVersion(
        function(res) {
          if($scope.scriptVersion !== res) {
            $mdToast.show({
              templateUrl: "versiontoast.html",
              hideDelay: 6000,
              position: "bottom right"
            });
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
            ipc.send("mo.getFilesNoDialog", $scope.mo.filepath); // FilesService
          }
        }
      } else {
        if(window.localStorage.getItem("modwatch.nmm_pluginsPath")) {
          $scope.nmm.pluginsPath = window.localStorage.getItem("modwatch.nmm_pluginsPath") || "";
          $scope.files = [];
          if($scope.mo.filepath !== "" && $scope.mo.filepath !== null) {
            ipc.send("nmm.getPluginsFileNoDialog", $scope.nmm.pluginsPath); // FilesService
          }
        }
        if(window.localStorage.getItem("modwatch.nmm_iniPath")) {
          $scope.nmm.iniPath = window.localStorage.getItem("modwatch.nmm_iniPath") || "";
          $scope.files = [];
          if($scope.nmm.iniPath !== "" && $scope.mo.filepath !== null) {
            ipc.send("nmm.getIniFilesNoDialog", $scope.nmm.iniPath); // FilesService
          }
        }
      }

      var getUserInfo = function getUserInfo(username) {
        if(username !== "") {
          AjaxService.getUserInfo(username,
            function(info) {
              $scope.userInfo.enb = info.enb;
              $scope.userInfo.tag = info.tag;
              $scope.userInfo.game = info.game;
            },
            function(err) {
              console.log(err);
            }
          );
        }
      };
      getUserInfo($scope.userInfo.username);
      $scope.mo.getFiles = function mo_getFiles() { // FilesService
        ipc.send("mo.getFiles");
      };
      $scope.nmm.getPluginsFile = function nmm_getPluginsFile() { // FilesService
        ipc.send("nmm.getPluginsFile");
      };
      $scope.nmm.getIniFiles = function nmm_getIniFiles() { // FilesService
        ipc.send("nmm.getIniFiles");
      };
      ipc.on("mo.filepath", function(filepath) { // FilesService
        $scope.mo.filepath = filepath || "";
      });
      ipc.on("nmm.pluginsFile", function(filepath) { // FilesService
        $scope.nmm.pluginsPath = filepath || "";
      });
      ipc.on("nmm.iniFiles", function(filepath) { // FilesService
        $scope.nmm.iniPath = filepath || "";
      });
      ipc.on("filesread", function(files) { // FilesService
        files = JSON.parse(files);
        $scope.userInfo.plugins = typeof files.plugins !== "undefined" ? files.plugins : $scope.userInfo.plugins;
        $scope.userInfo.modlist = typeof files.modlist !== "undefined" ? files.modlist : $scope.userInfo.modlist;
        $scope.userInfo.ini = typeof files.ini !== "undefined" ? files.ini : $scope.userInfo.ini;
        $scope.userInfo.prefsini = typeof files.prefsini !== "undefined" ? files.prefsini : $scope.userInfo.prefsini;

        var tmp = [];
        if($scope.userInfo.plugins.length > 0) {
          tmp.push({display: "plugins.txt", ref: "plugins"});
        }
        if($scope.userInfo.modlist.length > 0) {
          tmp.push({display: "modlist.txt", ref: "modlist"});
        }
        if($scope.userInfo.ini.length > 0) {
          tmp.push({display: $scope.userInfo.game + ".ini", ref: "ini"});
        }
        if($scope.userInfo.prefsini.length > 0) {
          tmp.push({display: $scope.userInfo.game + "prefs.ini", ref: "prefsini"});
        }
        $scope.files = tmp;
        console.log($scope.files);
        $scope.$digest();
      });

      $scope.saveUser = function saveUser() {
        if($scope.userInfo.username !== "" && $scope.userInfo.password !== "") {
          var program = $scope.currentTab === 0 ? "MO" : "NMM";
          window.localStorage.setItem("modwatch.username", $scope.userInfo.username);
          window.localStorage.setItem("modwatch.password", $scope.userInfo.password);
          window.localStorage.setItem("modwatch.mo_filepath", $scope.mo.filepath || "");
          window.localStorage.setItem("modwatch.nmm_pluginsPath", $scope.nmm.pluginsPath || "");
          window.localStorage.setItem("modwatch.nmm_iniPath", $scope.nmm.iniPath || "");
          window.localStorage.setItem("modwatch.program", program);
          $mdToast.show(
            $mdToast.simple()
            .content("Login info saved successfully!")
            .hideDelay(3000)
            .position("bottom right")
          );
        }
      };

      $scope.uploadMods = function uploadMods() {
        AjaxService.uploadMods($scope.userInfo,
          function(res) {
            $mdToast.show(
              $mdToast.simple()
              .content("Mods uploaded successfully!")
              .hideDelay(3000)
              .position("bottom right")
            );
          }, function(err) {
            console.log(err.status);

            $mdToast.show(
              $mdToast.simple()
                .content("Upload failed")
                .hideDelay(6000)
                .position("bottom right")
            );
          }
        );
      };
    }])
    .factory("AjaxService", ["$http", function($http) {
      return {
        getCurrentVersion: function getCurrentVersion(success, error) {
          $http.get("http://modwatchapi-ansballard.rhcloud.com/api/script/version/3")
          //$http.get("http://127.0.0.1:3001/api/script/version/3")
            .success(success)
            .error(error)
          ;
        },
        getUserInfo: function getUserInfo(username, success, error) {
          $http.get("http://modwatchapi-ansballard.rhcloud.com/api/user/" + username + "/profile")
          //$http.get("http://127.0.0.1:3001/api/user/" + username + "/profile")
            .success(success)
            .error(error)
          ;
        },
        uploadMods: function uploadMods(json, success, error) {
          $http.post("http://modwatchapi-ansballard.rhcloud.com/loadorder", json)
          //$http.post("http://127.0.0.1:3001/loadorder", json)
            .success(success)
            .error(error)
          ;
        }
      }
    }]);
}());
