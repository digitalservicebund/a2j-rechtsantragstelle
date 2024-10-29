import { grundvoraussetzungenDone } from "../doneFunctions";

describe("doneFunctions", () => {
  it("should return true, if all the data were migrated and zahlungsaufforderung is given", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
        zahlungsaufforderung: "no",
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
        zahlungsaufforderung: "no",
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
        zahlungsaufforderung: "no",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if zahlungsaufforderung is missing", () => {
    const actual = grundvoraussetzungenDone({
      context: {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
        bereich: "bereich",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if all context is missing", () => {
    const actual = grundvoraussetzungenDone({ context: {} });

    expect(actual).toBe(false);
  });
});
