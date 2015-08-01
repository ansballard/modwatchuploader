(function() {
    var ipc = require("ipc");
    var app = angular.module("uploader", []);

    app.controller("MainCtrl", ["$scope", "AjaxService", function($scope, AjaxService) {
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
      ipc.on("filesread", function(files) {
        files = JSON.parse(files);
        $scope.userInfo.plugins = files.plugins;
        $scope.userInfo.modlist = files.modlist;
        $scope.userInfo.ini = files.ini;
        $scope.userInfo.prefsini = files.prefsini;
        console.log($scope.userInfo);
      });

      $scope.saveUser = function saveUser() {
        if($scope.userInfo.username !== "" && $scope.userInfo.password !== "") {
          window.localStorage.setItem("modwatch.username", $scope.userInfo.username);
          window.localStorage.setItem("modwatch.password", $scope.userInfo.password);
          getUserInfo($scope.userInfo.username);
        }
      };

      $scope.uploadMods = function uploadMods() {
        AjaxService.uploadMods($scope.userInfo,
          function(res) {
            console.log(res)
          }, function(err) {
            console.log(err);
          }
        );
      };
    }])
    .factory("AjaxService", ["$http", function($http) {
      return {
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
