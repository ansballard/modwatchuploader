APIService.$inject = ["$http"];

export default APIService;

function APIService($http) {

  return {
    getCurrentVersion() {
      return $http.get("https://modwatchapi-ansballard.rhcloud.com/api/script/version/3");
      //return $http.get("http://127.0.0.1:3001/api/script/version/3");
    },
    getUserInfo(username) {
      return $http.get("https://modwatchapi-ansballard.rhcloud.com/api/user/" + username + "/profile");
      //return $http.get("http://127.0.0.1:3001/api/user/" + username + "/profile");
    },
    uploadMods(json) {
      return $http.post("https://modwatchapi-ansballard.rhcloud.com/loadorder", json);
      //return $http.post("http://127.0.0.1:3001/loadorder", json);
    },
    getLastUploaderCommits(numberToReturn) {
      return $http.get("https://api.github.com/repos/ansballard/modwatchuploader/commits")
        .then((commits) => {
          return commits.data.slice(0, numberToReturn).map((data) => {
            data.commit.url = data.html_url;
            return data.commit;
          });
        })
      ;
    },
    createUser(json) {
      return $http.post("https://modwatchapi-ansballard.rhcloud.com/loadorder", json);
      //return $http.post("http://127.0.0.1:3001/loadorder", json);
    },
    authenticateUser(username, password) {
      return $http.post("https://modwatchapi-ansballard.rhcloud.com/auth/signin",
        {username: username, password: password}
      );
      //return $http.post("http://127.0.0.1:3001/loadorder", json);
    },
    removeProfile(profilename, password) {
      //return $http.post("https://modwatchapi-ansballard.rhcloud.com/api/user/" + profilename, {password: password});return $http.post("https://modwatchapi-ansballard.rhcloud.com/api/user/" + profilename, {password: password});
      return $http.post("http://127.0.0.1:3001/auth/remove/" + profilename, {password: password});
    }
  };
}
