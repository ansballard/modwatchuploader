PersistenceService.$inject = ["$q"];

export default PersistenceService;

/** store profiles as object **/
/** switch between profiles using profile name **/
/** methods for each field vs passing reference (just use methods, it'll be fine) **/
/** split username and default profile name, from then on username is persistent,
    profile name can now be changed **/

function PersistenceService($q) {

  let profiles = JSON.parse(window.localStorage.getItem("modwatch.profiles") || "false");
  let user = JSON.parse(window.localStorage.getItem("modwatch.user") || "{}")

  return {
    saveProfiles() {
        window.localStorage.setItem("modwatch.profiles", JSON.stringify(profiles));
        return profiles;
      },
      saveProfile() {
        this.saveProfiles();
      },
      saveUser(username, password) {
        user = {
          "username": username,
          "password": password
        };
        if(!profiles) {
          profiles = {};
          profiles[username] = {mo: {}, nmm: {}};
        }
        this.saveProfiles();
        window.localStorage.setItem("modwatch.user", JSON.stringify(user));
        return user;
      },
      switchProfile(profileName) {
        this.saveProfiles();
        return profiles[profileName];
      },
      getProfile(profileName) {
        return profiles[profileName];
      },
      getProfiles() {
        let list = [];
        for(const profile in profiles) {
          list.push(profile);
        }
        return list;
      },
      getUser() {
        return user;
      },
      setGame(profileName, game) {
        console.log(profiles);
        console.log(profileName);
        profiles[profileName].game = game;
        this.saveProfile();
        return profiles[profileName];
      },
      setTag(profileName, tag) {
        profiles[profileName].tag = tag;
        this.saveProfile();
        return profiles[profileName];
      },
      setEnb(profileName, enb) {
        profiles[profileName].enb = enb;
        this.saveProfile();
        return profiles[profileName];
      },
      setMOPath(profileName, path) {
        profiles[profileName].mo.path = path;
        this.saveProfile();
        return profiles[profileName];
      },
      setNMMPluginsPath(profileName, path) {
        profiles[profileName].nmm.pluginsPath = path;
        this.saveProfile();
        return profiles[profileName];
      },
      setNMMIniPath(profileName, path) {
        profiles[profileName].nmm.iniPath = path;
        this.saveProfile();
        return profiles[profileName];
      },
      setDefaultManager(profileName, acronym) {
        profiles[profileName].program = acronym;
        this.saveProfile();
        return profiles[profileName];
      }
  };
}
