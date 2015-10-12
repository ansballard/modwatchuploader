import "angular-material";

AlertsService.$inject = ["$mdToast"];

export default AlertsService;

function AlertsService($mdToast) {

  return {
    badVersion: () => {
      $mdToast.show(
        $mdToast.simple()
        .content("You are not using the latest stable version")
        .hideDelay(3000)
        .position("bottom right")
      );
    },
    serverDown: () => {
      $mdToast.show(
        $mdToast.simple()
        .content("The modwat.ch api server is not responding")
        .hideDelay(3000)
        .position("bottom right")
      );
    },
    loginSuccess: () => {
      $mdToast.show(
        $mdToast.simple()
        .content("Login info saved successfully!")
        .hideDelay(3000)
        .position("bottom right")
      );
    },
    loginError: () => {
      $mdToast.show(
        $mdToast.simple()
        .content("Username, password, and filepaths required to save login")
        .hideDelay(3000)
        .position("bottom right")
      );
    },
    uploadSuccess: () => {
      $mdToast.show(
        $mdToast.simple()
        .content("Mods uploaded successfully!")
        .hideDelay(3000)
        .position("bottom right")
      );
    },
    uploadError: () => {
      $mdToast.show(
        $mdToast.simple()
        .content("Upload failed")
        .hideDelay(6000)
        .position("bottom right")
      );
    }
  };
}
