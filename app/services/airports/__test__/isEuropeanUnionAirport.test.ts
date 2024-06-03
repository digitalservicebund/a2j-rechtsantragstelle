import { isEuropeanUnionAirport } from "../isEuropeanUnionAirport";

describe("isEuropeanUnionAirport", () => {
  it("should return ok and value true if the airport is BER", () => {
    const actual = isEuropeanUnionAirport("BER");

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value : false).toBe(true);
  });

  it("should return ok and value false if the airport is JFK", () => {
    const actual = isEuropeanUnionAirport("JFK");

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value : true).toBe(false);
  });

  it("should return error if the airport does not exist", () => {
    const actual = isEuropeanUnionAirport("XXXX");

    expect(actual.isErr).toBe(true);
  });
});
