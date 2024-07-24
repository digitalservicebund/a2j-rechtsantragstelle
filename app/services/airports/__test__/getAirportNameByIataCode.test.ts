import { getAirportNameByIataCode } from "../getAirportNameByIataCode";

describe("getAirportNameByIataCode", () => {
  it("should return empty in case the iata code does not exist", () => {
    const actual = getAirportNameByIataCode("XXXXXX");

    expect(actual).toEqual("");
  });

  it("should return BER airport", () => {
    const expected = "Berlin Brandenburg Flughafen (BER)";
    const actual = getAirportNameByIataCode("BER");

    expect(actual).toEqual(expected);
  });

  it("should return together the city name when city is not include on the airport name", () => {
    const expected = "Paris Charles de Gaulle International Flughafen (CDG)";
    const actual = getAirportNameByIataCode("CDG");

    expect(actual).toEqual(expected);
  });
});
