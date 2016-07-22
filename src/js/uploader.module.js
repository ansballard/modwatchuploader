import "angular";
import "angular-animate";
import "angular-aria";
import "angular-material";

import "./services/api/api.module";
import "./controllers/main/main.module";

angular
.module("uploader", [
  "ngMaterial",

  "uploader.main",
  "uploader.api"
]);
