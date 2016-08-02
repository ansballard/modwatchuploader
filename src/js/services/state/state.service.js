import { ipcRenderer as ipc } from "electron";

state.$inject = ["$q"];

export default state;

function state($q) {
  const prefix = "modwatch.";
  return {
    isFirstTime() {
      return $q.resolve(!localStorage.getItem(`${prefix}notfirsttime`));
    },
    disableFirstTime() {
      return $q.resolve(localStorage.setItem(`${prefix}notfirsttime`, true));;
    },
    getCreds() {
      return $q.resolve({
        username: localStorage.getItem(`${prefix}username`) || undefined,
        password: localStorage.getItem(`${prefix}password`) || undefined
      });
    },
    setCreds(creds) {
      if(creds.username) {
        localStorage.setItem(`${prefix}username`, creds.username);
      }
      if(creds.password) {
        localStorage.setItem(`${prefix}password`, creds.password);
      }
      return $q.resolve();
    },
    getMOPath() {
      return $q.resolve(localStorage.getItem("modwatch.mo_filepath") || undefined);
    },
    setMOPath() {
      const d = $q.defer();
      ipc.send("mo.getFiles", newpath);
      ipc.once("mo.filepath", (event, filepath) => {
        if(filepath) {
          localStorage.setItem(`${prefix}mo_filepath`, filepath);
        }
        d.resolve(filepath || undefined);
      });
      return d.promise;
    },
    getNMMPaths() {
      return $q.all({
        ini: localStorage.getItem(`${prefix}nmm_inipath`) || undefined,
        plugins: localStorage.getItem(`${prefix}nmm_pluginspath`) || undefined
      });
    },
    setNMMIniPath() {
      const d = $q.defer();
      ipc.send("nmm.getIniFiles", newpath);
      ipc.once("nmm.iniFiles", (event, filepath) => {
        if(filepath) {
          localStorage.setItem(`${prefix}nmm_iniPath`, filepath);
        }
        d.resolve(filepath || undefined);
      });
      return d.promise;
    },
    setNMMPluginsPath() {
      const d = $q.defer();
      ipc.send("nmm.getPluginsFile", newpath);
      ipc.once("nmm.pluginsFile", (event, filepath) => {
        if(filepath) {
          localStorage.setItem(`${prefix}nmm_pluginsPath`, filepath);
        }
        d.resolve(filepath || undefined);
      });
      return d.promise;
    }
  };
}
