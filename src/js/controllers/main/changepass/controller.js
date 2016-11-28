changepassController.$inject = ["$mdDialog", "API", "Toast"];
export default function changepassController($mdDialog, API, Toast) {
  const vm = this;
  vm.submit = submit;

  function submit() {
    if(vm.newpass1 !== vm.newpass2) {
      Toast.text("Passwords do not match");
    } else if (vm.password === vm.newpass1) {
      Toast.text("That's not really what \"Change\" means");
    } else {
      API.changePass({
        username: vm.name,
        password: vm.password,
        newpassword: vm.newpass1
      })
      .then(() => {
        Toast.text("Password changed successfully!");
        $mdDialog.hide();
      })
      .catch(({status}) => {
        if(status === 403) {
          Toast.badPassword();
        } else {
          Toast.serverDown();
        }
      });
    }
  }
}
