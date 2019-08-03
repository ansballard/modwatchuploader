deleteProfileController.$inject = ["$mdDialog", "API", "Toast"];
export default function deleteProfileController($mdDialog, API, Toast) {
  const vm = this;
  vm.submit = submit;

  function submit() {
    if(!window.confirm("Are you sure you want to delete your profile?")) {
      $mdDialog.hide();
      return;
    }
    API.deleteProfile({
      username: vm.name,
      password: vm.password
    })
    .then(() => {
      Toast.text("Profile Deleted Successfully!");
      $mdDialog.hide();
    })
    .catch(({status}) => {
      if(status === 401 || status === 403) {
        Toast.badPassword();
      } else {
        Toast.serverDown();
      }
    });
  }
}
