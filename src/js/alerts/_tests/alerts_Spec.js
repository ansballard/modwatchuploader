import AlertsService from "../alertsService"


(() => {

  fdescribe("modwatchuploader.module", () => {

    describe("AlertsService", () => {

      let $mdToast, service;

      beforeEach(inject(($injector) => {
        $mdToast = {show: () => {}, simple: () => {}};
        service = AlertsService($mdToast);
      }));

      describe("badVersion()", () => {
        it("should call badVersion alert", () => {
          spyOn($mdToast, "show");
          spyOn($mdToast, "simple");
          service.badVersion();
          expect($mdToast.show).toHaveBeenCalled();
          expect($mdToast.simple).toHaveBeenCalled();
        });
      });

    });

  });

})();
