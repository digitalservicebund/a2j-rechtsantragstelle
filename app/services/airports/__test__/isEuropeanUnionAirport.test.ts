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

  it("should return ok and value true if the airport is ZRH", () => {
    const actual = isEuropeanUnionAirport("ZRH");

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value : false).toBe(true);
  });

  it("should return ok and value true if the airport is CAY", () => {
    const actual = isEuropeanUnionAirport("CAY");

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value : false).toBe(true);
  });

  it("should return ok and value true if the airport is RUN", () => {
    const actual = isEuropeanUnionAirport("RUN");

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value : false).toBe(true);
  });
});
