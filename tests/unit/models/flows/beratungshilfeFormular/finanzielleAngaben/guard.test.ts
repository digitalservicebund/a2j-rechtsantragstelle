import { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";
import { finanzielleAngabeGuards } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/guards";

describe("finanzielleAngabeGuards", () => {
  describe("hasPartnerschaftOrSeparated", () => {
    it("should return truthy for married context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "yes",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftOrSeparated({
        context,
      });

      expect(actual).toBeTruthy();
    });

    it("should return truthy for separated context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "separated",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftOrSeparated({
        context,
      });

      expect(actual).toBeTruthy();
    });
  });

  describe("hasNoPartnerschaftOrWidowed", () => {
    it("should return truthy for single context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "no",
      };

      const actual = finanzielleAngabeGuards.hasNoPartnerschaftOrWidowed({
        context,
      });

      expect(actual).toBeTruthy();
    });

    it("should return truthy for widowed context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "widowed",
      };

      const actual = finanzielleAngabeGuards.hasNoPartnerschaftOrWidowed({
        context,
      });

      expect(actual).toBeTruthy();
    });
  });
});
