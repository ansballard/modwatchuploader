api.$inject = ["$http"];

export default api;

function api($http) {
  // const url = "http://localhost:3001/";
  const url = "https://modwatchapi-ansballard.rhcloud.com/";
  return {
    getCurrentVersion() {
      return $http.get(`${url}api/script/version`);
      ;
    },
    getUserInfo(username) {
      return $http.get(`${url}api/user/${username}/profile`);
      ;
    },
    uploadMods(req) {
      return $http.post(`${url}loadorder`, req);
    }
  };
}
