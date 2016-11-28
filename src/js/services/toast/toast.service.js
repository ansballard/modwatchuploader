import serverdownT from "./templates/serverdown.toast.html";
import badpasswordT from "./templates/badpassword.toast.html";
import savedinfoT from "./templates/savedinfo.toast.html";
import versionT from "./templates/version.toast.html";
import uploaddoneT from "./templates/uploaddone.toast.html";
import debughelperT from "./templates/debughelper.toast.html";

export default Toast;

Toast.$inject = ["$mdToast"];

function Toast($mdToast) {
  return {
    text(msg) {
      $mdToast.show({
        template: `
        <md-toast>
          <span flex>${msg}</span>
        </md-toast>`,
        position: "bottom right"
      });
    },
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
      hideDelay: typeof opts.hideDelay !== "undefined" ? opts.hideDelay * 1000 : 4000,
      position: "bottom right"
    });
  }
}
