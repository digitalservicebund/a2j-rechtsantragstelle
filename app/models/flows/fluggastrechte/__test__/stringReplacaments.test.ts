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
} from "~/models/flows/fluggastrechte/stringReplacements";
import { getRouteCompensationBetweenAirports } from "~/services/airports/getRouteCompensationBetweenAirports";

jest.mock("~/services/airports/getRouteCompensationBetweenAirports");

const mockedGetRouteCompensationBetweenAirports =
  getRouteCompensationBetweenAirports as jest.Mocked<
    typeof getRouteCompensationBetweenAirports
  >;

const TRANSLATION_KEY_RECORD = {
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
  jest.clearAllMocks();
});

describe("getCompensantionPaymentString", () => {
  it("if the distance is until 1500, it should return compensation value 200", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "shortDistance",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_250,
    });
  });

  it("if the distance is until 3500, it should return compensation value 400", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "middleDistance",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_400,
    });
  });

  it("if the distance is above 3500 inside EU, it should return compensation value 400", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "longDistanceInsideEU",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_400,
    });
  });

  it("if the distance is above 3500 outside EU, it should return compensation value 600", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "longDistanceOutsideEU",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_600,
    });
  });

  it("if the distance calculatesd returns an error, it should return empty object", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "notPossibleCalculateDistance",
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({});
  });
});

describe("getLastDaytFromFourYearsAgoDate", () => {
  it("it should return the last of the year from 4 years ago from 2026.01.01", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-01"));

    const actual = getLastDaytFromFourYearsAgoDate();
    expect(actual).toBe("31.12.2022");
  });

  it("it should return the last of the year from 4 years ago from 2024.01.01", () => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

    const actual = getLastDaytFromFourYearsAgoDate();
    expect(actual).toBe("31.12.2020");
  });
});

describe("getStartAirportName", () => {
  it("it should return the correct name of the airport", () => {
    const actual = getStartAirportName({ startAirport: "BER" });
    expect(actual).toStrictEqual({
      startAirport: "Berlin Brandenburg Flughafen (BER)",
    });
  });

  it("it should return empty when it does not have airport as parameter", () => {
    const actual = getStartAirportName({});
    expect(actual).toStrictEqual({});
  });

  it("it should return empty when the airport does not exist in the json file", () => {
    const actual = getStartAirportName({ startAirport: "XXXXX" });
    expect(actual).toStrictEqual({});
  });
});

describe("getEndAirportName", () => {
  it("it should return the correct name of the airport", () => {
    const actual = getEndAirportName({ endAirport: "BER" });
    expect(actual).toStrictEqual({
      endAirport: "Berlin Brandenburg Flughafen (BER)",
    });
  });

  it("it should return empty when it does not have airport as parameter", () => {
    const actual = getEndAirportName({});
    expect(actual).toStrictEqual({});
  });

  it("it should return empty when the airport does not exist in the json file", () => {
    const actual = getEndAirportName({ endAirport: "XXXXX" });
    expect(actual).toStrictEqual({});
  });
});

describe("getRouteCompensationDescription", () => {
  it("if the distance is short, it should return route compensation description until 1500", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "shortDistance",
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);
    const expectedTranslation =
      TRANSLATION_KEY_RECORD[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM
      ];

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("if the distance is middle, it should return route compensation description until 3500", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "middleDistance",
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);
    const expectedTranslation =
      TRANSLATION_KEY_RECORD[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3500_KM
      ];

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("if the distance is above 3500 inside EU, it should return return route compensation description above 3500 inside EU", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "longDistanceInsideEU",
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);
    const expectedTranslation =
      TRANSLATION_KEY_RECORD[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_INSIDE_EU
      ];

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("if the distance is above 3500 outside EU, it should return return route compensation description above 3500 inside EU", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "longDistanceOutsideEU",
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);
    const expectedTranslation =
      TRANSLATION_KEY_RECORD[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3500_KM_OUTSIDE_EU
      ];

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("if the distance can not be calculated, it should return empty object", () => {
    (mockedGetRouteCompensationBetweenAirports as jest.Mock).mockReturnValue(
      "notPossibleCalculateDistance",
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);

    expect(actual).toStrictEqual({});
  });
});
