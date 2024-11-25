import { isEuropeanUnionAirport } from "../isEuropeanUnionAirport";

describe("isEuropeanUnionAirport", () => {
  it("should return true if the airport is BER", () => {
    const actual = isEuropeanUnionAirport("BER");

    expect(actual).toEqual(true);
  });

  it("should return false if the airport is JFK", () => {
    const actual = isEuropeanUnionAirport("JFK");

    expect(actual).toEqual(false);
  });

  it("should return false if the airport does not exist", () => {
    const actual = isEuropeanUnionAirport("XXXX");

    expect(actual).toEqual(false);
  });

  it("should return true if the airport is ZRH", () => {
    const actual = isEuropeanUnionAirport("ZRH");

    expect(actual).toEqual(true);
  });

  it("should return true if the airport is CAY", () => {
    const actual = isEuropeanUnionAirport("CAY");

    expect(actual).toEqual(true);
  });

  it("should return true if the airport is RUN", () => {
    const actual = isEuropeanUnionAirport("RUN");

    expect(actual).toEqual(true);
  });

  it("should return given an undefined airport code", () => {
    const actual = isEuropeanUnionAirport(undefined);

    expect(actual).toEqual(false);
  });
});
