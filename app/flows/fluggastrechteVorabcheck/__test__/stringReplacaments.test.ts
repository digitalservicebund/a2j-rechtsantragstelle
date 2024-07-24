import {
  COMPENSATION_VALUE_600,
  COMPENSATION_VALUE_400,
  COMPENSATION_VALUE_250,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_INSIDE_EU,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_OUTSIDE_EU,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3500_KM,
  getCompensantionPaymentString,
  getEndAirportName,
  getLastDaytFromFourYearsAgoDate,
  getRouteCompensationDescription,
  getStartAirportName,
  hasSchlichtungsstelleBfJ,
  hasSchlichtungsstelleSoeP,
} from "~/flows/fluggastrechteVorabcheck/stringReplacements";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";

vi.mock("~/services/airports/getRouteCompensationBetweenAirports");

const mockedGetRouteCompensationBetweenAirports = vi.mocked(
  getRouteCompensationBetweenAirports,
);

const EXPECTED_TRANSLATION_KEY_RECORDS = {
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM]:
    "Kurzstrecke (unter 1.500 km)",
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3500_KM]:
    "Mittelstrecke (zwischen 1.500 und 3.000 km)",
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_INSIDE_EU]:
    "Langstrecke (über 3.500 km) innerhalb der EU",
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_OUTSIDE_EU]:
    "Langstrecke (über 3.500 km), bei der ein Flughafen außerhalb der EU liegt",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getCompensantionPaymentString", () => {
  it("should return compensation value 200, if the distance is until 1500", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("shortDistance");

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_250,
    });
  });

  it("should return compensation value 400, if the distance is until 3500", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_400,
    });
  });

  it("should return compensation value 400, if the distance is above 3500 inside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceInsideEU",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_400,
    });
  });

  it("should return compensation value 600, if the distance is above 3500 outside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceOutsideEU",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_600,
    });
  });

  it("should return empty object, if the distance calculatesd returns notPossibleCalculateDistance", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "notPossibleCalculateDistance",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({});
  });
});

describe("getLastDaytFromFourYearsAgoDate", () => {
  it("should return the last of the year from 4 years ago from 2026.01.01", () => {
    vi.useFakeTimers().setSystemTime(new Date("2026-01-01"));

    const actual = getLastDaytFromFourYearsAgoDate();
    expect(actual).toBe("31.12.2022");
  });

  it("should return the last of the year from 4 years ago from 2024.01.01", () => {
    vi.useFakeTimers().setSystemTime(new Date("2024-01-01"));

    const actual = getLastDaytFromFourYearsAgoDate();
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

describe("getRouteCompensationDescription", () => {
  it("should return route compensation description until 1500, if the distance is short", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("shortDistance");

    const expectedTranslation =
      EXPECTED_TRANSLATION_KEY_RECORDS[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM
      ];

    const actual = getRouteCompensationDescription(
      {},
      EXPECTED_TRANSLATION_KEY_RECORDS,
    );

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("should return route compensation description until 3500, if the distance is middle", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue("middleDistance");

    const expectedTranslation =
      EXPECTED_TRANSLATION_KEY_RECORDS[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3500_KM
      ];

    const actual = getRouteCompensationDescription(
      {},
      EXPECTED_TRANSLATION_KEY_RECORDS,
    );

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("should return return route compensation description above 3500 inside EU, if the distance is above 3500 inside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceInsideEU",
    );

    const expectedTranslation =
      EXPECTED_TRANSLATION_KEY_RECORDS[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_INSIDE_EU
      ];

    const actual = getRouteCompensationDescription(
      {},
      EXPECTED_TRANSLATION_KEY_RECORDS,
    );

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("should return return route compensation description above 3500 outside EU, if the distance is above 3500 outside EU", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "longDistanceOutsideEU",
    );

    const expectedTranslation =
      EXPECTED_TRANSLATION_KEY_RECORDS[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_OUTSIDE_EU
      ];

    const actual = getRouteCompensationDescription(
      {},
      EXPECTED_TRANSLATION_KEY_RECORDS,
    );

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("should return empty object, if the distance can not be calculated", () => {
    mockedGetRouteCompensationBetweenAirports.mockReturnValue(
      "notPossibleCalculateDistance",
    );

    const actual = getRouteCompensationDescription(
      {},
      EXPECTED_TRANSLATION_KEY_RECORDS,
    );

    expect(actual).toStrictEqual({});
  });
});

describe("hasSchlichtungsstelleBfJ", () => {
  it("should return hasSchlichtungsstelleBfJ object as true, in case does not exist fluggesellschaft", () => {
    const actual = hasSchlichtungsstelleBfJ({});
    expect(actual).toStrictEqual({ hasSchlichtungsstelleBfJ: true });
  });

  it("should return hasSchlichtungsstelleBfJ object as true, in case does fluggesellschaft is empty", () => {
    const actual = hasSchlichtungsstelleBfJ({ fluggesellschaft: "" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleBfJ: true });
  });

  it("should return hasSchlichtungsstelleBfJ object as true, in case does fluggesellschaft does not exit", () => {
    const actual = hasSchlichtungsstelleBfJ({ fluggesellschaft: "XXXXX" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleBfJ: true });
  });

  it("should return hasSchlichtungsstelleBfJ object as true, in case does fluggesellschaft belongs to BfJ", () => {
    const actual = hasSchlichtungsstelleBfJ({ fluggesellschaft: "IB" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleBfJ: true });
  });

  it("should return hasSchlichtungsstelleBfJ object as true, in case does arbitrationBoard of fluggesellschaft is empty", () => {
    const actual = hasSchlichtungsstelleBfJ({ fluggesellschaft: "sonstiges" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleBfJ: true });
  });

  it("should return hasSchlichtungsstelleBfJ object as false, in case does fluggesellschaft belongs to söp", () => {
    const actual = hasSchlichtungsstelleBfJ({ fluggesellschaft: "LH" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleBfJ: false });
  });
});

describe("hasSchlichtungsstelleSoeP", () => {
  it("should return hasSchlichtungsstelleSoeP object as true, in case does not exist fluggesellschaft", () => {
    const actual = hasSchlichtungsstelleSoeP({});
    expect(actual).toStrictEqual({ hasSchlichtungsstelleSoeP: true });
  });

  it("should return hasSchlichtungsstelleSoP object as true, in case does fluggesellschaft is empty", () => {
    const actual = hasSchlichtungsstelleSoeP({ fluggesellschaft: "" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleSoeP: true });
  });

  it("should return hasSchlichtungsstelleSoeP object as true, in case does fluggesellschaft does not exit", () => {
    const actual = hasSchlichtungsstelleSoeP({ fluggesellschaft: "XXXXX" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleSoeP: true });
  });

  it("should return hasSchlichtungsstelleSoeP object as true, in case does fluggesellschaft belongs to söp", () => {
    const actual = hasSchlichtungsstelleSoeP({ fluggesellschaft: "LH" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleSoeP: true });
  });

  it("should return hasSchlichtungsstelleSoeP object as true, in case does arbitrationBoard of fluggesellschaft is empty", () => {
    const actual = hasSchlichtungsstelleSoeP({ fluggesellschaft: "sonstiges" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleSoeP: true });
  });

  it("should return hasSchlichtungsstelleSoeP object as false, in case does fluggesellschaft belongs to BfJ", () => {
    const actual = hasSchlichtungsstelleSoeP({ fluggesellschaft: "IB" });
    expect(actual).toStrictEqual({ hasSchlichtungsstelleSoeP: false });
  });
});
