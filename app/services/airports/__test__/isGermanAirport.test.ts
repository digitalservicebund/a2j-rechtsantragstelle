import { isGermanAirport } from "../isGermanAirport";

describe("isGermanAirport", () => {
  it("should return false given an undefined airport code", () => {
    const actual = isGermanAirport(undefined);

    expect(actual).toBe(false);
  });

  it("should return false given a not exist airport", () => {
    const actual = isGermanAirport("XXX");

    expect(actual).toBe(false);
  });

  it("should return false given a non german airport", () => {
    const actual = isGermanAirport("JFK");

    expect(actual).toBe(false);
  });

  it("should return true given a german airport", () => {
    const actual = isGermanAirport("BER");

    expect(actual).toBe(true);
  });
});
