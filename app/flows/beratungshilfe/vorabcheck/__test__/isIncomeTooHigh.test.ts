import { isIncomeTooHigh } from "~/flows/beratungshilfe/vorabcheck/isIncomeTooHigh";

describe("isIncomeTooHigh", () => {
  it("returns false for random example case", () => {
    const context = {
      einkommen: "1200",
      miete: "500",
      kids: {
        kids6Below: "2",
        kids7To14: "0",
        kids15To18: "0",
        kids18Above: "0",
      },
      einkommenKinder: "100",
    };
    expect(isIncomeTooHigh({ context })).toEqual(false);
  });
});
