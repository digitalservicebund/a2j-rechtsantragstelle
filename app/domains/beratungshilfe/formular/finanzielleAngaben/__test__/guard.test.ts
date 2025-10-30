import {
  finanzielleAngabeGuards,
  hasPartnerschaftYes,
} from "~/domains/beratungshilfe/formular/finanzielleAngaben/guards";
import * as pageDataSchemaModule from "~/services/flow/pageDataSchema";

describe("finanzielleAngabeGuards", () => {
  describe("hasPartnerschaftYes", () => {
    it("should return truthy for married context", () => {
      const actual = hasPartnerschaftYes({ context: { partnerschaft: "yes" } });
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
            },
          ],
          pageData: { arrayIndexes: [1] },
        },
      });

      expect(isValidArrayIndexSpy).toHaveBeenCalledTimes(1);
    });
  });
});
