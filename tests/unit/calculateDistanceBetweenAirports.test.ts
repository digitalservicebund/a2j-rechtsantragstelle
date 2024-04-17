import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";

describe("calculateDistanceBetweenAirportsInKilometers", () => {
  it("in case set a non existing start airport, it should return -1", () => {
    const startAiport = "XXX";
    const endAiport = "STR";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAiport,
      endAiport,
    );

    expect(actual).toBe(-1);
  });

  it("in case set a non existing end airport, it should return -1", () => {
    const startAiport = "BER";
    const endAiport = "XXX";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAiport,
      endAiport,
    );

    expect(actual).toBe(-1);
  });

  it("in case set a start and end airport, it should return the distance above 500km", () => {
    const startAiport = "BER";
    const endAiport = "STR";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAiport,
      endAiport,
    );

    const expctedGraterThanValue = 500;

    expect(actual).toBeGreaterThan(expctedGraterThanValue);
  });
});
