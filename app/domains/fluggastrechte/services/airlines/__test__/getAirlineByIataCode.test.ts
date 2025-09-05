import airlines from "data/airlines/data.json";
import { getAirlineByIataCode } from "../getAirlineByIataCode";

describe("getAirlineByIataCode", () => {
  it("should return the airline name for a valid IATA code", () => {
    const airlineCode = "LH";
    const expectedAirline = airlines.find(
      (airline) => airline.iata === airlineCode,
    );

    const result = getAirlineByIataCode(airlineCode);
    expect(result).toBe(expectedAirline);
  });

  it("should return undefined for an invalid IATA code", () => {
    const result = getAirlineByIataCode("INVALID");
    expect(result).toBeUndefined();
  });

  it("should return undefined for an undefined IATA code", () => {
    const result = getAirlineByIataCode();
    expect(result).toBeUndefined();
  });

  it("should return undefined for an empty string IATA code", () => {
    const result = getAirlineByIataCode("");
    expect(result).toBeUndefined();
  });
});
