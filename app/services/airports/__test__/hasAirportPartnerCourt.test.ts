import { hasAirportPartnerCourt } from "../hasPartnerCourt";

describe("hasAirportPartnerCourt", () => {
  it("should return false given an undefined airport", () => {
    const actual = hasAirportPartnerCourt(undefined);

    expect(actual).toBe(false);
  });

  it("should return false given not exist airport", () => {
    const actual = hasAirportPartnerCourt("XXX");

    expect(actual).toBe(false);
  });

  it("should return false given an airport without partner court", () => {
    const actual = hasAirportPartnerCourt("CDG");

    expect(actual).toBe(false);
  });

  it("should return true given an airport with partner court", () => {
    const actual = hasAirportPartnerCourt("BER");

    expect(actual).toBe(true);
  });

  it("should return false given empty string", () => {
    const actual = hasAirportPartnerCourt("");

    expect(actual).toBe(false);
  });
});
