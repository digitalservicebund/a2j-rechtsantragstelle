import { isIncomeTooHigh } from "~/services/flow/guards";

describe("isIncomeTooHigh", () => {
  it("returns false for random example case", () => {
    const input = {
      einkommen: {
        einkommen: 1200,
      },
      miete: {
        miete: 500,
      },
      kinderAnzahl: {
        kids6Below: 2,
      },
      einkommenKinder: {
        einkommenKinder: 100,
      },
    };
    expect(isIncomeTooHigh(input)).toEqual(false);
  });
});
