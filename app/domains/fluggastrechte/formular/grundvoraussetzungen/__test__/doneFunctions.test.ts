import { grundvoraussetzungenDone } from "../doneFunctions";

describe("doneFunctions", () => {
  it("should return true, if all the data were migrated given", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false, if start airport is missing", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if bereich is missing", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if all context is missing", () => {
    const actual = grundvoraussetzungenDone({ context: {} });

    expect(actual).toBe(false);
  });
});
