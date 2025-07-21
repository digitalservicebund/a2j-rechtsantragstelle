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
    userData = {
      staatlicheLeistungen: "buergergeld",
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(true);
  });

  it("Should return true if the user has less than 10.000€ in Eigentum", () => {
    const userData: Partial<BeratungshilfeFormularUserData> = {
      bankkonten: [
        {
          bankName: "N26",
          kontostand: "9999",
          kontoEigentuemer: "myself",
        },
      ],
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(true);
  });

  it("Should return false if the user has more than 10.000€ in Eigentum", () => {
    const userData: Partial<BeratungshilfeFormularUserData> = {
      grundeigentum: [
        {
          verkaufswert: "10001",
        },
      ],
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(false);
  });

  it("Should exclude Kraftfahrzeuge used for commuting purposes in the eigentumTotalWorth calculations", () => {
    const userData: Partial<BeratungshilfeFormularUserData> = {
      kraftfahrzeuge: [
        {
          hasArbeitsweg: "yes",
          verkaufswert: "11000",
        },
        {
          hasArbeitsweg: "no",
          verkaufswert: "1234",
        },
      ],
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(true);
  });

  it("Should return false if the user has at least one non-commuter vehicle with a worth over 10.000€", () => {
    const userData: Partial<BeratungshilfeFormularUserData> = {
      kraftfahrzeuge: [
        {
          hasArbeitsweg: "no",
          wert: "over10000",
          verkaufswert: "11000",
        },
      ],
    };
    expect(isFinanciallyEligibleForBerH({ context: userData })).toBe(false);
  });
});
