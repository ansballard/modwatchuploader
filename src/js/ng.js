(function() {
    var ipc = require("ipc");
    var app = angular.module("uploader", []);

    app.controller("MainCtrl", ["$scope", "AjaxService", function($scope, AjaxService) {
      $scope.userInfo = {
        username: window.localStorage.getItem("modwatch.username") || "",
        password: window.localStorage.getItem("modwatch.password") || "",
        enb: "",
        tag: "",
        game: "skyrim"
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
        ipc.send("getFiles", "");
      }

      $scope.files = [
        {
          filename: "plugins",
          data: []
        },
        {
          filename: "modlist",
          data: []
        },
        {
          filename: "ini",
          data: []
        },
        {
          filename: "prefsini",
          data: []
        },
        {
          filename: "skse",
          data: []
        },
        {
          filename: "enblocal",
          data: []
        }
      ];

      $scope.saveUser = function saveUser() {
        if($scope.userInfo.username !== "" && $scope.userInfo.password !== "") {
          window.localStorage.setItem("modwatch.username", $scope.userInfo.username);
          window.localStorage.setItem("modwatch.password", $scope.userInfo.password);
          getUserInfo($scope.userInfo.username);
        }
      };
    }])
    .factory("AjaxService", ["$http", function($http) {
      return {
        getUserInfo: function getUserInfo(username, success, error) {
          $http.get("http://modwatchapi-ansballard.rhcloud.com/api/user/" + username + "/profile")
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
