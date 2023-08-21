import { guards, isIncomeTooHigh } from "~/models/flows/beratungshilfe/guards";

describe("isIncomeTooHigh", () => {
  it("returns false for random example case", () => {
    const input = {
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
    expect(isIncomeTooHigh(input)).toEqual(false);
  });
});

describe("anyKinderAnzahlFilled", () => {
  it("returns false for kids not given", () => {
    const input = {};
    expect(guards.anyKinderAnzahlFilled(input)).toEqual(false);
  });

  it("returns true for kids filled", () => {
    const input = {
      kids: {
        kids6Below: "0",
        kids7To14: "0",
        kids15To18: "1",
        kids18Above: "0",
      },
    };
    expect(guards.anyKinderAnzahlFilled(input)).toEqual(true);
  });
});
