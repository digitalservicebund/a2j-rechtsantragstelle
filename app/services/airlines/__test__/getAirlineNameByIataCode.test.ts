import { describe, it, expect } from "vitest";
import airlines from "data/airlines/data.json";
import { getAirlineNameByIataCode } from "../getAirlineNameByIataCode";

describe("getAirlineNameByIataCode", () => {
  it("should return the airline name for a valid IATA code", () => {
    const airlineCode = "LH";
    const expectedAirlineName = airlines.find(
      (airline) => airline.iata === airlineCode,
    )?.name;

    const result = getAirlineNameByIataCode(airlineCode);
    expect(result).toBe(expectedAirlineName);
  });

  it("should return an empty string for an invalid IATA code", () => {
    const result = getAirlineNameByIataCode("INVALID");
    expect(result).toBe("");
  });

  it("should return an empty string for an undefined IATA code", () => {
    const result = getAirlineNameByIataCode();
    expect(result).toBe("");
  });

  it("should return an empty string for an empty string IATA code", () => {
    const result = getAirlineNameByIataCode("");
    expect(result).toBe("");
  });
});
