import APIService from "./apiService";

(() => {
  "use strict";

  angular.module("modwatchuploader.api", [])
    .factory("APIService", APIService);

})();
