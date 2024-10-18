import { Result } from "true-myth";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";
import { isEuropeanUnionAirport } from "~/services/airports/isEuropeanUnionAirport";
import { getRouteCompensationBetweenAirports } from "../getRouteCompensationBetweenAirports";

vi.mock("~/services/airports/calculateDistanceBetweenAirports");
vi.mock("~/services/airports/isEuropeanUnionAirport");

const mockedCalculateDistanceBetweenAirports = vi.mocked(
  calculateDistanceBetweenAirportsInKilometers,
);

const mockedIsEuropeanUnionAirport = vi.mocked(isEuropeanUnionAirport);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getRouteCompensationBetweenAirports", () => {
  it("should return longDistanceInsideEU if the distance is more than 3500km and the start and end aiports are in EU", () => {
    mockedCalculateDistanceBetweenAirports.mockReturnValue(Result.ok(3600));
    mockedIsEuropeanUnionAirport.mockReturnValue(true);

    const actual = getRouteCompensationBetweenAirports("BER", "MUN");

    expect(actual).toEqual("longDistanceInsideEU");
  });

  it("should return longDistanceOutsideEU if the distance is more than 3500km and the start and end aiports are not in EU", () => {
    mockedCalculateDistanceBetweenAirports.mockReturnValue(Result.ok(3600));
    mockedIsEuropeanUnionAirport.mockReturnValue(false);

    const actual = getRouteCompensationBetweenAirports("BER", "MUN");

    expect(actual).toEqual("longDistanceOutsideEU");
  });

  it("should return middleDistance if the distance is more than 1500km", () => {
    mockedCalculateDistanceBetweenAirports.mockReturnValue(Result.ok(1501));

    const actual = getRouteCompensationBetweenAirports("BER", "MUN");

    expect(actual).toEqual("middleDistance");
  });

  it("should return middleDistance if the distance is less than 3500km", () => {
    mockedCalculateDistanceBetweenAirports.mockReturnValue(Result.ok(3499));

    const actual = getRouteCompensationBetweenAirports("BER", "MUN");

    expect(actual).toEqual("middleDistance");
  });

  it("should return shortDistance if the distance is less than 1500km", () => {
    mockedCalculateDistanceBetweenAirports.mockReturnValue(Result.ok(1499));

    const actual = getRouteCompensationBetweenAirports("BER", "MUN");

    expect(actual).toEqual("shortDistance");
  });

  it("should return notPossibleCalculateDistance if the distance can not be calculated", () => {
    mockedCalculateDistanceBetweenAirports.mockReturnValue(
      Result.err("anything"),
    );

    const actual = getRouteCompensationBetweenAirports("BER", "MUN");

    expect(actual).toEqual("notPossibleCalculateDistance");
  });
});
