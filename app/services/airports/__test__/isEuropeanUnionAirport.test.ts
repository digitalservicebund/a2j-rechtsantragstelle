import { isEuropeanUnionAirport } from "../isEuropeanUnionAirport";

describe("isEuropeanUnionAirport", () => {
  it("should return ok and value true if the airport is BER", () => {
    const actual = isEuropeanUnionAirport("BER");

    if (actual.isOk) {
      expect(actual.value).toEqual(true);
    } else {
      expect.fail("Not an Ok");
    }
  });

  it("should return ok and value false if the airport is JFK", () => {
    const actual = isEuropeanUnionAirport("JFK");

    if (actual.isOk) {
      expect(actual.value).toEqual(false);
    } else {
      expect.fail("Not an Ok");
    }
  });

  it("should return error if the airport does not exist", () => {
    const actual = isEuropeanUnionAirport("XXXX");

    expect(actual.isErr).toBe(true);
  });

  it("should return ok and value true if the airport is ZRH", () => {
    const actual = isEuropeanUnionAirport("ZRH");

    if (actual.isOk) {
      expect(actual.value).toEqual(true);
    } else {
      expect.fail("Not an Ok");
    }
  });

  it("should return ok and value true if the airport is CAY", () => {
    const actual = isEuropeanUnionAirport("CAY");

    if (actual.isOk) {
      expect(actual.value).toEqual(true);
    } else {
      expect.fail("Not an Ok");
    }
  });

  it("should return ok and value true if the airport is RUN", () => {
    const actual = isEuropeanUnionAirport("RUN");

    if (actual.isOk) {
      expect(actual.value).toEqual(true);
    } else {
      expect.fail("Not an Ok");
    }
  });

  it("should return given an undefined airport code", () => {
    const actual = isEuropeanUnionAirport(undefined);

    expect(actual.isErr).toBe(true);
  });
});
