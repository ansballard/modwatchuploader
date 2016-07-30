state.$inject = ["$q"];

export default state;

function state($q) {
  const prefix = "modwatch.";
  return {
    isFirstTime() {
      return $q.resolve(!localStorage.getItem(`${prefix}notfirsttime`));
    },
    disableFirstTime() {
      return $q.resolve(localStorage.setItem(`${prefix}notfirsttime`, true));;
    }
  };
}
