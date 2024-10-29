import {
  isOrganizationCoveragePartly,
  isOrganizationCoverageNone,
} from "~/flows/prozesskostenhilfe/prozesskostenhilfeFormular/rechtsschutzversicherung/guards";

describe("they determine if organization coverage is None or partly", () => {
  describe("they determine if an organziation covers the cost partly", () => {
    it("is Truthy when organizations cover the cost partly", () => {
      expect(
        isOrganizationCoveragePartly({ hasOrgCoverage: "partly" }),
      ).toBeTruthy();
    });
    it("is Truthy when organizations cover the cost partly fully", () => {
      expect(
        isOrganizationCoveragePartly({ hasOrgCoverage: "yes" }),
      ).toBeFalsy();
    });
  });
  describe("they describe if an organziation covers the cost or not", () => {
    it("is Truthy when organizations dont cover the cost", () => {
      expect(isOrganizationCoverageNone({ hasOrgCoverage: "no" })).toBeTruthy();
    });
    it("is Falsy when organizations cover the cost", () => {
      expect(isOrganizationCoverageNone({ hasOrgCoverage: "yes" })).toBeFalsy();
    });
  });
});
