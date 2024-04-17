import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";

describe("calculateDistanceBetweenAirportsInKilometers", () => {
  it("in case set a non existing start airport, it should return a result error", () => {
    const startAiport = "XXX";
    const endAiport = "STR";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAiport,
      endAiport,
    );

    expect(actual.isErr).toBe(true);
  });

  it("in case set a non existing end airport, it should return a result error", () => {
    const startAiport = "BER";
    const endAiport = "XXX";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAiport,
      endAiport,
    );

    expect(actual.isErr).toBe(true);
  });

  it("in case set a start and end airport, it should return ok and the distance above 500km", () => {
    const startAiport = "BER";
    const endAiport = "STR";
    const actual = calculateDistanceBetweenAirportsInKilometers(
      startAiport,
      endAiport,
    );

    const expctedGraterThanValue = 500;

    expect(actual.isOk).toBe(true);
    expect(actual.isOk ? actual.value > expctedGraterThanValue : false).toBe(
      true,
    );
  });
});
