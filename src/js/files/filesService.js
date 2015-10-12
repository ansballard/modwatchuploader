FilesService.$inject = ["$q"];

export default FilesService;

function FilesService($q) {
  return {
    getFiles: {
      mo: (filename) => {
        let deferred = $q.defer();
        ipc.send(filename ? "mo.getFilesNoDialog" : "mo.getFiles", filename);
        ipc.on("filesread", (files) => {
          deferred.resolve(JSON.parse(files));
        });
        return deferred.promise;
      },
      nmm: {
        plugins: (filename) => {
          let deferred = $q.defer();
          ipc.send(noDialog ? "nmm.getPluginsFileNoDialog" : "nmm.getPluginsFile", filename);
          ipc.on("filesread", (files) => {
            deferred.resolve(JSON.parse(files));
          });
          return deferred.promise;
        },
        ini: (filename) => {
          let deferred = $q.defer();
          ipc.send(filename ? "nmm.getIniFilesNoDialog" : "nmm.getIniFiles", filename);
          ipc.on("filesread", (files) => {
            deferred.resolve(JSON.parse(files));
          });
          return deferred.promise;
        }
      }
    }
  };
}
