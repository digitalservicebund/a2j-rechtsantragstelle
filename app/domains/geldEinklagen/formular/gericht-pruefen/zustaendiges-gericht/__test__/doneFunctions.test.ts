import { getPilotCourts } from "~/domains/geldEinklagen/services/court/getPilotCourts";
import { type Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { zustaendigesGerichtDone } from "../doneFunctions";

vi.mock("~/domains/geldEinklagen/services/court/getPilotCourts");

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

describe("zustaendigesGerichtDone", () => {
  it("should return false when no pilot courts are available", () => {
    mockResponsibleCourts([]);

    const actual = zustaendigesGerichtDone({ context: {} });

    expect(actual).toBe(false);
  });

  it("should return true when one pilot court is available", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE]);

    const actual = zustaendigesGerichtDone({ context: {} });

    expect(actual).toBe(true);
  });

  it("should return false when two pilot courts are available but no pilotGerichtAuswahl", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE, PILOT_COURT_SECONDARY]);

    const actual = zustaendigesGerichtDone({
      context: { pilotGerichtAuswahl: undefined },
    });

    expect(actual).toBe(false);
  });

  it("should return true when two pilot courts are available and pilotGerichtAuswahl", () => {
    mockResponsibleCourts([PILOT_COURT_BEKLAGTE, PILOT_COURT_SECONDARY]);

    const actual = zustaendigesGerichtDone({
      context: { pilotGerichtAuswahl: "beklagteCourt" },
    });

    expect(actual).toBe(true);
  });
});
