import { eigentumZusammenfassungShowTotalWorthWarnings } from "~/flows/beratungshilfe/formular/stringReplacements";

describe("stringReplacements", () => {
  describe("eigentumZusammenfassungTotalWorthShowWarnings", () => {
    it("return string config to show warning", () => {
      expect(
        eigentumZusammenfassungShowTotalWorthWarnings({
          eigentumTotalWorth: "less10000",
        }),
      ).toStrictEqual({
        eigentumTotalWorthLessThan10000: true,
      });
    });

    it("return string config to show no warning", () => {
      expect(
        eigentumZusammenfassungShowTotalWorthWarnings({
          eigentumTotalWorth: "more10000",
        }),
      ).toStrictEqual({
        eigentumTotalWorthLessThan10000: false,
      });
    });
  });
});
