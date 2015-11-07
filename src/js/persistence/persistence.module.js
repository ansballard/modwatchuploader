import PersistenceService from "./persistenceService";

(() => {
  "use strict";

  angular.module("modwatchuploader.persistence", [])
    .factory("PersistenceService", PersistenceService);

})();
