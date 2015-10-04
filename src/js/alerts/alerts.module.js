import "./alertsService";

(() => {
  "use strict";

  angular.module("modwatchuploader.alerts", ["ngMaterial"])
    .factory("AlertsService", AlertsService);

})();
