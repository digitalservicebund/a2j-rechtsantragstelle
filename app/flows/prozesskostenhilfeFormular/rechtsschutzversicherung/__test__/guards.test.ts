import { hasNoRsvAndNoOrg, hasPartlyorNoCoverage } from "../guards";

describe("rechtsschuzversicherung guards", () => {
  describe("they determine if insurance or organization membership exists", () => {
    it("is truthy when no insurance and no membership exists", () => {
      expect(hasNoRsvAndNoOrg({ hasRsv: "no", hasOrg: "no" })).toBeTruthy();
    });
    it("is falsy when only insurance is covering cost", () => {
      expect(hasNoRsvAndNoOrg({ hasRsv: "yes", hasOrg: "no" })).toBeFalsy();
    });
    it("is falsy when only an organization is covering cost", () => {
      expect(hasNoRsvAndNoOrg({ hasRsv: "no", hasOrg: "yes" })).toBeFalsy();
    });
  });
  describe("they determine if insurance or organization cover the cost", () => {
    it("is truthy when the insurance and org are not covering cost", () => {
      expect(
        hasPartlyorNoCoverage({ hasRsvCoverage: "no", hasOrgCoverage: "no" }),
      ).toBeTruthy();
    });
    it("it is truthy when the insurance or org are only partly covering cost", () => {
      expect(
        hasPartlyorNoCoverage({
          hasRsvCoverage: "partly",
          hasOrgCoverage: "no",
        }),
      ).toBeTruthy();
      expect(
        hasPartlyorNoCoverage({
          hasRsvCoverage: "partly",
          hasOrgCoverage: "partly",
        }),
      ).toBeTruthy();
      expect(
        hasPartlyorNoCoverage({
          hasRsvCoverage: "no",
          hasOrgCoverage: "partly",
        }),
      ).toBeTruthy();
    });
  });
});
