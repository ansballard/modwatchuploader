import "angular";
import "angular-animate";
import "angular-aria";
import "angular-material";

import "./services/api/api.module";
import "./services/state/state.module";
import "./services/toast/toast.module";
import "./controllers/main/main.module";

angular
.module("uploader", [
  "uploader.main",
  "uploader.api",
  "uploader.state",
  "uploader.toast"
]);
