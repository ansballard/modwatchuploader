import APIService from "../apiService"

(() => {

  describe("modwatchuploader.module", () => {

    describe("APIService", () => {

      let $httpBackend, service;

      beforeEach(inject(($injector) => {
        service = APIService($injector.get("$http"));
        $httpBackend = $injector.get("$httpBackend");
      }));

      afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      describe("getCurrentVersion()", () => {
        it("should return a promise", () => {
          const version = "0.26b";
          $httpBackend.expectGET("http://modwatchapi-ansballard.rhcloud.com/api/script/version/3").respond(version);
          service.getCurrentVersion()
            .then((res) => {
              expect(res.data).toBe(version);
            })
          ;
          $httpBackend.flush();
        });
      });

    });

  });

})();
