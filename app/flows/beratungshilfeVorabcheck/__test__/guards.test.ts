import { guards } from "~/flows/beratungshilfeVorabcheck/guards";

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
    expect(guards.isIncomeTooHigh({ context })).toEqual(false);
  });
});

describe("anyKinderAnzahlFilled", () => {
  it("returns false for kids not given", () => {
    const context = {};
    expect(guards.anyKinderAnzahlFilled({ context })).toEqual(false);
  });

  it("returns true for kids filled", () => {
    const context = {
      kids: {
        kids6Below: "0",
        kids7To14: "0",
        kids15To18: "1",
        kids18Above: "0",
      },
    };
    expect(guards.anyKinderAnzahlFilled({ context })).toEqual(true);
  });
});
