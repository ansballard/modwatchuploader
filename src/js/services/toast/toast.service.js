Toast.$inject = ["$mdToast"];

import serverdownT from "./templates/serverdown.toast.html";
import badpasswordT from "./templates/badpassword.toast.html";
import savedinfoT from "./templates/savedinfo.toast.html";
import versionT from "./templates/version.toast.html";
import uploaddoneT from "./templates/uploaddone.toast.html";
import debughelperT from "./templates/debughelper.toast.html";

export default Toast;

function Toast($mdToast) {
  return {
    serverDown() {
      defaultToast(serverdownT);
    },
    badPassword() {
      defaultToast(badpasswordT);
    },
    savedInfo() {
      defaultToast(savedinfoT, {hideDelay: 3});
    },
    uploadDone() {
      defaultToast(uploaddoneT);
    },
    version() {
      defaultToast(versionT);
    },
    debughelper() {
      defaultToast(debughelperT);
    }
  };

  function defaultToast(template, opts = {}) {
    $mdToast.show({
      template,
      hideDelay: typeof opts.hideDelay !== "undefined" ? opts.hideDelay * 1000 : 6000,
      position: "bottom right"
    });
  }
}
