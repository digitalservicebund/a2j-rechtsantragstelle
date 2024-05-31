import { Result } from "true-myth";
import {
  COMPENSATION_VALUE_ABOVE_3000_KM,
  COMPENSATION_VALUE_UNTIL_1500_KM,
  COMPENSATION_VALUE_UNTIL_3000_KM,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3000_KM,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM,
  TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3000_KM,
  getCompensantionPaymentString,
  getEndAirportName,
  getLastDaytFromFourYearsAgoDate,
  getRouteCompensationDescription,
  getStartAirportName,
} from "~/models/flows/fluggastrechte/stringReplacements";
import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";

jest.mock("~/util/calculateDistanceBetweenAirports");

const mockedCalculateDistanceBetweenAirports =
  calculateDistanceBetweenAirportsInKilometers as jest.Mocked<
    typeof calculateDistanceBetweenAirportsInKilometers
  >;

const TRANSLATION_KEY_RECORD = {
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_1500_KM]:
    "Kurzstrecke (unter 1.500 km)",
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3000_KM]:
    "Mittelstrecke (zwischen 1.500 und 3.000 km)",
  [TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3000_KM]:
    "Langstrecke (über 3.000 km)",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getCompensantionPaymentString", () => {
  it("if the distance is until 1500, it should return compensation value until 1500", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.ok(1500),
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_UNTIL_1500_KM,
    });
  });

  it("if the distance is until 3000, it should return compensation value until 3000", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.ok(3000),
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_UNTIL_3000_KM,
    });
  });

  it("if the distance is above 3000, it should return compensation value above 3000", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.ok(3001),
    );

    const actual = getCompensantionPaymentString({});

    expect(actual).toStrictEqual({
      compensationPayment: COMPENSATION_VALUE_ABOVE_3000_KM,
    });
  });

  it("if the distance calculatesd returns an error, it should return empty object", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.err(""),
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
  it("if the distance is until 1500, it should return route compensation description until 1500", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.ok(1500),
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

  it("if the distance is until 3000, it should return route compensation description until 3000", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.ok(3000),
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);
    const expectedTranslation =
      TRANSLATION_KEY_RECORD[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_UNTIL_3000_KM
      ];

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("if the distance is above 3000, it should return return route compensation description above 3000", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.ok(3001),
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);
    const expectedTranslation =
      TRANSLATION_KEY_RECORD[
        TRANSLATION_ROUTE_COMPENSATION_DESCRIPTION_ABOVE_3000_KM
      ];

    expect(actual).toStrictEqual({
      routeCompensationDescription: expectedTranslation,
    });
  });

  it("if the distance calculatesd returns an error, it should return empty object", () => {
    (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
      Result.err(""),
    );

    const actual = getRouteCompensationDescription({}, TRANSLATION_KEY_RECORD);

    expect(actual).toStrictEqual({});
  });
});
