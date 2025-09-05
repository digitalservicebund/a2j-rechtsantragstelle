import { hasAirlineAddress } from "../hasAirlineAddress";

describe("hasAirlineAddress", () => {
  it("should return true for an airline with a complete address", () => {
    const airlineCode = "LH";
    const actual = hasAirlineAddress(airlineCode);
    expect(actual).toBe(true);
  });

  it("should return false for an airline with an incomplete address", () => {
    const airlineCode = "SU";
    const actual = hasAirlineAddress(airlineCode);
    expect(actual).toBe(false);
  });

  it("should return false for an invalid IATA code", () => {
    const actual = hasAirlineAddress("INVALID");
    expect(actual).toBe(false);
  });

  it("should return false for an empty string IATA code", () => {
    const actual = hasAirlineAddress("");
    expect(actual).toBe(false);
  });
});
