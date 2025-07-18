import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { isFinanciallyEligibleForBerH } from "~/domains/beratungshilfe/formular/abgabe/isFinanciallyEligibleForBerH";

describe("isFinanciallyEligibleForBerH", () => {
  it("should return true if the user has qualifying staatliche leistungen", () => {
    let userData: Partial<BeratungshilfeFormularUserData> = {
      staatlicheLeistungen: "asylbewerberleistungen",
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(true);
    userData = {
      staatlicheLeistungen: "grundsicherung",
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(true);
  });

  it("Should return true if the user has less than 10.000€ in Eigentum", () => {
    const userData: Partial<BeratungshilfeFormularUserData> = {
      eigentumTotalWorth: "less10000",
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(true);
  });
});
