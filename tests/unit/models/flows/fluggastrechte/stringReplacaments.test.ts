import {
  COMPENSATION_VALUE_ABOVE_3000_KM,
  COMPENSATION_VALUE_UNTIL_1500_KM,
  COMPENSATION_VALUE_UNTIL_3000_KM,
  getCompensantionPaymentString,
  getLastDaytFromFourYearsAgoDate,
} from "~/models/flows/fluggastrechte/stringReplacements";
import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import { Result } from "true-myth";

jest.mock("~/util/calculateDistanceBetweenAirports");

const mockedCalculateDistanceBetweenAirports =
  calculateDistanceBetweenAirportsInKilometers as jest.Mocked<
    typeof calculateDistanceBetweenAirportsInKilometers
  >;

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
