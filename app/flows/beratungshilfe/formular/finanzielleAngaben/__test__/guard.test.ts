import type { BeratungshilfeFinanzielleAngaben } from "~/flows/beratungshilfe/formular/finanzielleAngaben/context";
import { finanzielleAngabeGuards } from "~/flows/beratungshilfe/formular/finanzielleAngaben/guards";
import * as pageDataSchemaModule from "~/services/flow/pageDataSchema";

describe("finanzielleAngabeGuards", () => {
  describe("hasPartnerschaftYes", () => {
    it("should return truthy for married context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "yes",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftYes({
        context,
      });

      expect(actual).toBeTruthy();
    });
  });

  describe("hasPartnerschaftNoOrWidowed", () => {
    it("should return truthy for single context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "no",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftNoOrWidowed({
        context,
      });

      expect(actual).toBeTruthy();
    });

    it("should return truthy for widowed context", () => {
      const context: BeratungshilfeFinanzielleAngaben = {
        partnerschaft: "widowed",
      };

      const actual = finanzielleAngabeGuards.hasPartnerschaftNoOrWidowed({
        context,
      });

      expect(actual).toBeTruthy();
    });
  });

  describe("isValidKinderArrayIndex", () => {
    it("calls isValidArrayIndex", () => {
      const isValidArrayIndexSpy = vi.spyOn(
        pageDataSchemaModule,
        "isValidArrayIndex",
      );

      finanzielleAngabeGuards.isValidKinderArrayIndex({
        context: {
          kinder: [
            {
              vorname: "Clara",
              nachname: "Müller",
              geburtsdatum: "01.01.2010",
              wohnortBeiAntragsteller: "yes",
              eigeneEinnahmen: "yes",
              einnahmen: "100",
              unterhalt: "yes",
              unterhaltsSumme: "100",
            },
          ],
          pageData: { arrayIndexes: [1] },
        },
      });

      expect(isValidArrayIndexSpy).toHaveBeenCalledTimes(1);
    });
  });
});
