PersistenceService.$inject = ["$q"];

export default PersistenceService;

/** store profiles as object **/
/** switch between profiles using profile name **/
/** methods for each field vs passing reference (just use methods, it'll be fine) **/
/** split username and default profile name, from then on username is persistent,
    profile name can now be changed **/

function PersistenceService($q) {

  let profiles = JSON.parse(window.localStorage.getItem("modwatch.profiles") || "{\"mo\": {}, \"nmm\": {}}");
  let login = JSON.parse(window.localStorage.getItem("modwatch.login") || "{}")

  return {
    saveProfiles() {
        window.localStorage.setItem("modwatch.profiles", JSON.stringify(profiles));
        return profiles;
      },
      saveProfile() {
        this.saveProfiles();
      },
      saveUser(username, password) {
        login = {
          "username": username,
          "password": password
        };
        window.localStorage.setItem("modwatch.login", JSON.stringify(login));
        return login;
      },
      switchProfile(profileName) {
        this.saveUser();
        return profiles[profileName];
      },
      getProfile(profileName) {
        return profiles[profileName];
      },
      getLogin() {
        return login;
      },
      setGame(profileName, game) {
        profiles[profileName].game = game;
        return profiles[profileName];
      },
      setMOPath(profileName, path) {
        profiles[profileName].mo.path = path;
        return profiles[profileName];
      },
      setNMMPluginsPath(profileName, path) {
        profiles[profileName].nmm.pluginsPath = path;
        return profiles[profileName];
      },
      setNMMIniPath(profileName, path) {
        profiles[profileName].nmm.iniPath = path;
        return profiles[profileName];
      },
      setDefaultManager(profileName, acronym) {
        profiles[profileName].program = acronym;
        return profiles[profileName];
      }
  };
}
