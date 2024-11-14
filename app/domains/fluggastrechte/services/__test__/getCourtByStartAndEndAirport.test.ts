// @vitest-environment node
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getAirportByIataCode } from "../airports/getAirportByIataCode";
import { getCourtByStartAndEndAirport } from "../getCourtByStartAndEndAirport";

vi.mock("~/services/gerichtsfinder/amtsgerichtData.server");

const startAirportMock = "BER";
const endAirportMock = "FRA";

export const pilotCourtStartAirportAmtsgericht: Jmtd14VTErwerberGerbeh = {
  AG: "start",
  BEZEICHNUNG: "start",
  LG: "start",
  LKZ: "start",
  OLG: "start",
  ORT: "start",
  ORTK: "start",
  PLZ_ZUSTELLBEZIRK: "start",
  STR_HNR: "start",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  XML_SUPPORT: "JA",
} as const;

export const pilotCourtEndAirportAmtsgericht: Jmtd14VTErwerberGerbeh = {
  AG: "end",
  BEZEICHNUNG: "end",
  LG: "end",
  LKZ: "end",
  OLG: "end",
  ORT: "end",
  ORTK: "end",
  PLZ_ZUSTELLBEZIRK: "end",
  STR_HNR: "end",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  XML_SUPPORT: "JA",
} as const;

beforeAll(() => {
  const zipCodeStartAirport =
    getAirportByIataCode(startAirportMock)?.zipCodePilotCourt;
  const zipCodeEndAirport =
    getAirportByIataCode(endAirportMock)?.zipCodePilotCourt;

  vi.mocked(findCourt).mockImplementation(({ zipCode }) => {
    if (zipCode === zipCodeStartAirport) {
      return pilotCourtStartAirportAmtsgericht;
    }

    if (zipCode == zipCodeEndAirport) {
      return pilotCourtEndAirportAmtsgericht;
    }

    return undefined;
  });
});

describe("getCourtByStartAndEndAirport", () => {
  it("should return undefined given not exist startIataCodeAirport", () => {
    const actual = getCourtByStartAndEndAirport("XXX", endAirportMock);

    expect(actual).toBeUndefined();
  });

  it("should return undefined given not exist endIataCodeAirport", () => {
    const actual = getCourtByStartAndEndAirport(startAirportMock, "XXX");

    expect(actual).toBeUndefined();
  });

  it("should return undefined given an exist start and end airport and both do not have pilot court", () => {
    const actual = getCourtByStartAndEndAirport("GRU", "GRU");

    expect(actual).toBeUndefined();
  });

  it("should return a court given from the start airport", () => {
    const actual = getCourtByStartAndEndAirport(
      startAirportMock,
      endAirportMock,
    );

    expect(actual).toStrictEqual(pilotCourtStartAirportAmtsgericht);
  });

  it("should return a court from the end airport when the start airport does not have pilot court", () => {
    const actual = getCourtByStartAndEndAirport("CDG", endAirportMock);

    expect(actual).toStrictEqual(pilotCourtEndAirportAmtsgericht);
  });
});
