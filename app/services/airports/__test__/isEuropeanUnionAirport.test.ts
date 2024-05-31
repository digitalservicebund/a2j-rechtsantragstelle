import { isEuropeanUnionAirport } from "../isEuropeanUnionAirport";

describe("isEuropeanUnionAirport", () => {
  it("should return true if the airport is BER", () => {
    const actual = isEuropeanUnionAirport("BER");

    expect(actual).toBe(true);
  });

  it("should return false if the airport is JFK", () => {
    const actual = isEuropeanUnionAirport("JFK");

    expect(actual).toBe(false);
  });

  it("should return true if the airport does not exist", () => {
    const actual = isEuropeanUnionAirport("XXXX");

    expect(actual).toBe(true);
  });
});
