import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";

describe("calculateDistanceBetweenAirportsInKilometers", () => {
  it("in case set a non existing start airport, it should return a result error", () => {
    const startAirport = "XXX";
    const endAirport = "STR";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAirport,
      endAirport,
    );

    expect(actual.isErr).toBe(true);
  });

  it("in case set a non existing end airport, it should return a result error", () => {
    const startAirport = "BER";
    const endAirport = "XXX";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAirport,
      endAirport,
    );

    expect(actual.isErr).toBe(true);
  });

  it("in case set a start and end airport, it should return ok and the distance above 500km", () => {
    const startAirport = "BER";
    const endAirport = "STR";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAirport,
      endAirport,
    );

    const expectedGraterThanValue = 500;

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value > expectedGraterThanValue : false).toBe(
      true,
    );
  });
});
