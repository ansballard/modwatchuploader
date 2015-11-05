APIService.$inject = ["$http"];

export default APIService;

function APIService($http) {

  return {
    getCurrentVersion: () => {
      return $http.get("https://modwatchapi-ansballard.rhcloud.com/api/script/version/3");
      //return $http.get("http://127.0.0.1:3001/api/script/version/3");
    },
    getUserInfo: (username) => {
      return $http.get("https://modwatchapi-ansballard.rhcloud.com/api/user/" + username + "/profile");
      //return $http.get("http://127.0.0.1:3001/api/user/" + username + "/profile");
    },
    uploadMods: (json) => {
      return $http.post("https://modwatchapi-ansballard.rhcloud.com/loadorder", json);
      //return $http.post("http://127.0.0.1:3001/loadorder", json);
    }
  };
}
