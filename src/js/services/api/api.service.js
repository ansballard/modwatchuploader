api.$inject = ["$http"];

export default api;

function api($http) {
  const url = "http://localhost:3001/";
  // const url = "https://api.modwat.ch/";
  return {
    getCurrentVersion() {
      return $http.get(`${url}api/script/version`)
      .then(res => res.data);
    },
    getUserInfo(username) {
      return $http.get(`${url}api/user/${username}/profile`)
      .then(res => res.data);
    },
    uploadMods(req) {
      return $http.post(`${url}loadorder`, req);
    },
    changePass({username, password, newpassword}) {
      return $http.post(`${url}api/user/${username}/changepass`, {
        password,
        newpassword
      });
    },
    deleteProfile({username, password}) {
      return $http.post(`${url}api/user/${username}/delete`, {
        password
      });
    }
  };
}
