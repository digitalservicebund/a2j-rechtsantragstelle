import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
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
} satisfies FluggastrechtContext;

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
  it("should return empty start and end airport given undefined verspaeteterFlug", () => {
    const actual = getStartAndEndAirportDelayNames({
      verspaeteterFlug: undefined,
    });

    expect(actual.startAirportName).toBe("");
    expect(actual.endAirportName).toBe("");
  });

  it("should return correct the start and end airports given verspaeteterFlug as startAirportFirstZwischenstopp", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlug: "startAirportFirstZwischenstopp",
    } satisfies FluggastrechtContext;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(startAirportMock);
    expect(actual.endAirportName).toBe(ersterZwischenstoppMock);
  });

  it("should return correct the start and end airports given verspaeteterFlug as firstAirportSecondZwischenstopp", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlug: "firstAirportSecondZwischenstopp",
    } satisfies FluggastrechtContext;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(ersterZwischenstoppMock);
    expect(actual.endAirportName).toBe(zweiterZwischenstoppMock);
  });

  it("should return correct the start and end airports given verspaeteterFlug as firstZwischenstoppEndAirport", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlug: "firstZwischenstoppEndAirport",
    } satisfies FluggastrechtContext;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(ersterZwischenstoppMock);
    expect(actual.endAirportName).toBe(endAirportMock);
  });

  it("should return correct the start and end airports given verspaeteterFlug as secondAirportThirdZwischenstopp", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlug: "secondAirportThirdZwischenstopp",
    } satisfies FluggastrechtContext;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(zweiterZwischenstoppMock);
    expect(actual.endAirportName).toBe(dritterZwischenstoppMock);
  });

  it("should return correct the start and end airports given verspaeteterFlug as secondZwischenstoppEndAirport", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlug: "secondZwischenstoppEndAirport",
    } satisfies FluggastrechtContext;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(zweiterZwischenstoppMock);
    expect(actual.endAirportName).toBe(endAirportMock);
  });

  it("should return correct the start and end airports given verspaeteterFlug as thirdZwischenstoppEndAirport", () => {
    const userDataMock = {
      ...userDataBaseMock,
      verspaeteterFlug: "thirdZwischenstoppEndAirport",
    } satisfies FluggastrechtContext;

    const actual = getStartAndEndAirportDelayNames(userDataMock);

    expect(actual.startAirportName).toBe(dritterZwischenstoppMock);
    expect(actual.endAirportName).toBe(endAirportMock);
  });
});
