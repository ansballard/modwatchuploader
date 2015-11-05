import "angular";
import "angular-route";
import "angular-aria";
import "angular-animate";
import "../../deps/angular-material.min.js";
import "../../tmp/templates/templates"

import "./ng.module"; // legacy

import RouteConfig from "./routes/routeConfig";

import "./api/api.module";
import "./files/files.module";
import "./alerts/alerts.module";
import "./upload/upload.module";

(() => {
  "use strict";

  angular.module("modwatchuploader", [
    "ngRoute",

    "modwatchuploader.template",
    "modwatchuploader.api",
    "modwatchuploader.files",
    "modwatchuploader.alerts",
    "modwatchuploader.upload"
  ])
  .config(RouteConfig);

})();
