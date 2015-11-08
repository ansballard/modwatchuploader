LoginCtrl.$inject = ["$q", "$location", "Constants", "APIService", "AlertsService", "PersistenceService"];

export default LoginCtrl;

function LoginCtrl($q, $location, Constants, APIService, AlertsService, PersistenceService) {

  const vm = this;

  vm.createAccount = createAccount;
  vm.logIn = logIn;
  vm.login = PersistenceService.getUser();
  vm.create = {
    "username": "",
    "password": ""
  };
  vm.canLogin = canLogin;
  vm.canCreate = canCreate;
  vm.checkUsernameCreate = checkUsernameCreate;
  vm.checkUsernameLogin = checkUsernameLogin;
  vm.goToUrl = goToUrl;
  vm.lastCommits = [];
  getLastCommits(1);
  APIService.getCurrentVersion().then(
    (res) => {
      if (Constants.version !== res) {
        AlertsService.badVersion();
      }
    },
    AlertsService.serverDown
  );

  function createAccount() {
    if(canCreate()) {
      checkUsernameCreate(vm.create.username).then((valid) => {
        if(valid) {
          APIService.uploadMods({username: vm.create.username, password: vm.create.password}).then((res) => {
            AlertsService.show(vm.create.username + " Created!");
            PersistenceService.saveUser(vm.login.username, vm.login.pass);
            $location.path("upload");
          });
        }
      });
    } else {
      AlertsService.show("Cannot Create " + user.username);
    }
  }
  function logIn() {
    checkUsernameLogin(vm.login.username).then((isValid) => {
      if(isValid) {
        APIService.authenticateUser(vm.login.username, vm.login.password).then((token) => {
          AlertsService.show("Logged in!");
          PersistenceService.saveUser(vm.login.username, vm.login.pass);
          $location.path("upload");
        }, (err) => {
          console.log(err);
          AlertsService.show("Login Failed");
        }).catch((e) => {
          console.log(e);
          AlertsService.show("Server Error");
        });
      }
    });
  }
  function goToUrl(url) {
    shell.openExternal(url);
  }
  function checkUsernameCreate(username) {
    if(typeof username !== "undefined") {
      if(usernameRegex(username)) {
        return APIService.getUserInfo(username).then((user) => {
          if(user.data && user.data.timestamp) {
            AlertsService.show(username + " is Taken");
            return false;
          } else {
            AlertsService.show(username + " is Available");
            return true;
          }
        }, (err) => {
          if(err.status === 404) {
            AlertsService.show(username + " is Available");
            return true;
          } else {
            AlertsService.show("Server Error, Account Not Created");
            return false;
          }

        });
      } else {
        AlertsService.show("Username must only contain letters, numbers, dashes, and underscores");
        var deferred = $q.defer();
        deferred.resolve(false);
        return deferred.promise;
      }
    } else {
      var deferred = $q.defer();
      deferred.resolve(false);
      return deferred.promise;
    }
  }
  function checkUsernameLogin(username) {
    if(typeof username !== "undefined") {
      return APIService.getUserInfo(username).then((user) => {
        if(user.data && user.data.timestamp) {
          return true;
        }
        else {
          AlertsService.show(username + " Does Not Exist");
          return false;
        }
      }, (err) => {
        AlertsService.show(username + " Does Not Exist");
        return false;
      });
    } else {
      var deferred = $q.defer();
      deferred.resolve(false);
      return deferred.promise;
    }
  }
  function canLogin() {
    return vm.login.username && vm.login.password && vm.login.username.length > 0 && vm.login.password.length > 0;
  }
  function canCreate() {
    return vm.create.username && vm.create.password && usernameRegex(vm.create.username) && vm.create.password.length > 0;
  }
  function usernameRegex(username) {
    return typeof username === "undefined" || (/^[a-zA-Z0-9_-]+$/).test(username);
  }
  function getLastCommits(numberOfCommits) {
    APIService.getLastUploaderCommits(numberOfCommits)
      .then((commits) => {
        commits.forEach((el, index) => {
          vm.lastCommits.push({
            author: el.author.name,
            timestamp: el.author.date,
            url: el.url,
            message: el.message
          });
        });
      })
    ;
  }
  function checkAPIStatus() {
    return APIService.getUserInfo("Peanut")
      .then((info) => {
        if(info) {

        }
      })
    ;
  }

}
