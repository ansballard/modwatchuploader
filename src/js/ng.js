(function() {
    var ipc = require("ipc");
    var app = angular.module("uploader", ["ngMaterial"]);

    app.controller("MainCtrl", ["$scope", "$mdToast", "AjaxService", function($scope, $mdToast, AjaxService) {
      $scope.scriptVersion = {
        local: "1.0",
        global: "0.26b"
      };
      AjaxService.getCurrentVersion(
        function(res) {
          $scope.scriptVersion.global = res;
          if($scope.scriptVersion.local !== res) {
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
      $scope.filepath = window.localStorage.getItem("modwatch.filepath") || ""
      $scope.files = [];
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
      $scope.getFiles = function getFiles() {
        ipc.send("getFiles");
      }
      ipc.on("filepath", function(filepath) {
        window.localStorage.setItem("modwatch.filepath", filepath);
        $scope.filepath = filepath;
      });
      ipc.on("filesread", function(files) {
        files = JSON.parse(files);
        $scope.userInfo.plugins = files.plugins;
        $scope.userInfo.modlist = files.modlist;
        $scope.userInfo.ini = files.ini;
        $scope.userInfo.prefsini = files.prefsini;

        $scope.files = [];
        if(files.plugins.length > 0) {
          $scope.files.push({display: "plugins.txt", ref: "plugins"});
        }
        if(files.modlist.length > 0) {
          $scope.files.push({display: "modlist.txt", ref: "modlist"});
        }
        if(files.ini.length > 0) {
          $scope.files.push({display: $scope.userInfo.game + ".ini", ref: "ini"});
        }
        if(files.prefsini.length > 0) {
          $scope.files.push({display: $scope.userInfo.game + "prefs.ini", ref: "prefsini"});
        }
        console.log(files);
        $scope.$digest();
      });

      $scope.saveUser = function saveUser() {
        if($scope.userInfo.username !== "" && $scope.userInfo.password !== "") {
          window.localStorage.setItem("modwatch.username", $scope.userInfo.username);
          window.localStorage.setItem("modwatch.password", $scope.userInfo.password);
          getUserInfo($scope.userInfo.username);
        }
      };

      $scope.uploadMods = function uploadMods() {
        console.log($scope.userInfo);
        /*AjaxService.uploadMods($scope.userInfo,
          function(res) {
            $mdToast.show({
              templateUrl: "uploaddonetoast.html",
              hideDelay: 6000,
              position: "bottom right"
            });
          }, function(err) {
            $mdToast.show({
              templateUrl: "serverdowntoast.html",
              hideDelay: 6000,
              position: "bottom right"
            });
          }
        );*/
      };
    }])
    .factory("AjaxService", ["$http", function($http) {
      return {
        getCurrentVersion: function getCurrentVersion(success, error) {
          $http.get("http://modwatchapi-ansballard.rhcloud.com/api/script/version")
            .success(success)
            .error(error)
          ;
        },
        getUserInfo: function getUserInfo(username, success, error) {
          $http.get("http://modwatchapi-ansballard.rhcloud.com/api/user/" + username + "/profile")
            .success(success)
            .error(error)
          ;
        },
        uploadMods: function uploadMods(json, success, error) {
          $http.post("http://modwatchapi-ansballard.rhcloud.com/loadorder", json)
            .success(success)
            .error(error)
          ;
        }
      }
    }]);
}());

(function() {
  var ipc = require("ipc");
  ipc.on("ping", function(message) {
    console.log(message);  // Prints "whoooooooh!"
  });
  ipc.send("filepath", "path/to/file");
}());
