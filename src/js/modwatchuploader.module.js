//import "angular";
//import "angular-route";
//import "angular-aria";
//import "angular-animate";
//import "../../deps/angular-material.min.js";
import "../../tmp/templates/templates"

import RouteConfig from "./routes/routeConfig";

import "./constants/constants.module";
import "./persistence/persistence.module";
import "./api/api.module";
import "./files/files.module";
import "./alerts/alerts.module";
import "./login/login.module";
import "./upload/upload.module";

(() => {
  "use strict";

  angular.module("modwatchuploader", [
    "ngRoute",

    "modwatchuploader.constants",
    "modwatchuploader.template",
    "modwatchuploader.persistence",
    "modwatchuploader.api",
    "modwatchuploader.files",
    "modwatchuploader.alerts",
    "modwatchuploader.login",
    "modwatchuploader.upload"
  ])
  .config(RouteConfig);

})();
