import { isIncomeTooHigh } from "~/models/flows/beratungshilfe/guards";

describe("isIncomeTooHigh", () => {
  it("returns false for random example case", () => {
    const input = {
      einkommen: "1200",
      miete: "500",
      kids6Below: "2",
      einkommenKinder: "100",
    };
    expect(isIncomeTooHigh(input)).toEqual(false);
  });
});
