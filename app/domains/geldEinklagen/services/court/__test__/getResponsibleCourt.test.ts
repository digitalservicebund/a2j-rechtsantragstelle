import { type Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getPilotCourts } from "../getPilotCourts";
import { getResponsibleCourt } from "../getResponsibleCourt";

vi.mock("../getPilotCourts");

const baseCourtData = {
  BEZEICHNUNG: "",
  ORT: "",
  ORTK: "",
  PLZ_ZUSTELLBEZIRK: "",
  STR_HNR: "",
  XML_SUPPORT: "JA" as const,
};

const PILOT_COURT_BEKLAGTE: Jmtd14VTErwerberGerbeh = {
  LKZ: "11",
  OLG: "1",
  LG: "01",
  AG: "07",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  ...baseCourtData,
};

const PILOT_COURT_SECONDARY: Jmtd14VTErwerberGerbeh = {
  LKZ: "12",
  OLG: "2",
  LG: "02",
  AG: "08",
  TYP_INFO: "Zivilgericht - Amtsgericht",
  ...baseCourtData,
};

const mockResponsibleCourts = (courts: Jmtd14VTErwerberGerbeh[]) => {
  vi.mocked(getPilotCourts).mockReturnValue(courts);
};

describe("getResponsibleCourt", () => {
  it("should return undefined when no courts are available", () => {
    mockResponsibleCourts([]);

    const result = getResponsibleCourt({});

    expect(result).toBeUndefined();
  });

  it("should return undefined in case exist two courts but without pilotGerichtAuswahl in the user data", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE, PILOT_COURT_SECONDARY]);

    const result = getResponsibleCourt({});

    expect(result).toBeUndefined();
  });

  it("should return the pilot court of the beklagteCourt in case exist two courts", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE, PILOT_COURT_SECONDARY]);

    const result = getResponsibleCourt({
      pilotGerichtAuswahl: "beklagteCourt",
    });

    expect(result).toStrictEqual(PILOT_COURT_BEKLAGTE);
  });

  it("should return the pilot court of the sekundaerCourt in case exist two courts", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE, PILOT_COURT_SECONDARY]);

    const result = getResponsibleCourt({
      pilotGerichtAuswahl: "sekundaerCourt",
    });

    expect(result).toStrictEqual(PILOT_COURT_SECONDARY);
  });

  it("should return the pilot court in case exist only one responsible court", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE]);

    const result = getResponsibleCourt({
      pilotGerichtAuswahl: "sekundaerCourt",
    });

    expect(result).toStrictEqual(PILOT_COURT_BEKLAGTE);
  });
});
