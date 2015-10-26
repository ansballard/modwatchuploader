RouteConfig.$inject = ["$routeProvider"];

export default RouteConfig;

function RouteConfig($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "upload.template.html",
      controller: "UploadCtrl",
      controllerAs: "vm",
      bindToController: true
    })
    .when("/tutorial", {
      templateUrl: "tutorial.template.html",
      controller: "TutorialCtrl",
      controllerAs: "vm",
      bindToController: true
    })
    .otherwise({
      redirectTo: "/"
    })
  ;
}
