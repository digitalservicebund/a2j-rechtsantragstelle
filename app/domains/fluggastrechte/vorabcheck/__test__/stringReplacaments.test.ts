import {
  COMPENSATION_VALUE_600,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_250,
  getCompensationPaymentString,
  getEndAirportName,
  getLastDayFromFourYearsAgoDate,
  getStartAirportName,
  hasArbitrationBoardBfJ,
  hasArbitrationBoardSoeP,
  hasCompensationLongDistanceInsideEU,
  hasCompensationLongDistanceOutsideEU,
  hasCompensationMiddleDistance,
  hasCompensationShortDistance,
} from "~/domains/fluggastrechte/vorabcheck/stringReplacements";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";

vi.mock("~/services/airports/getRouteCompensationBetweenAirports");

const mockedGetRouteCompensationBetweenAirports = vi.mocked(
  getRouteCompensationBetweenAirports,
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCompensationPaymentString", () => {
  it("should return compensation value 200, if the distance is until 1500", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("shortDistance");

    const actual = getCompensationPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_250,
    });
  });

  it("should return compensation value 400, if the distance is until 3500", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const actual = getCompensationPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_400,
    });
  });

  it("should return compensation value 400, if the distance is above 3500 inside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceInsideEU",
    );

    const actual = getCompensationPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_400,
    });
  });

  it("should return compensation value 600, if the distance is above 3500 outside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceOutsideEU",
    );

    const actual = getCompensationPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_600,
    });
  });

  it("should return empty object, if the distance calculated returns notPossibleCalculateDistance", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "notPossibleCalculateDistance",
    );

    const actual = getCompensationPaymentString({});

    expect(actual).toStrictEqual({});
  });
});

describe("getLastDayFromFourYearsAgoDate", () => {
  it("should return the last of the year from 4 years ago from 2026.01.01", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-01-01"));

    const actual = getLastDayFromFourYearsAgoDate();
    expect(actual).toBe("31.12.2022");
  });

  it("should return the last of the year from 4 years ago from 2024.01.01", () => {
    vi.useFakeTimers().setSystemTime(new Date("2024-01-01"));

    const actual = getLastDayFromFourYearsAgoDate();
    expect(actual).toBe("31.12.2020");
  });
});

describe("getStartAirportName", () => {
  it("should return the correct name of the airport", () => {
    const actual = getStartAirportName({ startAirport: "BER" });
    expect(actual).toStrictEqual({
      startAirport: "Berlin Brandenburg Flughafen (BER)",
    });
  });

  it("should return empty when it does not have airport as parameter", () => {
    const actual = getStartAirportName({});
    expect(actual).toStrictEqual({});
  });

  it("should return empty when the airport does not exist in the json file", () => {
    const actual = getStartAirportName({ startAirport: "XXXXX" });
    expect(actual).toStrictEqual({});
  });
});

describe("getEndAirportName", () => {
  it("should return the correct name of the airport", () => {
    const actual = getEndAirportName({ endAirport: "BER" });
    expect(actual).toStrictEqual({
      endAirport: "Berlin Brandenburg Flughafen (BER)",
    });
  });

  it("should return empty when it does not have airport as parameter", () => {
    const actual = getEndAirportName({});
    expect(actual).toStrictEqual({});
  });

  it("should return empty when the airport does not exist in the json file", () => {
    const actual = getEndAirportName({ endAirport: "XXXXX" });
    expect(actual).toStrictEqual({});
  });
});

describe("hasArbitrationBoardBfJ", () => {
  it("should return hasArbitrationBoardBfJ object as true, in case fluggesellschaft is undefined", () => {
    const actual = hasArbitrationBoardBfJ({});
    expect(actual).toStrictEqual({ hasArbitrationBoardBfJ: true });
  });

  it("should return hasArbitrationBoardBfJ object as true, in case fluggesellschaft is empty", () => {
    const actual = hasArbitrationBoardBfJ({ fluggesellschaft: "" });
    expect(actual).toStrictEqual({ hasArbitrationBoardBfJ: true });
  });

  it("should return hasArbitrationBoardBfJ object as true, in case fluggesellschaft does not exit", () => {
    const actual = hasArbitrationBoardBfJ({ fluggesellschaft: "XXXXX" });
    expect(actual).toStrictEqual({ hasArbitrationBoardBfJ: true });
  });

  it("should return hasArbitrationBoardBfJ object as true, in case fluggesellschaft belongs to BfJ", () => {
    const actual = hasArbitrationBoardBfJ({ fluggesellschaft: "IB" });
    expect(actual).toStrictEqual({ hasArbitrationBoardBfJ: true });
  });

  it("should return hasArbitrationBoardBfJ object as true, in case arbitrationBoard of fluggesellschaft is null", () => {
    const actual = hasArbitrationBoardBfJ({ fluggesellschaft: "sonstiges" });
    expect(actual).toStrictEqual({ hasArbitrationBoardBfJ: true });
  });

  it("should return hasArbitrationBoardBfJ object as false, in case fluggesellschaft belongs to söp", () => {
    const actual = hasArbitrationBoardBfJ({ fluggesellschaft: "LH" });
    expect(actual).toStrictEqual({ hasArbitrationBoardBfJ: false });
  });
});

describe("hasArbitrationBoardSoeP", () => {
  it("should return hasArbitrationBoardSoeP object as true, in case fluggesellschaft is undefined", () => {
    const actual = hasArbitrationBoardSoeP({});
    expect(actual).toStrictEqual({ hasArbitrationBoardSoeP: true });
  });

  it("should return hasArbitrationBoardSoP object as true, in case fluggesellschaft is empty", () => {
    const actual = hasArbitrationBoardSoeP({ fluggesellschaft: "" });
    expect(actual).toStrictEqual({ hasArbitrationBoardSoeP: true });
  });

  it("should return hasArbitrationBoardSoeP object as true, in case fluggesellschaft does not exit", () => {
    const actual = hasArbitrationBoardSoeP({ fluggesellschaft: "XXXXX" });
    expect(actual).toStrictEqual({ hasArbitrationBoardSoeP: true });
  });

  it("should return hasArbitrationBoardSoeP object as true, in case fluggesellschaft belongs to söp", () => {
    const actual = hasArbitrationBoardSoeP({ fluggesellschaft: "LH" });
    expect(actual).toStrictEqual({ hasArbitrationBoardSoeP: true });
  });

  it("should return hasArbitrationBoardSoeP object as true, in case arbitrationBoard of fluggesellschaft is null", () => {
    const actual = hasArbitrationBoardSoeP({ fluggesellschaft: "sonstiges" });
    expect(actual).toStrictEqual({ hasArbitrationBoardSoeP: true });
  });

  it("should return hasArbitrationBoardSoeP object as false, in case fluggesellschaft belongs to BfJ", () => {
    const actual = hasArbitrationBoardSoeP({ fluggesellschaft: "IB" });
    expect(actual).toStrictEqual({ hasArbitrationBoardSoeP: false });
  });
});

describe("hasCompensationLongDistanceInsideEU", () => {
  it("should return hasLongDistanceInsideEU as true if compensation is long distance inside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceInsideEU",
    );

    const actual = hasCompensationLongDistanceInsideEU({});

    expect(actual).toStrictEqual({ hasLongDistanceInsideEU: true });
  });

  it("should return hasLongDistanceInsideEU as false if compensation is not long distance inside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const actual = hasCompensationLongDistanceInsideEU({});

    expect(actual).toStrictEqual({ hasLongDistanceInsideEU: false });
  });
});

describe("hasCompensationLongDistanceOutsideEU", () => {
  it("should return hasLongDistanceOutsideEU as true if compensation is long distance outside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceOutsideEU",
    );

    const actual = hasCompensationLongDistanceOutsideEU({});

    expect(actual).toStrictEqual({ hasLongDistanceOutsideEU: true });
  });

  it("should return hasLongDistanceOutsideEU as false if compensation is not long distance outside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const actual = hasCompensationLongDistanceOutsideEU({});

    expect(actual).toStrictEqual({ hasLongDistanceOutsideEU: false });
  });
});

describe("hasCompensationMiddleDistance", () => {
  it("should return hasMiddleDistance as true if compensation is middle distance", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const actual = hasCompensationMiddleDistance({});

    expect(actual).toStrictEqual({ hasMiddleDistance: true });
  });

  it("should return hasMiddleDistance as false if compensation is not middle", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceInsideEU",
    );

    const actual = hasCompensationMiddleDistance({});

    expect(actual).toStrictEqual({ hasMiddleDistance: false });
  });
});

describe("hasCompensationShortDistance", () => {
  it("should return hasShortDistance as true if compensation is short distance", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("shortDistance");

    const actual = hasCompensationShortDistance({});

    expect(actual).toStrictEqual({ hasShortDistance: true });
  });

  it("should return hasShortDistance as false if compensation is not short distance", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const actual = hasCompensationShortDistance({});

    expect(actual).toStrictEqual({ hasShortDistance: false });
  });
});