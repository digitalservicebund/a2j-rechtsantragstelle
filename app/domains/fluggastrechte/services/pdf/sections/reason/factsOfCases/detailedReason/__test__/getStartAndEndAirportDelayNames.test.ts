import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getStartAndEndAirportDelayNames } from "../getStartAndEndAirportDelayNames";

vi.mock("~/domains/fluggastrechte/services/airports/getAirportNameByIataCode");

const startAirportMock = "BERLIN";
const ersterZwischenstoppMock = "FRANKFURT";
const zweiterZwischenstoppMock = "MUNICH";
const dritterZwischenstoppMock = "DRESDEN";
const endAirportMock = "NEW YORK";

const userDataBaseMock = {
  startAirport: "BER",
  endAirport: "JFK",
  ersterZwischenstopp: "FRA",
  zweiterZwischenstopp: "MUC",
  dritterZwischenstopp: "DRS",
} satisfies FluggastrechteUserData;

beforeEach(() => {
  vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
    if (airport === "BER") {
      return startAirportMock;
    }

    if (airport === "FRA") {
      return ersterZwischenstoppMock;
    }

    if (airport === "MUC") {
      return zweiterZwischenstoppMock;
    }

    if (airport === "DRS") {
      return dritterZwischenstoppMock;
    }

    return endAirportMock;
  });
});

describe("getStartAndEndAirportDelayNames", () => {
  it("should return empty start and end airport given undefined verspaeteterFlugOneStop, undefined verspaeteterFlugTwoStops, and undefined verspaeteterFlugThreeStops", () => {
    const actual = getStartAndEndAirportDelayNames({
      verspaeteterFlugOneStop: undefined,
      verspaeteterFlugTwoStops: undefined,
      verspaeteterFlugThreeStops: undefined,
    });

    expect(actual.startAirportName).toBe("");
    expect(actual.endAirportName).toBe("");
  });

  it("should return correct the start and end airports given verspaeteterFlugOneStop as startAirportFirstZwischenstopp", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlugOneStop: "startAirportFirstZwischenstopp",
    } satisfies FluggastrechteUserData;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(startAirportMock);
    expect(actual.endAirportName).toBe(ersterZwischenstoppMock);
  });

  it("should return correct the start and end airports given verspaeteterFlugTwoStops as firstAirportSecondZwischenstopp", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlugTwoStops: "firstAirportSecondZwischenstopp",
    } satisfies FluggastrechteUserData;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(ersterZwischenstoppMock);
    expect(actual.endAirportName).toBe(zweiterZwischenstoppMock);
  });

  it("should return correct the start and end airports given verspaeteterFlugOneStop as firstZwischenstoppEndAirport", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlugOneStop: "firstZwischenstoppEndAirport",
    } satisfies FluggastrechteUserData;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(ersterZwischenstoppMock);
    expect(actual.endAirportName).toBe(endAirportMock);
  });

  it("should return correct the start and end airports given verspaeteterFlugThreeStops as secondAirportThirdZwischenstopp", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlugThreeStops: "secondAirportThirdZwischenstopp",
    } satisfies FluggastrechteUserData;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(zweiterZwischenstoppMock);
    expect(actual.endAirportName).toBe(dritterZwischenstoppMock);
  });

  it("should return correct the start and end airports given verspaeteterFlugTwoStops as secondZwischenstoppEndAirport", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlugTwoStops: "secondZwischenstoppEndAirport",
    } satisfies FluggastrechteUserData;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(zweiterZwischenstoppMock);
    expect(actual.endAirportName).toBe(endAirportMock);
  });

  it("should return correct the start and end airports given verspaeteterFlugThreeStops as thirdZwischenstoppEndAirport", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlugThreeStops: "thirdZwischenstoppEndAirport",
    } satisfies FluggastrechteUserData;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(dritterZwischenstoppMock);
    expect(actual.endAirportName).toBe(endAirportMock);
  });
});
