import {
  COMPENSATION_VALUE_250,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_600,
} from "~/domains/fluggastrechte/vorabcheck/stringReplacements";
import { getCompensationPayment } from "../../airports/getCompensationPayment";
import { getRouteCompensationBetweenAirports } from "../getRouteCompensationBetweenAirports";

vi.mock("../getRouteCompensationBetweenAirports");

const getRouteCompensationBetweenAirportsMock = vi.mocked(
  getRouteCompensationBetweenAirports,
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCompensationPayment", () => {
  it("should return COMPENSATION_VALUE_600 for longDistanceOutsideEU", () => {
    getRouteCompensationBetweenAirportsMock.mockReturnValue(
      "longDistanceOutsideEU",
    );

    const result = getCompensationPayment({
      startAirport: "JFK",
      endAirport: "NRT",
    });

    expect(result).toBe(COMPENSATION_VALUE_600);
  });

  it("should return COMPENSATION_VALUE_400 for longDistanceInsideEU", () => {
    getRouteCompensationBetweenAirportsMock.mockReturnValue(
      "longDistanceInsideEU",
    );

    const result = getCompensationPayment({
      startAirport: "CDG",
      endAirport: "ATH",
    });

    expect(result).toBe(COMPENSATION_VALUE_400);
  });

  it("should return COMPENSATION_VALUE_400 for middleDistance", () => {
    getRouteCompensationBetweenAirportsMock.mockReturnValue("middleDistance");

    const result = getCompensationPayment({
      startAirport: "LHR",
      endAirport: "BER",
    });

    expect(result).toBe(COMPENSATION_VALUE_400);
  });

  it("should return COMPENSATION_VALUE_250 for shortDistance", () => {
    getRouteCompensationBetweenAirportsMock.mockReturnValue("shortDistance");

    const result = getCompensationPayment({
      startAirport: "LHR",
      endAirport: "AMS",
    });

    expect(result).toBe(COMPENSATION_VALUE_250);
  });
});
