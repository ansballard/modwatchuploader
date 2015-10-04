import "./ng.module";

import "./api/api.module";
import "./files/files.module";
import "./alerts/alerts.module";

(() => {
  "use strict";

  angular.module("modwatchuploader", [
    "modwatchuploader.api",
    "modwatchuploader.files",
    "modwatchuploader.alerts",
    "modwatchuploader.wrapper"
  ]);

})();
