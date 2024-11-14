import { getAirportByIataCode } from "../getAirportByIataCode";

describe("getAirportByIataCode", () => {
  it("should return an object given the BER airport", () => {
    const actual = getAirportByIataCode("BER");
    expect(actual).not.toBeUndefined();
  });

  it("should return an undefined object given the empty string", () => {
    const actual = getAirportByIataCode("");
    expect(actual).toBeUndefined();
  });

  it("should return an undefined object given non exist airport", () => {
    const actual = getAirportByIataCode("XXX");
    expect(actual).toBeUndefined();
  });
});
