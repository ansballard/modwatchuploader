FilesService.$inject = [];

export default FilesService;

function FilesService() {
  return {

  };
}

/*
$scope.mo.getFiles = function mo_getFiles() {
  ipc.send("mo.getFiles");
};
$scope.nmm.getPluginsFile = function nmm_getPluginsFile() {
  ipc.send("nmm.getPluginsFile");
};
$scope.nmm.getIniFiles = function nmm_getIniFiles() {
  ipc.send("nmm.getIniFiles");
};
ipc.on("mo.filepath", function(filepath) {
  $scope.mo.filepath = filepath || "";
});
ipc.on("nmm.pluginsFile", function(filepath) {
  $scope.nmm.pluginsPath = filepath || "";
});
ipc.on("nmm.iniFiles", function(filepath) {
  $scope.nmm.iniPath = filepath || "";
});
ipc.on("filesread", function(files) {
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
*/
