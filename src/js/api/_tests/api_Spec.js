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
        it("should return a promise with the current version", () => {
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

      describe("getUserInfo()", () => {
        it("should return a promise with user info", () => {
          const username = "Peanut";
          const userInfo = {
            tag: "The Creator",
            enb: "Swag",
            game: "skyrim",
            score: 11
          };
          $httpBackend.expectGET("http://modwatchapi-ansballard.rhcloud.com/api/user/" + username + "/profile").respond(userInfo);
          service.getUserInfo(username)
            .then((res) => {
              expect(res.data).toEqual(userInfo);
            })
          ;
          $httpBackend.flush();
        });
      });

      describe("uploadMods()", () => {
        it("should post a load order object", () => {
          const loadorder = {
            plugins: ["The Creator.esm", "something.esp"],
            modlist: ["Swag", "double swag", "triple swag"],
            ini: ["skyrim", "settings=1"],
            prefsini: ["colors=2", "brightness='a lot'"],
            username: "Peanut",
            password: "12345",
            game: "skyrim"
          };
          $httpBackend.expectPOST("http://modwatchapi-ansballard.rhcloud.com/loadorder", loadorder).respond(200);
          service.uploadMods(loadorder)
            .then((res) => {
              expect(res.status).toBe(200);
            })
          ;
          $httpBackend.flush();
        });
      });

    });

  });

})();
